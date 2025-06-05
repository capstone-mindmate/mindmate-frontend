import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useAuthStore } from '../stores/userStore'
import { useSocketMessage } from './useSocketMessage'
import { useToast } from '../components/toast/ToastProvider'
import { useMessageProcessor } from './useMessageProcessor'
import { useCustomForm } from './useCustomForm'
import { Message } from '../types/message'
import { fetchWithRefresh } from '../utils/fetchWithRefresh'

interface UseChatRoomProps {
  chatId: string
  chatBarRef: React.RefObject<any>
}

export const useChatRoom = ({ chatId, chatBarRef }: UseChatRoomProps) => {
  const { user } = useAuthStore()
  const myUserId = user?.userId
  const { stompClient, isConnected } = useSocketMessage()
  const { showToast } = useToast()

  const [messages, setMessages] = useState<Message[]>([])
  const [isLoadingMessages, setIsLoadingMessages] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [toastBoxes, setToastBoxes] = useState<any[]>([])
  const [availableEmoticons, setAvailableEmoticons] = useState<any[]>([])

  // 종료 기능 관련 상태 추가
  const [roomStatus, setRoomStatus] = useState<
    'ACTIVE' | 'CLOSED' | 'CLOSE_REQUEST'
  >('ACTIVE')
  const [closeModalType, setCloseModalType] = useState<
    'NONE' | 'REQUEST' | 'RECEIVE'
  >('NONE')
  const [closeRequestRoleType, setCloseRequestRoleType] = useState<
    'LISTENER' | 'SPEAKER'
  >('LISTENER')
  const [listener, setListener] = useState(false)

  const subscriptionsRef = useRef<any[]>([])
  const loadAttemptRef = useRef(0)
  const processingCustomFormRef = useRef<Set<string>>(new Set())

  // 메시지 처리 훅 - 성능 최적화
  const messageProcessor = useMessageProcessor({
    myUserId: myUserId || '',
    showToast,
    chatBarRef,
  })

  // 커스텀폼 처리 훅 - 성능 최적화
  const customFormHandler = useCustomForm({
    chatId,
    myUserId: myUserId || '',
    parseMessage: messageProcessor.parseMessage,
    addMessage: messageProcessor.addMessage,
  })

  // 읽음 처리 - 메모이제이션 최적화
  const markAsRead = useCallback(() => {
    if (stompClient && stompClient.connected && chatId) {
      try {
        stompClient.publish({
          destination: '/app/chat.read',
          body: JSON.stringify({ roomId: chatId }),
        })
      } catch (error) {
        console.error('읽음 처리 오류:', error)
      }
    }
  }, [stompClient, chatId])

  // 종료 요청 구독 핸들러 - 원본 로직 사용
  const onCloseRequest = useCallback(
    (msg: any) => {
      try {
        const data = JSON.parse(msg.body)
        // 내 userId와 다를 때만 상대방 화면에서만 모달 표시
        if (data.userId && String(data.userId) !== String(myUserId)) {
          setCloseModalType('RECEIVE')
          setRoomStatus('CLOSE_REQUEST')
          showToast('상대방이 채팅 종료를 요청했습니다.', 'info')
        }
      } catch (error) {
        console.error('종료 요청 수신 오류:', error)
      }
    },
    [myUserId, showToast]
  )

  // 종료 수락 구독 핸들러 - 원본 로직 사용
  const onCloseAccept = useCallback((msg: any) => {
    try {
      const data = JSON.parse(msg.body)
      setCloseModalType('NONE')
      setRoomStatus('CLOSED')
      // 수락된 경우 양쪽 모두 리뷰 페이지로 이동해야 함
      // 이 부분은 ChatRoom에서 처리하도록 콜백 제공
    } catch (error) {
      console.error('종료 수락 수신 오류:', error)
    }
  }, [])

  // 종료 거절 구독 핸들러 - 원본 로직 사용
  const onCloseReject = useCallback(
    (msg: any) => {
      try {
        const data = JSON.parse(msg.body)
        setCloseModalType('NONE')
        setRoomStatus('ACTIVE')
        showToast('채팅 종료 요청이 거절되었습니다.', 'info')
      } catch (error) {
        console.error('종료 거절 수신 오류:', error)
      }
    },
    [showToast]
  )

  // 메시지 구독 핸들러들 - 의존성 최소화
  const onMessage = useCallback(
    (msg: any) => {
      try {
        const data = JSON.parse(msg.body)

        // 커스텀폼 관련 메시지인지 확인 - 여기서 처리하지 말고 전용 채널에서만 처리
        if (data.type === 'CUSTOM_FORM' || data.messageType === 'CUSTOM_FORM') {
          return // ← 이 부분이 핵심! 커스텀폼은 전용 채널에서만 처리
        }

        // 일반 메시지만 처리
        messageProcessor.processTextMessage(data, setMessages, markAsRead)
      } catch (error) {
        console.error('메시지 수신 오류:', error)
      }
    },
    [messageProcessor.processTextMessage, markAsRead]
  )

  // onCustomForm은 그대로 유지
  const onCustomForm = useCallback(
    (msg: any) => {
      try {
        const data = JSON.parse(msg.body)
        customFormHandler.processCustomFormMessage(
          data,
          setMessages,
          markAsRead
        )
      } catch (error) {
        console.error('커스텀 폼 수신 오류:', error)
      }
    },
    [customFormHandler.processCustomFormMessage, markAsRead]
  )

  const onRead = useCallback(
    (msg: any) => {
      try {
        const data = JSON.parse(msg.body)
        if (String(data.userId) !== String(myUserId)) {
          setMessages((prev) => prev.map((m) => ({ ...m, isRead: true })))
        }
      } catch (error) {
        console.error('읽음 처리 알림 오류:', error)
      }
    },
    [myUserId]
  )

  const onEmoticon = useCallback(
    (msg: any) => {
      try {
        const data = JSON.parse(msg.body)
        const newMessage = messageProcessor.parseMessage(data)
        messageProcessor.addMessage(newMessage, setMessages, markAsRead)
      } catch (error) {
        console.error('이모티콘 메시지 수신 오류:', error)
      }
    },
    [messageProcessor.parseMessage, messageProcessor.addMessage, markAsRead]
  )

  // 토스트박스 구독 핸들러
  const onToastBox = useCallback((msg: any) => {
    try {
      const data = JSON.parse(msg.body)
      setToastBoxes((prev) => [...prev, data])
    } catch (error) {
      console.error('토스트박스 수신 오류:', error)
    }
  }, [])

  // 초기 메시지 로드 - 성능 최적화
  const fetchMessages = useCallback(
    async (isInitialLoad = false) => {
      if (!chatId) return

      if (isInitialLoad && messages.length === 0) {
        setIsLoadingMessages(true)
      }

      loadAttemptRef.current += 1

      try {
        if (loadAttemptRef.current > 1) {
          const backoffDelay = Math.min(
            1000 * Math.pow(1.5, loadAttemptRef.current - 1),
            10000
          )
          await new Promise((resolve) => setTimeout(resolve, backoffDelay))
        }

        const res = await fetchWithRefresh(
          `http://lohttps://mindmate.shopcalhost/api/chat/rooms/${chatId}/messages`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        )

        if (!res.ok) {
          if (res.status === 500) {
            setErrorMessage(
              '서버에서 채팅방 정보를 처리하는 중 오류가 발생했습니다.'
            )
            setIsLoadingMessages(false)
            return
          }

          if (res.status === 401) {
            setErrorMessage('인증이 필요합니다. 다시 로그인해주세요.')
            setIsLoadingMessages(false)
            return
          }

          if (res.status === 429) {
            setErrorMessage('요청이 너무 많습니다. 잠시 후 다시 시도해주세요.')
            setIsLoadingMessages(false)
            return
          }

          throw new Error(`메시지 목록을 불러오지 못했습니다. (${res.status})`)
        }

        const contentType = res.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
          console.error('서버가 JSON이 아닌 응답을 반환했습니다:', contentType)
          throw new Error('인증이 필요하거나 서버 오류가 발생했습니다.')
        }

        const data = await res.json()
        const newMessages = Array.isArray(data.messages)
          ? data.messages.map(messageProcessor.parseMessage)
          : []

        // 방 상태 정보 설정
        if (data.roomStatus) setRoomStatus(data.roomStatus)
        if (data.closeRequestRole)
          setCloseRequestRoleType(data.closeRequestRole)
        if (typeof data.listener === 'boolean') setListener(data.listener)

        // 종료 요청 상태에 따른 모달 표시
        if (data.roomStatus === 'CLOSE_REQUEST') {
          if (data.closeRequestRole === 'LISTENER' && data.listener === true) {
            setCloseModalType('REQUEST')
          } else if (
            data.closeRequestRole === 'LISTENER' &&
            data.listener === false
          ) {
            setCloseModalType('RECEIVE')
          } else if (
            data.closeRequestRole === 'SPEAKER' &&
            data.listener === true
          ) {
            setCloseModalType('RECEIVE')
          } else if (
            data.closeRequestRole === 'SPEAKER' &&
            data.listener === false
          ) {
            setCloseModalType('REQUEST')
          }
        }

        // 메시지 설정 - 중복 제거 및 정렬
        setMessages((prev) => {
          if (prev.length === 0) {
            return newMessages.sort(
              (a: Message, b: Message) =>
                new Date(a.timestamp).getTime() -
                new Date(b.timestamp).getTime()
            )
          } else {
            const existingIds = new Set(prev.map((m: Message) => m.id))
            const uniqueNewMessages = newMessages.filter(
              (m: Message) => !existingIds.has(m.id)
            )

            const combined = [...prev, ...uniqueNewMessages]
            return combined.sort(
              (a: Message, b: Message) =>
                new Date(a.timestamp).getTime() -
                new Date(b.timestamp).getTime()
            )
          }
        })

        loadAttemptRef.current = 0
        setErrorMessage(null)
      } catch (e) {
        console.error('메시지 조회 실패:', e)
        if (loadAttemptRef.current < 8) {
          setTimeout(() => fetchMessages(false), 2000 * loadAttemptRef.current)
        } else {
          loadAttemptRef.current = 0
          setErrorMessage(
            '메시지를 불러오는데 실패했습니다. 다시 시도해주세요.'
          )
        }
      } finally {
        if (isInitialLoad) {
          setIsLoadingMessages(false)
        }
      }
    },
    [chatId, messageProcessor.parseMessage]
  )

  // 이모티콘 목록 로드
  const fetchEmoticons = useCallback(async () => {
    try {
      const res = await fetchWithRefresh(
        'http://lohttps://mindmate.shopcalhost/api/emoticons/available',
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      )
      if (res.ok) {
        const data = await res.json()
        setAvailableEmoticons(data)
      }
    } catch (e) {
      console.error('이모티콘 조회 실패:', e)
      setAvailableEmoticons([])
    }
  }, [])

  // 웹소켓 구독 설정 - 성능 최적화
  useEffect(() => {
    if (!chatId || !stompClient || !isConnected) {
      if (chatId) {
        fetchMessages(true)
      }
      return
    }

    // 이전 구독 해제
    subscriptionsRef.current.forEach((sub) => {
      if (sub && sub.unsubscribe) {
        sub.unsubscribe()
      }
    })
    subscriptionsRef.current = []

    try {
      const subscriptions = [
        stompClient.subscribe(`/topic/chat.room.${chatId}`, onMessage),
        stompClient.subscribe(`/topic/chat.room.${chatId}.read`, onRead),
        stompClient.subscribe(
          `/topic/chat.room.${chatId}.customform`,
          onCustomForm
        ),
        stompClient.subscribe(
          `/topic/chat.room.${chatId}.toastbox`,
          onToastBox
        ),
        stompClient.subscribe(
          `/topic/chat.room.${chatId}.emoticon`,
          onEmoticon
        ),
        // 종료 기능 관련 구독 추가
        stompClient.subscribe(
          `/topic/chat.room.${chatId}.close.request`,
          onCloseRequest
        ),
        stompClient.subscribe(
          `/topic/chat.room.${chatId}.close.accept`,
          onCloseAccept
        ),
        stompClient.subscribe(
          `/topic/chat.room.${chatId}.close.reject`,
          onCloseReject
        ),
      ]
      subscriptionsRef.current = subscriptions

      // 채팅방 입장 알림
      stompClient.publish({
        destination: '/app/presence',
        body: JSON.stringify({ status: 'ONLINE', activeRoomId: chatId }),
      })

      markAsRead()
      fetchMessages(true)
      fetchEmoticons()
    } catch (error) {
      console.error('채팅방 구독 오류:', error)
      setErrorMessage('채팅방 구독 중 오류가 발생했습니다.')
      fetchMessages(true)
      fetchEmoticons()
    }

    return () => {
      if (stompClient && stompClient.connected) {
        try {
          stompClient.publish({
            destination: '/app/presence',
            body: JSON.stringify({ status: 'ONLINE', activeRoomId: null }),
          })
        } catch (error) {
          console.error('채팅방 퇴장 알림 실패:', error)
        }
      }

      subscriptionsRef.current.forEach((sub) => {
        if (sub && sub.unsubscribe) {
          try {
            sub.unsubscribe()
          } catch (error) {
            console.error('구독 해제 실패:', error)
          }
        }
      })
      subscriptionsRef.current = []

      // 처리 중인 커스텀폼 추적 초기화
      processingCustomFormRef.current.clear()
    }
  }, [
    chatId,
    stompClient,
    isConnected,
    myUserId,
    onMessage,
    onRead,
    onCustomForm,
    onToastBox,
    onEmoticon,
    onCloseRequest,
    onCloseAccept,
    onCloseReject,
    markAsRead,
    fetchMessages,
    fetchEmoticons,
  ])

  // 클린업 - 성능 최적화
  useEffect(() => {
    return () => {
      messageProcessor.cleanup()
      processingCustomFormRef.current.clear()
    }
  }, [messageProcessor])

  // 메시지 전송 - 성능 최적화
  const sendMessage = useCallback(
    (content: string, onError?: () => void) => {
      if (content.trim() === '') return

      const currentMessage = content.trim()

      if (stompClient && stompClient.connected && chatId) {
        try {
          stompClient.publish({
            destination: '/app/chat.send',
            body: JSON.stringify({
              roomId: chatId,
              content: currentMessage,
              type: 'TEXT',
            }),
          })
        } catch (error) {
          console.error('메시지 전송 오류:', error)
          if (onError) onError()
          sendMessageFallback(currentMessage, onError)
        }
      } else if (chatId) {
        sendMessageFallback(currentMessage, onError)
      }
    },
    [stompClient, chatId]
  )

  // REST API 메시지 전송 - 성능 최적화
  const sendMessageFallback = useCallback(
    async (content: string, onError?: () => void) => {
      try {
        const res = await fetchWithRefresh(
          `http://lohttps://mindmate.shopcalhost/api/chat/messages`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ roomId: chatId, content, type: 'TEXT' }),
          }
        )

        if (res.ok) {
          const data = await res.json()

          if (data.content === '[부적절한 내용이 감지되었습니다]') {
            showToast(
              '부적절한 내용이 감지되었습니다. 다른 표현을 사용해주세요.',
              'error'
            )
            if (onError) onError()
            if (
              chatBarRef &&
              chatBarRef.current &&
              chatBarRef.current.handleFilteredMessage
            ) {
              chatBarRef.current.handleFilteredMessage()
            }
            return
          }

          const newMessage = messageProcessor.parseMessage(data)
          messageProcessor.addMessage(newMessage, setMessages, markAsRead)
        } else {
          showToast('메시지 전송에 실패했습니다. 다시 시도해주세요.', 'error')
          if (onError) onError()
        }
      } catch (error) {
        console.error('REST API 메시지 전송 실패:', error)
        showToast('메시지 전송에 실패했습니다. 다시 시도해주세요.', 'error')
        if (onError) onError()
      }
    },
    [chatId, messageProcessor, markAsRead, showToast]
  )

  // 이모티콘 전송 - 성능 최적화
  const sendEmoticon = useCallback(
    (emoticonId: string | number) => {
      if (stompClient && stompClient.connected && chatId) {
        try {
          stompClient.publish({
            destination: '/app/chat.emoticon',
            body: JSON.stringify({ roomId: chatId, emoticonId }),
          })
        } catch (error) {
          console.error('이모티콘 전송 오류:', error)
        }
      }
    },
    [stompClient, chatId]
  )

  // 종료 요청 함수 - 원본 로직 사용
  const requestClose = useCallback(async () => {
    try {
      await fetchWithRefresh(
        `http://lohttps://mindmate.shopcalhost/api/chat/rooms/${chatId}/close`,
        { method: 'POST' }
      )

      setCloseModalType('REQUEST')
      setRoomStatus('CLOSE_REQUEST')

      // 웹소켓으로 실시간 알림 전송 - 원본 로직의 토픽 사용
      if (stompClient && stompClient.connected) {
        stompClient.publish({
          destination: `/topic/chat.room.${chatId}.close.request`,
          body: JSON.stringify({ roomId: chatId, userId: myUserId }),
        })
      }

      showToast('종료 요청을 보냈습니다.', 'success')
      return true
    } catch (error) {
      console.error('종료 요청 실패:', error)
      showToast('종료 요청 실패', 'error')
      return false
    }
  }, [chatId, stompClient, myUserId, showToast])

  // 종료 수락 함수 - 원본 로직 사용
  const acceptClose = useCallback(async () => {
    try {
      await fetchWithRefresh(
        `http://lohttps://mindmate.shopcalhost/api/chat/rooms/${chatId}/close/accept`,
        { method: 'POST' }
      )

      setCloseModalType('NONE')
      setRoomStatus('CLOSED')

      // 웹소켓으로 실시간 알림 전송 - 원본 로직의 토픽 사용
      if (stompClient && stompClient.connected) {
        stompClient.publish({
          destination: `/topic/chat.room.${chatId}.close.accept`,
          body: JSON.stringify({ roomId: chatId }),
        })
      }

      return true
    } catch (error) {
      console.error('종료 수락 실패:', error)
      showToast('종료 수락 실패', 'error')
      return false
    }
  }, [chatId, stompClient, showToast])

  // 종료 거절 함수 - 원본 로직 사용
  const rejectClose = useCallback(async () => {
    try {
      await fetchWithRefresh(
        `http://lohttps://mindmate.shopcalhost/api/chat/rooms/${chatId}/close/reject`,
        { method: 'POST' }
      )

      setCloseModalType('NONE')
      setRoomStatus('ACTIVE')

      // 웹소켓으로 실시간 알림 전송 - 원본 로직의 토픽 사용
      if (stompClient && stompClient.connected) {
        stompClient.publish({
          destination: `/topic/chat.room.${chatId}.close.reject`,
          body: JSON.stringify({ roomId: chatId }),
        })
      }

      return true
    } catch (error) {
      console.error('종료 거절 실패:', error)
      showToast('종료 거절 실패', 'error')
      return false
    }
  }, [chatId, stompClient, showToast])

  // 메모이제이션된 반환값 - 성능 최적화
  return useMemo(
    () => ({
      messages,
      isLoadingMessages,
      errorMessage,
      customForms: customFormHandler.customForms,
      toastBoxes,
      availableEmoticons,
      roomStatus,
      closeModalType,
      closeRequestRoleType,
      listener,
      sendMessage,
      sendEmoticon,
      markAsRead,
      fetchMessages,
      setErrorMessage,
      setCloseModalType,
      requestClose,
      acceptClose,
      rejectClose,
    }),
    [
      messages,
      isLoadingMessages,
      errorMessage,
      customFormHandler.customForms,
      toastBoxes,
      availableEmoticons,
      roomStatus,
      closeModalType,
      closeRequestRoleType,
      listener,
      sendMessage,
      sendEmoticon,
      markAsRead,
      fetchMessages,
      requestClose,
      acceptClose,
      rejectClose,
    ]
  )
}
