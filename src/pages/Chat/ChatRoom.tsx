/** @jsxImportSource @emotion/react */
import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styled from '@emotion/styled'
import { useAuthStore } from '../../stores/userStore'
import { useUserQuery } from '../../hooks/useUserQuery'
import { useSocketMessage } from '../../hooks/useSocketMessage'

import { RootContainer } from './styles/RootStyles'
import { KebabIcon } from '../../components/icon/iconComponents'
import TopBar from '../../components/topbar/Topbar'
import ChatBar from '../../components/chat/ChatBar'
import Bubble from '../../components/chat/Bubble'
import EmoticonComponent, {
  EmoticonType,
} from '../../components/emoticon/Emoticon'
import { useToast } from '../../components/toast/ToastProvider'
import BottomSheet from '../../components/bottomSheet/BottomSheet'
import ModalComponent from '../../components/modal/modalComponent'
import { fetchWithRefresh } from '../../utils/fetchWithRefresh'

import { ChatContainer } from './styles/RootStyles'
import {
  ChatBarWrapper,
  EmoticonWrapper,
  LoadingText,
} from './styles/ChatRoomStyles'

import CustomFormBubbleSend from '../../components/chat/CustomFormBubbleSend'
import CustomFormBubbleReceive from '../../components/chat/CustomFormBubbleReceive'
import { a } from 'vitest/dist/chunks/suite.d.FvehnV49.js'

// 메시지 타입 정의
interface BaseMessage {
  id: string
  isMe: boolean
  timestamp: string
  isRead: boolean
  senderId: string
}

interface TextMessage extends BaseMessage {
  type: 'text' | 'TEXT'
  content: string
}

interface EmoticonMessage extends BaseMessage {
  type: 'emoticon' | 'EMOTICON'
  emoticonType: EmoticonType
}

interface CustomFormItem {
  id?: string | number
  question: string
  answer?: string
  createdAt?: string
}

interface CustomFormData {
  id: string | number
  items?: CustomFormItem[]
  answered?: boolean
  creatorId?: string | number
  responderId?: string | number
}

interface CustomFormMessage extends BaseMessage {
  type: 'CUSTOM_FORM' | 'custom_form'
  content: string
  customForm: CustomFormData
}

// Union 타입 업데이트
type Message = TextMessage | EmoticonMessage | CustomFormMessage

interface ChatRoomProps {
  chatId: string | undefined
}

