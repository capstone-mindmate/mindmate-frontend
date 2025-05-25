import { useEffect, useRef, useState, useCallback } from 'react'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'
import { useAuthStore } from '../stores/userStore'
import { useMessageStore } from '../store/messageStore'
import { getTokenCookie } from '../utils/fetchWithRefresh'

// 전역 상태 변수들
let globalStompClient: Client | null = null
let connectionAttempts = 0
const MAX_RECONNECT_DELAY = 30000 // 최대 30초까지 재연결 지연
const INITIAL_RECONNECT_DELAY = 1000 // 초기 1초
const initializePromise: { promise: Promise<Client | null> | null } = {
  promise: null,
}

// 전역 구독 저장 (중복 구독 방지)
const globalSubscriptions: { [key: string]: any } = {}

// 마지막 API 요청 시간
let lastApiRequestTime = 0
// API 요청 간 최소 간격 (10초)
const API_REQUEST_THROTTLE = 10000

// 마지막으로 수신한 읽지 않은 메시지 수
let lastUnreadCount = 0

// 웹소켓 연결 초기화 함수 - 한 번만 실행되도록 Promise 기반 제어
const initializeConnection = (token: string): Promise<Client | null> => {
  if (initializePromise.promise) {
    return initializePromise.promise
  }

  // 이미 연결된 클라이언트가 있는 경우 재사용
  if (globalStompClient && globalStompClient.connected) {
    return Promise.resolve(globalStompClient)
  }

  initializePromise.promise = new Promise((resolve) => {
    try {
      console.log('웹소켓 연결 초기화 시작...')

      // 소켓 연결
      const socket = new SockJS('https://mindmate.shop/api/ws')
      const stompClient = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        debug: (str) => {
          if (import.meta.env.MODE !== 'production') {
            // console.log('STOMP: ' + str)
          }
        },
        // reconnectDelay에 함수 대신 고정 값 지정
        reconnectDelay: 5000,
        // 커스텀 재연결 핸들러
        beforeConnect: () => {
          // 항상 최신 토큰으로 갱신
          stompClient.connectHeaders = {
            Authorization: `Bearer ${getTokenCookie('accessToken')}`,
          }
          const delay = Math.min(
            INITIAL_RECONNECT_DELAY * Math.pow(1.5, connectionAttempts),
            MAX_RECONNECT_DELAY
          )
          console.log(
            `재연결 시도 ${connectionAttempts}회, 대기 시간: ${delay}ms`
          )
          // 실제 재연결 지연은 stompjs 내부에서 처리
        },
      })

      // 연결 시 콜백
      stompClient.onConnect = (frame) => {
        // console.log('웹소켓 연결 성공:', frame)
        connectionAttempts = 0 // 연결 성공 시 시도 횟수 리셋
        globalStompClient = stompClient
        resolve(stompClient)
      }

      // 오류 처리
      stompClient.onStompError = (frame) => {
        // console.error('STOMP 오류:', frame.headers, frame.body)
        resolve(null)
      }

      // 연결 실패 시
      socket.onclose = () => {
        if (!globalStompClient?.connected) {
          connectionAttempts++
          console.log(`웹소켓 연결 실패 (${connectionAttempts}회)`)

          // 최대 시도 횟수 초과 시 (5회)
          if (connectionAttempts >= 5) {
            // console.error('웹소켓 연결 최대 시도 횟수 초과, 연결 중단')
            resolve(null)
          }
        }
      }

      // 연결 활성화
      stompClient.activate()
    } catch (error) {
      // console.error('웹소켓 초기화 오류:', error)
      resolve(null)
    }
  })

  return initializePromise.promise
}