const ChatRoom = ({ chatId }: ChatRoomProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuthStore()
  const { isLoading: isUserLoading } = useUserQuery()

  // 소켓 연결 가져오기
  const { stompClient, isConnected } = useSocketMessage()
  const { showToast } = useToast()

  const [messages, setMessages] = useState<Message[]>([])
  const [isRoomConnected, setIsRoomConnected] = useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [isAtBottom, setIsAtBottom] = useState(true)
  const [availableEmoticons, setAvailableEmoticons] = useState<any[]>([])
  const [customForms, setCustomForms] = useState<any[]>([])
  const [toastBoxes, setToastBoxes] = useState<any[]>([])
  const myUserId = user?.userId
  const typingTimeoutRef = useRef<any>(null)
  const otherProfileImageFromNav = location.state?.profileImage
  const otherUserNameFromNav = location.state?.userName
  const [otherUserName, setOtherUserName] = useState(
    otherUserNameFromNav || '상대방'
  )
  const subscriptionsRef = useRef<any[]>([])
  const loadAttemptRef = useRef(0)
  const matchingIdFromNav = location.state?.matchingId
  // 상대방 userId 추출
  const otherUserId =
    location.state?.oppositeId || messages.find((m) => !m.isMe)?.senderId || ''

  const messageRefs = useRef<{ [id: string]: HTMLDivElement | null }>({})

  const [isLoadingPrev, setIsLoadingPrev] = useState(false)
  const [hasMorePrev, setHasMorePrev] = useState(true)

  const [closeModalType, setCloseModalType] = useState<
    'NONE' | 'REQUEST' | 'RECEIVE'
  >('NONE')

  const [roomStatus, setRoomStatus] = useState<
    'ACTIVE' | 'CLOSED' | 'CLOSE_REQUEST'
  >('ACTIVE')

  const [closeRequestRoleType, setCloseRequestRoleType] = useState<
    'LISTENER' | 'SPEAKER'
  >('LISTENER')

  const [listener, setListener] = useState(false)

  // 메시지 파싱 함수 (type별로 필요한 필드 보완)
  const parseMessage = (
    msg: any
  ): Message & {
    isCustomFormMine?: boolean
    isCustomFormAnswered?: boolean
    isCustomFormResponder?: boolean
  } => {
    let type = msg.type
    if (typeof type === 'string') type = type.toUpperCase()

    // user가 없거나 userId가 없으면 안내
    if (!myUserId) {
      console.warn('내 유저 정보가 올바르지 않습니다. user:', user)
    }

    const baseMessage = {
      id: msg.id || msg.messageId || `msg-${Date.now()}`,
      isMe: msg.senderId === myUserId, // userId만 비교
      timestamp: msg.createdAt || '',
      isRead: msg.isRead ?? false,
      senderId: msg.senderId, // 추가
    }

    // 이모티콘 메시지: emoticonId, emoticonUrl, emoticonName이 있으면 type을 강제 지정
    if (msg.emoticonId && msg.emoticonUrl && msg.emoticonName) {
      return {
        ...baseMessage,
        type: 'EMOTICON',
        content: '', // 이모티콘은 텍스트 없음
        emoticonId: msg.emoticonId,
        emoticonName: msg.emoticonName,
        emoticonUrl: msg.emoticonUrl,
        emoticonType: msg.emoticonName as EmoticonType,
        senderName: msg.senderName,
      } as EmoticonMessage
    }

    // 타입에 따라 다른 메시지 객체 반환
    if (type === 'CUSTOM_FORM') {
      const customForm = msg.customForm || {
        id: msg.formId || `custom-form-${Date.now()}`,
        items: msg.items || [],
        answered: msg.answered || false,
        creatorId: msg.creatorId,
        responderId: msg.responderId,
      }
      return {
        ...baseMessage,
        type: 'CUSTOM_FORM',
        content: msg.content || msg.message || '커스텀 폼',
        customForm,
        isCustomFormMine: customForm.creatorId === myUserId,
        isCustomFormAnswered: !!customForm.answered,
        isCustomFormResponder: customForm.responderId === myUserId,
      }
    } else if (type === 'EMOTICON') {
      return {
        ...baseMessage,
        type: 'EMOTICON',
        content: msg.content || msg.message || '',
        emoticonType: msg.emoticonType || msg.emoticonName || msg.emoticonId,
        emoticonId: msg.emoticonId,
        emoticonUrl: msg.emoticonUrl,
        emoticonName: msg.emoticonName,
      } as EmoticonMessage
    } else {
      return {
        ...baseMessage,
        type: 'TEXT',
        content: msg.content || msg.message || '',
      } as TextMessage
    }
  }

  // 채팅방 구독 및 초기 메시지 로드
  useEffect(() => {
    if (!chatId) {
      setErrorMessage('채팅방 ID가 없습니다.')
      return
    }

    // 초기 로드는 true로
    fetchMessages(true)
    fetchEmoticons()

    if (!stompClient || !isConnected) {
      setIsRoomConnected(false)
      // 웹소켓 연결이 안되어도 초기 메시지는 REST API로 로드
      // fetchMessages()
      // fetchEmoticons()
      return
    }

    console.log('채팅방 구독 시작:', chatId)
    setIsRoomConnected(true)
    setErrorMessage(null)

    // 이전 구독 모두 해제
    subscriptionsRef.current.forEach((sub) => {
      if (sub && sub.unsubscribe) {
        sub.unsubscribe()
      }
    })
    subscriptionsRef.current = []

    try {
      // 구독 추가
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
        stompClient.subscribe(`/topic/chat.room.${chatId}.typing`, onTyping),
      ]
      subscriptionsRef.current = subscriptions

      // 채팅방 입장 알림
      stompClient.publish({
        destination: '/app/presence',
        body: JSON.stringify({ status: 'ONLINE', activeRoomId: chatId }),
      })

      // 읽음 처리
      stompClient.publish({
        destination: '/app/chat.read',
        body: JSON.stringify({ roomId: chatId }),
      })

      // 초기 메시지 및 이모티콘 로드
      fetchMessages()
      fetchEmoticons()
    } catch (error) {
      console.error('채팅방 구독 오류:', error)
      setErrorMessage('채팅방 구독 중 오류가 발생했습니다.')

      // 웹소켓에 문제가 있어도 REST API로 초기 데이터 로드
      fetchMessages()
      fetchEmoticons()
    }

    // 컴포넌트 언마운트 시 클린업
    return () => {
      // 채팅방 퇴장 알림
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

      // 구독 해제
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
    }
    // 웹소켓 연결 후 동기화는 false로 (로딩 표시 안함)
    fetchMessages(false)
  }, [chatId, stompClient, isConnected, myUserId])

  // 초기 메시지 로드 - REST API 사용 (백오프 전략 구현)
  const fetchMessages = async (isInitialLoad = false) => {
    if (!chatId) return

    // 초기 로드이고 메시지가 없을 때만 로딩 표시
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
        `https://mindmate.shop/api/chat/rooms/${chatId}/messages`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      )

      if (!res.ok) {
        if (res.status === 429) {
          const retryAfter = res.headers.get('Retry-After') || '5'
          throw new Error(
            `요청 제한 (429). ${retryAfter}초 후 다시 시도합니다.`
          )
        }
        throw new Error(`메시지 목록을 불러오지 못했습니다. (${res.status})`)
      }

      // 응답이 JSON인지 확인
      const contentType = res.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        console.error('서버가 JSON이 아닌 응답을 반환했습니다:', contentType)
        throw new Error('인증이 필요하거나 서버 오류가 발생했습니다.')
      }

      const data = await res.json()
      const newMessages = Array.isArray(data.messages)
        ? data.messages.map(parseMessage)
        : []

      //기존 메시지와 스마트 병합
      setMessages((prev) => {
        if (prev.length === 0) {
          // 기존 메시지가 없으면 새 메시지로 설정
          return newMessages
        } else {
          // 기존 메시지가 있으면 중복 제거하고 병합
          const existingIds = new Set(prev.map((m) => m.id))
          const uniqueNewMessages = newMessages.filter(
            (m) => !existingIds.has(m.id)
          )

          // 시간 순으로 정렬하여 반환
          return [...prev, ...uniqueNewMessages].sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          )
        }
      })

      loadAttemptRef.current = 0
      setErrorMessage(null)

      // API 응답에서 받은 값들을 상태에 설정
      const apiRoomStatus = data.roomStatus
      const apiCloseRequestRoleType = data.closeRequestRole
      const apiListener = data.listener

      setRoomStatus(apiRoomStatus)
      setCloseRequestRoleType(apiCloseRequestRoleType)
      setListener(apiListener)

      // API 응답 값을 직접 사용하여 조건문 실행
      if (apiRoomStatus === 'CLOSE_REQUEST') {
        if (apiCloseRequestRoleType === 'LISTENER' && apiListener === true) {
          // 요청 모달
          setCloseModalType('REQUEST')
        }
        if (apiCloseRequestRoleType === 'LISTENER' && apiListener === false) {
          // 수락 모달
          setCloseModalType('RECEIVE')
        }

        if (apiCloseRequestRoleType === 'SPEAKER' && apiListener === true) {
          // 수락 모달
          setCloseModalType('RECEIVE')
        }
        if (apiCloseRequestRoleType === 'SPEAKER' && apiListener === false) {
          // 요청 모달
          setCloseModalType('REQUEST')
        }
      }
    } catch (e) {
      const error = e as Error
      console.error('메시지 조회 실패:', error)
      if (loadAttemptRef.current < 8) {
        // 3번 -> 8번
        setTimeout(() => fetchMessages(), 2000 * loadAttemptRef.current)
      } else {
        loadAttemptRef.current = 0 // 리셋하여 나중에 다시 시도 가능하게
      }
    } finally {
      // 초기 로드일 때만 로딩 상태 해제
      if (isInitialLoad) {
        setIsLoadingMessages(false)
      }
    }
  }

  // 이모티콘 목록 로드
  const fetchEmoticons = async () => {
    try {
      const res = await fetchWithRefresh(
        'https://mindmate.shop/api/emoticons/available',
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
  }

  // 메시지 구독 핸들러
  const onMessage = (msg: any) => {
    try {
      const data = JSON.parse(msg.body)
      if (data.type === 'SYSTEM') {
        showToast(data.content || '시스템 메시지', 'info')
        return
      }

      setMessages((prev) => {
        if (prev.some((m) => m.id === data.id)) return prev
        return [...prev, parseMessage(data)]
      })
      markAsRead()
    } catch (error) {
      console.error('메시지 수신 오류:', error)
    }
  }

  // 읽음 처리 알림 구독 핸들러
  const onRead = (msg: any) => {
    try {
      const data = JSON.parse(msg.body)
      if (data.userId !== myUserId) {
        setMessages((prev) => prev.map((m) => ({ ...m, isRead: true })))
      }
    } catch (error) {
      console.error('읽음 처리 알림 오류:', error)
    }
  }

  // 커스텀 폼 구독 핸들러
  const onCustomForm = (msg: any) => {
    try {
      const data = JSON.parse(msg.body)

      // 데이터 형식 검증 및 정규화
      if (!data.id) {
        data.id = data.messageId || `11111custom-form-${Date.now()}`
      }

      // formId 추출 (서버에서 실제 폼 데이터 조회에 사용)
      const formId = data.formId || data.customForm?.id || `form-${Date.now()}`

      // customForm 필드가 없으면 추가 (항상 customForm 필드가 존재하도록)
      if (!data.customForm) {
        data.customForm = {
          id: formId,
          items: data.items || [],
          answered: data.answered || false,
        }
      }

      // 채팅방 ID로 모든 폼 데이터 조회 (폼 ID가 없거나 API 요청 실패 시 사용)
      const loadFormsByChatRoomId = async () => {
        if (!chatId) return false

        try {
          const response = await fetchWithRefresh(
            `https://mindmate.shop/api/custom-forms/chat-room/${chatId}`,
            {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
            }
          )

          if (response.ok) {
            const allForms = await response.json()

            // 가장 최근 폼부터 검색
            if (Array.isArray(allForms) && allForms.length > 0) {
              // 1. 가장 최근에 생성된 폼 찾기 (일반적으로 방금 수신한 메시지와 연관된 폼)
              const messageTimestamp = new Date(
                data.timestamp || data.createdAt || Date.now()
              ).getTime()

              // 타임스탬프 기준으로 정렬
              allForms.sort((a, b) => {
                const timeA = new Date(a.createdAt || 0).getTime()
                const timeB = new Date(b.createdAt || 0).getTime()
                // 타임스탬프 차이 구하기
                const diffA = Math.abs(messageTimestamp - timeA)
                const diffB = Math.abs(messageTimestamp - timeB)
                return diffA - diffB // 차이가 작은 것이 먼저 오도록
              })

              // 가장 가까운 타임스탬프의 폼 선택
              const matchedForm = allForms[0]

              if (matchedForm) {
                // 폼 데이터 상태 업데이트
                setCustomForms((prev) => {
                  const existingIndex = prev.findIndex(
                    (f) => f.id === matchedForm.id
                  )
                  if (existingIndex >= 0) {
                    const updatedForms = [...prev]
                    updatedForms[existingIndex] = matchedForm
                    return updatedForms
                  }
                  return [...prev, matchedForm]
                })

                // 메시지 데이터 업데이트 (customForm 필드 설정)
                data.customForm = matchedForm

                // 메시지 목록에 추가
                setMessages((prev) => {
                  // 중복 확인
                  const existingMsgIndex = prev.findIndex(
                    (m) =>
                      m.id === data.id ||
                      (m.type === 'CUSTOM_FORM' &&
                        (m as CustomFormMessage).customForm?.id ===
                          matchedForm.id)
                  )

                  if (existingMsgIndex >= 0) {
                    // 이미 있는 메시지면 업데이트
                    const updatedMessages = [...prev]
                    updatedMessages[existingMsgIndex] = {
                      ...parseMessage(data),
                      type: 'CUSTOM_FORM',
                      customForm: matchedForm,
                      content: data.content || '커스텀 폼',
                    } as CustomFormMessage
                    return updatedMessages
                  }

                  // 새 메시지면 추가
                  const newMessage: CustomFormMessage = {
                    ...parseMessage(data),
                    type: 'CUSTOM_FORM',
                    customForm: matchedForm,
                    content: data.content || '커스텀 폼',
                  } as CustomFormMessage

                  return [...prev, newMessage]
                })

                markAsRead()
                return true
              }
            }
          }
          return false
        } catch (error) {
          console.error('채팅방 커스텀폼 조회 실패:', error)
          return false
        }
      }

      // 개별 폼 데이터 조회
      const loadSingleFormData = async () => {
        try {
          const response = await fetchWithRefresh(
            `https://mindmate.shop/api/custom-forms/${formId}`,
            {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
            }
          )

          if (response.ok) {
            // 서버 응답 성공
            const formData = await response.json()

            // 유효한 서버 데이터로 customForm 업데이트
            data.customForm = {
              id: formData.id || formId,
              items: formData.items || [],
              answered: formData.answered || false,
              creatorId: formData.creatorId || data.senderId,
              responderId: formData.responderId,
            }

            processFormData(true)
            return true
          }

          // API 요청 실패
          return false
        } catch (error) {
          console.error('폼 데이터 조회 실패:', error)
          // 에러 발생 시 기본 데이터로 처리 계속
          return false
        }
      }

      // 폼 데이터를 처리하고 상태를 업데이트하는 함수
      const processFormData = (skipFormCheck = false) => {
        // 폼 데이터 업데이트 완료 후 커스텀 폼 목록에 추가
        setCustomForms((prev) => {
          // 이미 있는 폼이면 업데이트
          if (
            prev.some(
              (form) => form.id === data.id || form.formId === data.formId
            )
          ) {
            return prev.map((form) =>
              form.id === data.id || form.formId === data.formId ? data : form
            )
          }
          // 새로운 폼이면 추가
          return [...prev, data]
        })

        // 메시지 목록에 추가 (메시지 형태로도 표시)
        setMessages((prev) => {
          // 중복 확인 (id 또는 formId로)
          const existingMsgIndex = prev.findIndex(
            (m) =>
              m.id === data.id ||
              (m.type === 'CUSTOM_FORM' &&
                (m as CustomFormMessage).customForm?.id === data.formId)
          )

          if (existingMsgIndex >= 0) {
            // 이미 있는 메시지면 업데이트
            const updatedMessages = [...prev]
            const parsedMsg = parseMessage(data)
            updatedMessages[existingMsgIndex] = {
              ...parsedMsg,
              type: 'CUSTOM_FORM',
              customForm: data.customForm,
              // 커스텀 폼 메시지 내용 설정 - content가 없을 때만 기본값 사용
              content: data.content || '커스텀 폼',
            } as CustomFormMessage
            return updatedMessages
          }

          // 새 메시지면 추가
          const newMessage: CustomFormMessage = {
            ...parseMessage(data),
            type: 'CUSTOM_FORM',
            customForm: data.customForm,
            // 커스텀 폼 메시지 내용 설정 - content가 없을 때만 기본값 사용
            content: data.content || '커스텀 폼',
          } as CustomFormMessage

          return [...prev, newMessage]
        })

        markAsRead()
      }

      // 데이터 처리 시작
      const processCustomFormMessage = async () => {
        // 1. formId가 유효하면 개별 폼 데이터 조회 시도
        if (formId && formId.indexOf('form-') !== 0) {
          const singleFormSuccess = await loadSingleFormData()
          if (singleFormSuccess) return
        }

        // 2. 개별 폼 조회 실패 시 채팅방 ID로 모든 폼 조회
        const allFormsSuccess = await loadFormsByChatRoomId()
        if (allFormsSuccess) return

        // 3. 모든 API 요청 실패 시 기본 데이터로 처리
        processFormData()
      }

      // 데이터 처리 실행
      processCustomFormMessage()
    } catch (error) {
      console.error('커스텀 폼 수신 오류:', error)
    }
  }

  // 토스트박스 구독 핸들러
  const onToastBox = (msg: any) => {
    try {
      const data = JSON.parse(msg.body)
      setToastBoxes((prev) => [...prev, data])
    } catch (error) {
      console.error('토스트박스 수신 오류:', error)
    }
  }

  // 이모티콘 메시지 구독 핸들러
  const onEmoticon = (msg: any) => {
    try {
      const data = JSON.parse(msg.body)
      console.log('emo data : ', data)
      setMessages((prev) => [...prev, parseMessage(data)])
      markAsRead()
    } catch (error) {
      console.error('이모티콘 메시지 수신 오류:', error)
    }
  }

  // 타이핑 알림 구독 핸들러
  const onTyping = (msg: any) => {
    try {
      const data = JSON.parse(msg.body)
      if (data.senderId !== myUserId) {
        setIsTyping(true)
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
        typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000)
      }
    } catch (error) {
      console.error('타이핑 알림 수신 오류:', error)
    }
  }

  // 읽음 처리 함수
  const markAsRead = () => {
    if (stompClient && stompClient.connected && chatId) {
      try {
        stompClient.publish({
          destination: '/app/chat.read',
          body: JSON.stringify({ roomId: chatId }),
        })
      } catch (error) {
        console.error('읽음 처리 오류:', error)
        // 웹소켓 실패 시 REST API로 읽음 처리 시도
        // markAsReadFallback()
      }
    } else if (chatId) {
      // 웹소켓 연결 안되면 REST API로 읽음 처리
      // markAsReadFallback()
    }
  }

  // REST API를 사용한 읽음 처리 대체 함수
  // const markAsReadFallback = async () => {
  //   try {
  //     await fetchWithRefresh(`https://mindmate.shop/api/chat/rooms/${chatId}/read`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //     })
  //   } catch (error) {
  //     console.error('REST API 읽음 처리 실패:', error)
  //   }
  // }

  // 브라우저 탭 활성화 시 읽음 처리
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && chatId) {
        markAsRead()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [chatId])

  // 채팅창 맨 아래 도달 시 읽음 처리
  useEffect(() => {
    if (!chatEndRef.current) return
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && chatId) {
          markAsRead()
        }
      },
      { threshold: 1 }
    )
    observer.observe(chatEndRef.current)
    return () => {
      observer.disconnect()
    }
  }, [chatId, messages.length])

  // 타이핑 이벤트 전송
  const handleTyping = (typing: boolean) => {
    setIsTyping(typing)
    if (stompClient && stompClient.connected && chatId) {
      try {
        stompClient.publish({
          destination: '/app/chat.typing',
          body: JSON.stringify({ roomId: chatId, typing }),
        })
      } catch (error) {
        console.error('타이핑 이벤트 전송 오류:', error)
      }
    }
  }

  // 메시지 전송 함수
  const sendMessage = (content: string) => {
    if (content.trim() === '') return

    if (stompClient && stompClient.connected && chatId) {
      try {
        stompClient.publish({
          destination: '/app/chat.send',
          body: JSON.stringify({ roomId: chatId, content, type: 'TEXT' }),
        })
      } catch (error) {
        console.error('메시지 전송 오류:', error)
        // 웹소켓 실패 시 REST API로 메시지 전송 시도
        sendMessageFallback(content)
      }
    } else if (chatId) {
      // 웹소켓 연결 안되면 REST API로 메시지 전송
      sendMessageFallback(content)
    }
  }

  // REST API를 사용한 메시지 전송 대체 함수
  const sendMessageFallback = async (content: string) => {
    try {
      const res = await fetchWithRefresh(
        `https://mindmate.shop/api/chat/messages`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomId: chatId, content, type: 'TEXT' }),
        }
      )

      if (res.ok) {
        const data = await res.json()
        // UI에 즉시 반영
        setMessages((prev) => [...prev, parseMessage(data)])
      } else {
        showToast('메시지 전송에 실패했습니다. 다시 시도해주세요.', 'error')
      }
    } catch (error) {
      console.error('REST API 메시지 전송 실패:', error)
      showToast('메시지 전송에 실패했습니다. 다시 시도해주세요.', 'error')
    }
  }

  // 이모티콘 전송 함수
  const sendEmoticon = (emoticonId: string | number) => {
    if (stompClient && stompClient.connected && chatId) {
      try {
        stompClient.publish({
          destination: '/app/chat.emoticon',
          body: JSON.stringify({ roomId: chatId, emoticonId }),
        })
      } catch (error) {
        console.error('이모티콘 전송 오류:', error)
        // 실패 시 REST API 대체 전송 로직 추가 가능
      }
    }
  }

  // 스크롤 위치 감지
  useEffect(() => {
    const handleScroll = () => {
      if (!chatContainerRef.current) return
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current
      setIsAtBottom(scrollHeight - scrollTop - clientHeight < 100)
    }
    const container = chatContainerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  // 새 메시지 오면, 최하단에 있을 때만 자동 스크롤
  useEffect(() => {
    if (isAtBottom && chatEndRef.current && !isLoadingMessages) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isAtBottom, isLoadingMessages])

  // 시간 포맷 함수
  function formatKoreanTime(timestamp: string) {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    let hours = date.getHours() + 9
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const isAM = hours < 12
    const period = isAM ? '오전' : '오후'
    if (hours === 0) hours = 12
    else if (hours > 12) hours = hours - 12
    return `${period} ${hours}시${minutes}분`
  }

  // 상대방 이름 설정
  useEffect(() => {
    if (otherUserNameFromNav) setOtherUserName(otherUserNameFromNav)
  }, [otherUserNameFromNav])

  // 로드 실패 시 재시도 버튼 핸들러
  const handleRetry = () => {
    setErrorMessage(null)
    loadAttemptRef.current = 0
    fetchMessages()
  }

  // 디버그용 IntersectionObserver: 메시지가 화면에 들어오면 콘솔에 정보 출력
  useEffect(() => {
    if (!messages.length) return
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const messageId = entry.target.getAttribute('data-message-id')
            if (messageId) {
              messages.find((m) => m.id === messageId)
            }
          }
        })
      },
      { threshold: 0.7 }
    )

    Object.values(messageRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [messages])

  const fetchPreviousMessages = async () => {
    if (!chatId || isLoadingPrev || !hasMorePrev || messages.length === 0)
      return
    setIsLoadingPrev(true)
    const oldestId = messages[0]?.id
    if (!oldestId) {
      setIsLoadingPrev(false)
      setHasMorePrev(false)
      return
    }
    try {
      const res = await fetchWithRefresh(
        `https://mindmate.shop/api/chat/rooms/${chatId}/messages/before/${oldestId}?size=30`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      )
      if (!res.ok) throw new Error('이전 메시지 불러오기 실패')
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        // 중복 제거
        const newMsgs = data
          .map(parseMessage)
          .filter((msg) => !messages.some((m) => m.id === msg.id))
        setMessages((prev) => [...newMsgs, ...prev])
        if (data.length < 30) setHasMorePrev(false)
      } else {
        setHasMorePrev(false)
      }
    } catch (e) {
      setHasMorePrev(false)
    } finally {
      setIsLoadingPrev(false)
    }
  }

  useEffect(() => {
    const container = chatContainerRef.current
    if (!container) return
    const handleScroll = () => {
      if (container.scrollTop === 0 && hasMorePrev && !isLoadingPrev) {
        fetchPreviousMessages()
      }
    }
    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [messages, hasMorePrev, isLoadingPrev])

  // 종료 요청
  const handleCloseRequest = async () => {
    try {
      await fetchWithRefresh(
        `https://mindmate.shop/api/chat/rooms/${chatId}/close`,
        { method: 'POST' }
      )
      setCloseModalType('REQUEST')
      setRoomStatus('CLOSE_REQUEST')
      // 소켓으로 상대방에게 종료 요청 알림 (userId 포함)
      stompClient?.publish &&
        stompClient.publish({
          destination: `/topic/chat.room.${chatId}.close.request`,
          body: JSON.stringify({ roomId: chatId, userId: myUserId }),
        })
    } catch (e) {
      showToast('종료 요청 실패', 'error')
    }
  }

  // 종료 요청 수신 핸들러
  const onCloseRequest = (msg: any) => {
    try {
      const data = JSON.parse(msg.body)
      // 내 userId와 다를 때만 상대방 화면에서만 모달 표시
      if (data.userId && data.userId !== myUserId) {
        setCloseModalType('RECEIVE')
        setRoomStatus('CLOSE_REQUEST')
      }
    } catch {
      // fallback: userId 정보 없으면 무시
    }
  }

  // 종료 수락
  const handleCloseAccept = async () => {
    await fetchWithRefresh(
      `https://mindmate.shop/api/chat/rooms/${chatId}/close/accept`,
      { method: 'POST' }
    )
    setCloseModalType('NONE')
    stompClient?.publish &&
      stompClient.publish({
        destination: `/topic/chat.room.${chatId}.close.accept`,
        body: JSON.stringify({ roomId: chatId }),
      })
  }
  // 종료 거절
  const handleCloseReject = async () => {
    await fetchWithRefresh(
      `https://mindmate.shop/api/chat/rooms/${chatId}/close/reject`,
      { method: 'POST' }
    )
    setCloseModalType('NONE')
    stompClient?.publish &&
      stompClient.publish({
        destination: `/topic/chat.room.${chatId}.close.reject`,
        body: JSON.stringify({ roomId: chatId }),
      })
  }

  // 소켓 구독 추가
  useEffect(() => {
    if (!stompClient || !chatId) return
    const closeRequestSub = stompClient.subscribe(
      `/topic/chat.room.${chatId}.close.request`,
      onCloseRequest
    )
    // 종료 수락 구독: 상대방이 수락하면 review로 이동
    const closeAcceptSub = stompClient.subscribe(
      `/topic/chat.room.${chatId}.close.accept`,
      (msg: any) => {
        navigate(`/review/${chatId}`, {
          state: {
            opponentName: otherUserName,
          },
        })
      }
    )
    return () => {
      closeRequestSub &&
        closeRequestSub.unsubscribe &&
        closeRequestSub.unsubscribe()
      closeAcceptSub &&
        closeAcceptSub.unsubscribe &&
        closeAcceptSub.unsubscribe()
    }
  }, [stompClient, chatId])

  // 프로필 이미지 클릭 핸들러
  const handleProfileClick = () => {
    if (otherUserId) {
      navigate(`/mypage/${otherUserId}`)
    } else {
      showToast('상대방 정보를 찾을 수 없습니다.', 'error')
    }
  }

  return (
    <RootContainer>
      <TopBar
        title={otherUserName}
        showBackButton={true}
        onBackClick={() => navigate('/chat')}
        rightContent={
          <KebabIcon
            color="#000000"
            onClick={() => setIsBottomSheetOpen(true)}
          />
        }
      />
      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        menuItems={[
          {
            text: '신고',
            onClick: () => {
              navigate(`/chat/${chatId}/report/${myUserId}/${otherUserId}`)
            },
          },
          { text: '종료 요청', onClick: handleCloseRequest },
          ...(roomStatus === 'CLOSED'
            ? [{ text: '채팅 제거', onClick: () => {} }]
            : []),
        ]}
      />
      <ChatContainer ref={chatContainerRef}>
        {isUserLoading ? (
          <LoadingText>사용자 정보 로딩 중...</LoadingText>
        ) : isLoadingMessages ? (
          <LoadingText>채팅 내용을 불러오는 중...</LoadingText>
        ) : (
          <>
            {messages.map((message: any, index) => {
              // 상대방 프로필 이미지 추출
              const otherProfileImage =
                otherProfileImageFromNav || '/default-profile-image.png'

              // 시스템 메시지는 렌더링 안함
              if (message.type === 'SYSTEM') {
                return null
              }

              // 이모티콘 메시지
              if (message.type === 'EMOTICON') {
                return (
                  <div
                    key={message.id}
                    ref={(el) => {
                      messageRefs.current[message.id] = el
                    }}
                    data-message-id={message.id}
                  >
                    <Bubble
                      isMe={message.isMe}
                      timestamp={formatKoreanTime(message.timestamp)}
                      showTime={true}
                      isLastMessage={index === messages.length - 1}
                      isRead={message.isRead}
                      isContinuous={false}
                      profileImage={
                        message.isMe
                          ? undefined
                          : otherProfileImageFromNav ||
                            '/default-profile-image.png'
                      }
                      onProfileClick={
                        message.isMe ? undefined : handleProfileClick
                      }
                    >
                      <EmoticonWrapper>
                        <EmoticonComponent
                          emoticonURL={
                            'https://mindmate.shop/api' + message.emoticonUrl
                          }
                          type={message.emoticonType}
                          size="large"
                          inChat={true}
                          alt={`${message.emoticonType} 이모티콘`}
                        />
                      </EmoticonWrapper>
                    </Bubble>
                  </div>
                )
              }

              // 커스텀 폼 메시지
              if (message.type === 'CUSTOM_FORM') {
                // 커스텀 폼 클릭 핸들러 함수 (모든 케이스에서 사용)
                const handleFormClick = async () => {
                  // customForm이 없는 경우에도 기본 동작 설정
                  const formId = message.customForm?.id || `form-${message.id}`
                  const answered = message.customForm?.answered || false

                  // 유효한 폼 데이터를 찾기 위한 함수
                  const findAndUpdateFormData = async () => {
                    try {
                      showToast('폼 정보를 확인하는 중입니다...', 'info')

                      // 채팅방의 모든 폼 데이터 조회
                      if (chatId) {
                        const response = await fetchWithRefresh(
                          `https://mindmate.shop/api/custom-forms/chat-room/${chatId}`,
                          {
                            method: 'GET',
                            headers: { 'Content-Type': 'application/json' },
                          }
                        )

                        if (response.ok) {
                          const allForms = await response.json()

                          // 메시지와 일치하는 커스텀폼 찾기
                          let matchedForm = null

                          // 가장 최근 폼부터 검색 (일반적으로 마지막에 추가된 폼일 가능성이 높음)
                          if (Array.isArray(allForms) && allForms.length > 0) {
                            // 1. createdAt 타임스탬프가 가장 가까운 폼 찾기
                            const messageTimestamp = new Date(
                              message.timestamp
                            ).getTime()

                            // 타임스탬프 기준으로 정렬
                            allForms.sort((a, b) => {
                              const timeA = new Date(a.createdAt || 0).getTime()
                              const timeB = new Date(b.createdAt || 0).getTime()
                              // 타임스탬프 차이 구하기
                              const diffA = Math.abs(messageTimestamp - timeA)
                              const diffB = Math.abs(messageTimestamp - timeB)
                              return diffA - diffB // 차이가 작은 것이 먼저 오도록
                            })

                            // 가장 가까운 타임스탬프의 폼 선택
                            matchedForm = allForms[0]
                          }

                          if (matchedForm) {
                            // 폼 데이터 상태 업데이트
                            setCustomForms((prev) => {
                              const existingIndex = prev.findIndex(
                                (f) => f.id === matchedForm.id
                              )
                              if (existingIndex >= 0) {
                                const updatedForms = [...prev]
                                updatedForms[existingIndex] = matchedForm
                                return updatedForms
                              }
                              return [...prev, matchedForm]
                            })

                            // 메시지도 업데이트
                            setMessages((prev) => {
                              return prev.map((m) => {
                                if (m.id === message.id) {
                                  return {
                                    ...m,
                                    type: 'CUSTOM_FORM',
                                    customForm: matchedForm,
                                  } as CustomFormMessage
                                }
                                return m
                              })
                            })

                            // 찾은 폼 데이터로 처리 계속
                            const isAnswered = matchedForm.answered || false

                            // 내가 보낸 폼이고 아직 답변이 없으면 아무 동작 안함
                            if (message.isMe && !isAnswered) {
                              showToast(
                                '상대방이 아직 답변하지 않았습니다.',
                                'info'
                              )
                              return
                            }

                            // 상대방이 보낸 폼이고 아직 내가 답변 안했으면 답변 페이지로
                            if (!message.isMe && !isAnswered) {
                              const formId =
                                message.customForm?.id || matchingIdFromNav
                              navigate(
                                `/chat/custom-form/view/${formId}/${chatId}`,
                                {
                                  state: {
                                    profileImage: otherProfileImage,
                                    userName: otherUserName,
                                  },
                                }
                              )
                              return
                            }

                            navigate(
                              `/chat/custom-form/done/${matchedForm.id}/${chatId}`,
                              {
                                state: {
                                  profileImage: otherProfileImage,
                                  userName: otherUserName,
                                },
                              }
                            )
                            return true
                          }
                        }
                      }

                      // 일치하는 폼을 찾지 못했거나 요청 실패
                      return false
                    } catch (error) {
                      console.error('채팅방 커스텀폼 조회 실패:', error)
                      return false
                    }
                  }

                  if (!formId || !chatId) {
                    // formId가 없는 경우 채팅방 ID로 폼 데이터 조회
                    const found = await findAndUpdateFormData()
                    if (!found) {
                      // 폼을 찾지 못한 경우 기본 동작
                      fallbackLogic()
                    }
                    return
                  }

                  try {
                    const response = await fetchWithRefresh(
                      `https://mindmate.shop/api/custom-forms/${formId}`,
                      {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                      }
                    )

                    if (response.ok) {
                      const formData = await response.json()

                      // 폼 데이터 상태 업데이트
                      setCustomForms((prev) => {
                        const existingIndex = prev.findIndex(
                          (f) => f.id === formId
                        )
                        if (existingIndex >= 0) {
                          const updatedForms = [...prev]
                          updatedForms[existingIndex] = formData
                          return updatedForms
                        }
                        return [...prev, formData]
                      })

                      // 메시지도 업데이트
                      setMessages((prev) => {
                        return prev.map((m) => {
                          if (
                            m.type === 'CUSTOM_FORM' &&
                            ((m as CustomFormMessage).customForm?.id ===
                              formId ||
                              m.id === message.id)
                          ) {
                            return {
                              ...m,
                              customForm: {
                                ...(m as CustomFormMessage).customForm,
                                ...formData,
                              },
                            } as CustomFormMessage
                          }
                          return m
                        })
                      })

                      // 서버 응답 기준으로 동작 처리
                      const isAnswered = formData.answered || false

                      // 내가 보낸 폼이고 아직 답변이 없으면 아무 동작 안함
                      if (message.isMe && !isAnswered) {
                        showToast('상대방이 아직 답변하지 않았습니다.', 'info')
                        return
                      }

                      // 상대방이 보낸 폼이고 아직 내가 답변 안했으면 답변 페이지로
                      if (!message.isMe && !isAnswered) {
                        const formId =
                          message.customForm?.id || matchingIdFromNav
                        navigate(`/chat/custom-form/view/${formId}/${chatId}`, {
                          state: {
                            profileImage: otherProfileImage,
                            userName: otherUserName,
                          },
                        })
                        return
                      }

                      // 이미 답변한 폼이면 결과 보기
                      navigate(`/chat/custom-form/done/${formId}/${chatId}`, {
                        state: {
                          profileImage: otherProfileImage,
                          userName: otherUserName,
                        },
                      })
                    } else {
                      // API 응답 실패 시 채팅방 ID로 폼 데이터 조회
                      console.error(
                        '폼 데이터 확인 실패: HTTP 상태 코드',
                        response.status
                      )
                      const found = await findAndUpdateFormData()
                      if (!found) {
                        // 폼을 찾지 못한 경우 기본 동작
                        fallbackLogic()
                      }
                    }
                  } catch (error) {
                    console.error('폼 데이터 확인 중 오류:', error)
                    // 오류 발생 시 채팅방 ID로 폼 데이터 조회
                    const found = await findAndUpdateFormData()
                    if (!found) {
                      // 폼을 찾지 못한 경우 기본 동작
                      fallbackLogic()
                    }
                  }
                }

                // API 요청 실패 시 기존 데이터 기반 폴백 로직
                const fallbackLogic = () => {
                  const formId = message.customForm?.id || `form-${message.id}`
                  const answered = message.customForm?.answered || false

                  // 내가 보낸 폼이고 아직 답변이 없으면 아무 동작 안함
                  if (message.isMe && !answered) {
                    showToast('상대방이 아직 답변하지 않았습니다.', 'info')
                    return
                  }

                  // 상대방이 보낸 폼이고 아직 내가 답변 안했으면 답변 페이지로
                  if (!message.isMe && !answered) {
                    const formId = message.customForm?.id || matchingIdFromNav
                    navigate(`/chat/custom-form/view/${formId}/${chatId}`, {
                      state: {
                        profileImage: otherProfileImage,
                        userName: otherUserName,
                      },
                    })
                    return
                  }

                  // 이미 답변한 폼이면 결과 보기
                  navigate(`/chat/custom-form/done/${formId}/${chatId}`, {
                    state: {
                      profileImage: otherProfileImage,
                      userName: otherUserName,
                    },
                  })
                }

                // customForm 필드가 없으면 CustomFormBubbleSend 컴포넌트로 표시
                if (!message.customForm) {
                  return (
                    <div
                      key={`${message.id}-form-no-data-${message.timestamp || ''}`}
                      onClick={handleFormClick}
                      style={{ cursor: 'pointer' }}
                    >
                      <CustomFormBubbleSend
                        isMe={message.isMe}
                        profileImage={
                          message.isMe
                            ? undefined
                            : otherProfileImageFromNav ||
                              '/default-profile-image.png'
                        }
                        timestamp={formatKoreanTime(message.timestamp)}
                        showTime={true}
                        isLastMessage={index === messages.length - 1}
                        isRead={message.isRead}
                        isContinuous={false}
                        isCustomFormMake={true}
                        onClick={handleFormClick}
                        onProfileClick={
                          message.isMe ? undefined : handleProfileClick
                        }
                      />
                    </div>
                  )
                }

                const formId = message.customForm.id
                const answered = message.customForm.answered || false

                if (answered) {
                  // 답변 완료된 폼 - 발신자/수신자 모두 동일한 컴포넌트 사용
                  return (
                    <div
                      key={`${message.id}-form-answered-${message.timestamp || ''}`}
                      onClick={handleFormClick}
                      style={{ cursor: 'pointer' }}
                    >
                      <CustomFormBubbleReceive
                        isMe={message.isMe}
                        profileImage={
                          message.isMe
                            ? undefined
                            : otherProfileImageFromNav ||
                              '/default-profile-image.png'
                        }
                        timestamp={formatKoreanTime(message.timestamp)}
                        showTime={true}
                        isLastMessage={index === messages.length - 1}
                        isRead={message.isRead}
                        isContinuous={false}
                        isCustomFormMake={true}
                        onClick={handleFormClick}
                        onProfileClick={
                          message.isMe ? undefined : handleProfileClick
                        }
                      />
                    </div>
                  )
                } else {
                  // 미답변 폼 - 발신자/수신자 모두 동일한 컴포넌트 사용
                  return (
                    <div
                      key={`${message.id}-form-unanswered-${message.timestamp || ''}`}
                      onClick={handleFormClick}
                      style={{ cursor: 'pointer' }}
                    >
                      <CustomFormBubbleSend
                        isMe={message.isMe}
                        profileImage={
                          message.isMe
                            ? undefined
                            : otherProfileImageFromNav ||
                              '/default-profile-image.png'
                        }
                        timestamp={formatKoreanTime(message.timestamp)}
                        showTime={true}
                        isLastMessage={index === messages.length - 1}
                        isRead={message.isRead}
                        isContinuous={false}
                        isCustomFormMake={true}
                        onClick={handleFormClick}
                        onProfileClick={
                          message.isMe ? undefined : handleProfileClick
                        }
                      />
                    </div>
                  )
                }
              }

              // 토스트박스 메시지는 일단 렌더링 안함
              if (message.type === 'TOAST_BOX') {
                return null // TODO: 토스트박스 UI 구현
              }

              // 기본 텍스트 메시지
              return (
                <div
                  key={message.id}
                  ref={(el) => {
                    messageRefs.current[message.id] = el
                  }}
                  data-message-id={message.id}
                >
                  <Bubble
                    isMe={message.isMe}
                    timestamp={formatKoreanTime(message.timestamp)}
                    showTime={true}
                    isLastMessage={index === messages.length - 1}
                    isRead={message.isRead}
                    isContinuous={false}
                    profileImage={
                      message.isMe
                        ? undefined
                        : otherProfileImageFromNav ||
                          '/default-profile-image.png'
                    }
                    onProfileClick={
                      message.isMe ? undefined : handleProfileClick
                    }
                  >
                    {message.content}
                  </Bubble>
                </div>
              )
            })}
            {isTyping && (
              <Bubble
                isMe={false}
                timestamp=""
                showTime={false}
                profileImage={
                  otherProfileImageFromNav || '/default-profile-image.png'
                }
                onProfileClick={handleProfileClick}
              >
                <div style={{ padding: '4px 8px' }}>
                  <span style={{ fontSize: '14px' }}>입력 중...</span>
                </div>
              </Bubble>
            )}
            <div ref={chatEndRef} />
            {/* 메시지가 없을 때만 안내 메시지 */}
            {messages.length === 0 && !isLoadingMessages && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: '#888',
                }}
              >
                채팅 내용을 불러오는 중입니다...
              </div>
            )}
          </>
        )}
      </ChatContainer>
      <ChatBarWrapper>
        <ChatBar
          onSendMessage={sendMessage}
          onSendEmoticon={sendEmoticon}
          onTyping={handleTyping}
          disabled={
            !stompClient ||
            !isConnected ||
            isLoadingMessages ||
            !!errorMessage ||
            roomStatus !== 'ACTIVE'
          }
          chatId={matchingIdFromNav}
        />
      </ChatBarWrapper>
      {closeModalType === 'REQUEST' && (
        <ModalComponent
          modalType="채팅종료신청"
          isOpen={true}
          onClose={() => setCloseModalType('NONE')}
          buttonText="확인"
          buttonClick={() => setCloseModalType('NONE')}
        />
      )}
      {closeModalType === 'RECEIVE' && (
        <ModalComponent
          modalType="채팅종료수락"
          isOpen={true}
          onClose={() => setCloseModalType('NONE')}
          onAccept={handleCloseAccept}
          onReject={handleCloseReject}
          buttonText=""
          buttonClick={() => {}}
        />
      )}
    </RootContainer>
  )
}

export default ChatRoom