export const useSocketMessage = () => {
  const { user } = useAuthStore()
  const { setTotalUnreadCount, updateRoomUnreadCount } = useMessageStore()
  const [client, setClient] = useState<Client | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const lastRequestTimeRef = useRef<number>(0) // 마지막 요청 시간 ref 추가
  const lastPresenceTimeRef = useRef<number>(0) // 마지막 presence 메시지 전송 시간
  const hasReceivedUnreadCountRef = useRef<boolean>(false) // 소켓으로부터 메시지를 받았는지 여부
  const unreadCountTimerRef = useRef<any>(null) // 타이머 참조
  const isInitializedRef = useRef<boolean>(false) // 최초 초기화 여부

  // 주기적으로 REST API에서 읽지 않은 메시지 수를 가져오는 함수
  const startUnreadCountPolling = useCallback((token: string) => {
    if (unreadCountTimerRef.current) return // 이미 타이머 있으면 중복 생성 방지
    unreadCountTimerRef.current = setInterval(() => {
      if (!hasReceivedUnreadCountRef.current) {
        fetchTotalUnreadCount(token, true)
      }
      hasReceivedUnreadCountRef.current = false
    }, 60000)
  }, [])

  useEffect(() => {
    // 이미 초기화되었으면 중복 초기화 방지
    if (isInitializedRef.current) {
      return
    }

    // 이미 연결된 경우 재사용
    if (globalStompClient && globalStompClient.connected) {
      setClient(globalStompClient)
      setIsConnected(true)
      isInitializedRef.current = true
      return
    }

    let isMounted = true
    const connectSocket = async () => {
      // 토큰 확인
      const cookieToken = getTokenCookie('accessToken')
      const tokenToUse = user?.accessToken || cookieToken

      if (!tokenToUse) {
        console.log('토큰이 없어 웹소켓 연결을 시도하지 않습니다.')
        return
      }

      try {
        // 웹소켓 연결 초기화 (공유 인스턴스 사용)
        const stompClient = await initializeConnection(tokenToUse)

        if (!isMounted) return

        if (stompClient && stompClient.connected) {
          setClient(stompClient)
          setIsConnected(true)
          isInitializedRef.current = true

          // 전체 읽지 않은 메시지 수 구독 (중복 방지)
          if (!globalSubscriptions['total-unread']) {
            globalSubscriptions['total-unread'] = stompClient.subscribe(
              '/user/queue/total-unread',
              (message) => {
                try {
                  const data = JSON.parse(message.body)
                  // console.log('전체 읽지 않은 메시지:', data)

                  // 읽지 않은 메시지 수가 숫자인지 확인하고 업데이트
                  // data가 다양한 형식으로 올 수 있으므로 여러 필드 체크
                  let count = 0

                  if (typeof data === 'number') {
                    // 숫자 형식으로 직접 왔을 경우
                    count = data
                  } else if (data && typeof data.count === 'number') {
                    // { count: 숫자 } 형식으로 왔을 경우
                    count = data.count
                  } else if (
                    data &&
                    typeof data.totalUnreadCount === 'number'
                  ) {
                    // { totalUnreadCount: 숫자 } 형식으로 왔을 경우
                    count = data.totalUnreadCount
                  } else if (data && typeof data.unreadCount === 'number') {
                    // { unreadCount: 숫자 } 형식으로 왔을 경우
                    count = data.unreadCount
                  }

                  // console.log('REST API에서 파싱된 읽지 않은 메시지 수:', count)

                  // 이전 값과 같으면 무시
                  if (count === lastUnreadCount) {
                    // console.log('동일한 값으로 업데이트 무시:', count)
                    return
                  }

                  lastUnreadCount = count

                  // 스토어 업데이트
                  setTotalUnreadCount(count)

                  // 네비게이션 바에서 즉시 업데이트되도록 이벤트 발생
                  window.dispatchEvent(
                    new CustomEvent('unread-count-updated', {
                      detail: { count },
                    })
                  )

                  // 소켓으로부터 메시지를 받았음을 표시
                  hasReceivedUnreadCountRef.current = true
                } catch (e) {
                  // console.error('전체 읽지 않은 메시지 파싱 오류:', e)
                }
              }
            )
          }

          // 채팅방별 읽지 않은 메시지 수 구독 (중복 방지)
          if (!globalSubscriptions['unread']) {
            globalSubscriptions['unread'] = stompClient.subscribe(
              '/user/queue/unread',
              (message) => {
                try {
                  const data = JSON.parse(message.body)
                  // console.log('채팅방 읽지 않은 메시지:', data)
                  // roomId와 unreadCount가 있는지 확인
                  if (data.roomId && typeof data.unreadCount === 'number') {
                    updateRoomUnreadCount(data.roomId, data.unreadCount)
                  }
                } catch (e) {
                  // console.error('채팅방 읽지 않은 메시지 파싱 오류:', e)
                }
              }
            )
          }

          // 현재 온라인 상태 전송 (최소 30초 간격으로만 전송)
          const now = Date.now()
          const PRESENCE_THRESHOLD = 30000 // 30초로 늘림

          if (now - lastPresenceTimeRef.current > PRESENCE_THRESHOLD) {
            stompClient.publish({
              destination: '/app/presence',
              body: JSON.stringify({ status: 'ONLINE', activeRoomId: null }),
            })
            lastPresenceTimeRef.current = now
          }

          // 초기 전체 읽지 않은 메시지 수 요청 (한 번만)
          fetchTotalUnreadCount(tokenToUse, true)

          // 소켓 응답이 없을 경우를 대비한 주기적 폴링 시작
          startUnreadCountPolling(tokenToUse)
        } else {
          // 소켓 연결 실패 시 REST API로 대체
          // console.log(
          //   '소켓 연결 실패, REST API로 전체 읽지 않은 메시지 수 요청'
          // )
          fetchTotalUnreadCount(tokenToUse, true)
        }
      } catch (error) {
        // console.error('웹소켓 연결 오류:', error)

        // 연결 실패 시에도 읽지 않은 메시지 수는 REST API로 요청
        if (tokenToUse) {
          fetchTotalUnreadCount(tokenToUse, true)
        }
      }
    }

    connectSocket()

    // 컴포넌트 언마운트 시 클린업
    return () => {
      isMounted = false
      // 타이머 정리
      if (unreadCountTimerRef.current) {
        clearInterval(unreadCountTimerRef.current)
      }
    }
  }, [
    user?.accessToken,
    setTotalUnreadCount,
    updateRoomUnreadCount,
    startUnreadCountPolling,
  ])

  // 전체 소켓 연결 종료 (앱 종료 시 등)
  const disconnectAll = () => {
    if (globalStompClient && globalStompClient.connected) {
      // 연결 종료 전 상태 변경
      try {
        globalStompClient.publish({
          destination: '/app/presence',
          body: JSON.stringify({ status: 'OFFLINE', activeRoomId: null }),
        })
      } catch (e) {
        // console.error('상태 변경 메시지 전송 실패:', e)
      }

      // 모든 구독 해제
      Object.values(globalSubscriptions).forEach((sub) => {
        try {
          if (sub && sub.unsubscribe) {
            sub.unsubscribe()
          }
        } catch (e) {
          // console.error('구독 해제 실패:', e)
        }
      })

      // 전역 구독 목록 초기화
      Object.keys(globalSubscriptions).forEach((key) => {
        delete globalSubscriptions[key]
      })

      // 타이머 정리
      if (unreadCountTimerRef.current) {
        clearInterval(unreadCountTimerRef.current)
      }

      console.log('웹소켓 연결 종료')
      globalStompClient.deactivate()
      globalStompClient = null
      initializePromise.promise = null
      setIsConnected(false)
      setClient(null)
      isInitializedRef.current = false
    }
  }

  // 초기 전체 읽지 않은 메시지 수 요청 함수 - REST API 사용
  const fetchTotalUnreadCount = async (token: string, forceUpdate = false) => {
    // API 제한: 마지막 요청 시간과 현재 시간을 비교
    const currentTime = Date.now()

    // 최소 간격(10초) 내에는 무조건 막기 (forceUpdate여도)
    if (currentTime - lastApiRequestTime < API_REQUEST_THROTTLE) {
      return
    }
    lastApiRequestTime = currentTime
    lastRequestTimeRef.current = currentTime

    try {
      // console.log('전체 읽지 않은 메시지 수 REST API 요청')
      const response = await fetch(
        'https://mindmate.shop/api/chat/unread/total',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        }
      )

      if (response.ok) {
        const data = await response.json()
        // 읽지 않은 메시지 수가 숫자인지 확인하고 업데이트
        // data가 다양한 형식으로 올 수 있으므로 여러 필드 체크
        let count = 0

        if (typeof data === 'number') {
          // 숫자 형식으로 직접 왔을 경우
          count = data
        } else if (data && typeof data.count === 'number') {
          // { count: 숫자 } 형식으로 왔을 경우
          count = data.count
        } else if (data && typeof data.totalUnreadCount === 'number') {
          // { totalUnreadCount: 숫자 } 형식으로 왔을 경우
          count = data.totalUnreadCount
        } else if (data && typeof data.unreadCount === 'number') {
          // { unreadCount: 숫자 } 형식으로 왔을 경우
          count = data.unreadCount
        }

        // console.log('REST API에서 파싱된 읽지 않은 메시지 수:', count)

        // 이전 값과 같으면 업데이트 안 함
        if (count === lastUnreadCount) {
          // console.log('동일한 값으로 업데이트 무시:', count)
          return
        }

        lastUnreadCount = count

        // 스토어 업데이트
        setTotalUnreadCount(count)
        // 네비게이션 바에서 즉시 업데이트되도록 이벤트 발생
        window.dispatchEvent(
          new CustomEvent('unread-count-updated', { detail: { count } })
        )

        // REST API로 데이터를 성공적으로 받았음을 표시
        hasReceivedUnreadCountRef.current = true
      } else if (response.status === 429) {
        // 429 에러(Too Many Requests) 처리
        // console.log('요청 제한 초과: 잠시 후 다시 시도합니다.')
        const retryAfter = response.headers.get('Retry-After')
        const retryTime = retryAfter ? parseInt(retryAfter) * 1000 : 30000 // 기본 30초로 늘림

        // Retry-After 헤더가 있으면 그 시간만큼, 아니면 30초 후에 재시도
        setTimeout(() => {
          // 재시도 시 요청 상태를 초기화하도록 타임스탬프 리셋
          lastApiRequestTime = 0
          lastRequestTimeRef.current = 0
          // 강제 업데이트는 하지 않음(불필요한 재요청 방지)
        }, retryTime)
      } else {
        // console.error(
        //   '전체 읽지 않은 메시지 수 요청 실패: HTTP 상태 코드',
        //   response.status
        // )
      }
    } catch (e) {
      // console.error('전체 읽지 않은 메시지 수 요청 실패:', e)
    }
  }

  return {
    stompClient: client,
    isConnected,
    disconnectAll,
    fetchTotalUnreadCount: (forceUpdate = false) => {
      if (user?.accessToken) {
        fetchTotalUnreadCount(user.accessToken, forceUpdate)
      } else {
        const cookieToken = getTokenCookie('accessToken')
        if (cookieToken) {
          fetchTotalUnreadCount(cookieToken, forceUpdate)
        }
      }
    },
  }
}
