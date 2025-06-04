import { useRef, useCallback, useMemo } from 'react'
import {
  Message,
  CustomFormMessage,
  TextMessage,
  EmoticonMessage,
  EmoticonType,
} from '../types/message'

interface UseMessageProcessorProps {
  myUserId: string | number
  showToast: (message: string, type: 'success' | 'error' | 'info') => void
  chatBarRef: React.RefObject<any>
}

export const useMessageProcessor = ({
  myUserId,
  showToast,
  chatBarRef,
}: UseMessageProcessorProps) => {
  const messageProcessingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 메시지 파싱 함수 - 메모이제이션으로 최적화
  const parseMessage = useCallback(
    (msg: any): Message => {
      let type = msg.type
      if (typeof type === 'string') type = type.toUpperCase()

      const baseMessage = {
        id: msg.id || msg.messageId || `msg-${Date.now()}-${Math.random()}`,
        isMe: String(msg.senderId) === String(myUserId),
        timestamp: msg.createdAt || msg.timestamp || new Date().toISOString(),
        isRead: msg.isRead ?? false,
        senderId: msg.senderId,
      }

      // 이모티콘 메시지
      if (msg.emoticonId && msg.emoticonUrl && msg.emoticonName) {
        return {
          ...baseMessage,
          type: 'EMOTICON',
          content: '',
          emoticonId: msg.emoticonId,
          emoticonName: msg.emoticonName,
          emoticonUrl: msg.emoticonUrl,
          emoticonType: msg.emoticonName as EmoticonType,
          senderName: msg.senderName,
        } as EmoticonMessage
      }

      // 커스텀폼 메시지
      if (type === 'CUSTOM_FORM') {
        const customForm = msg.customForm || {
          id: msg.formId || `custom-form-${Date.now()}`,
          items: msg.items || [],
          answered: msg.answered || false,
          creatorId: msg.creatorId || msg.senderId,
          responderId: msg.responderId,
        }

        return {
          ...baseMessage,
          type: 'CUSTOM_FORM',
          content: msg.content || msg.message || '커스텀 폼',
          customForm,
          isCustomFormMine: String(customForm.creatorId) === String(myUserId),
          isCustomFormAnswered: !!customForm.answered,
          isCustomFormResponder:
            String(customForm.responderId) === String(myUserId),
        } as CustomFormMessage
      }

      // 이모티콘 타입
      if (type === 'EMOTICON') {
        return {
          ...baseMessage,
          type: 'EMOTICON',
          content: msg.content || msg.message || '',
          emoticonType: msg.emoticonType || msg.emoticonName || msg.emoticonId,
          emoticonId: msg.emoticonId,
          emoticonUrl: msg.emoticonUrl,
          emoticonName: msg.emoticonName,
        } as EmoticonMessage
      }

      // 기본 텍스트 메시지
      return {
        ...baseMessage,
        type: 'TEXT',
        content: msg.content || msg.message || '',
      } as TextMessage
    },
    [myUserId]
  )

  // 간단한 메시지 추가 함수 (버퍼링 제거, 성능 최적화)
  const addMessage = useCallback(
    (
      message: Message,
      setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
      markAsRead: () => void
    ) => {
      //console.log('메시지 추가 요청:', message)

      // 커스텀폼 메시지는 useCustomForm에서만 처리하도록 차단
      if (message.type === 'CUSTOM_FORM') {
        //console.log('커스텀폼 메시지는 useCustomForm에서 처리하므로 무시:', message.id)
        return
      }

      setMessages((prev) => {
        // 일반 메시지는 ID와 기본 정보로만 중복 체크
        const isDuplicate = prev.some((m) => {
          return (
            m.id === message.id ||
            (m.content === message.content &&
              m.timestamp === message.timestamp &&
              m.senderId === message.senderId)
          )
        })

        if (isDuplicate) {
          //console.log('중복 메시지 감지, 추가하지 않음:', message.id)
          return prev
        }

        //console.log('새 메시지 추가됨:', message.id, message.content)

        // 메시지 추가 후 즉시 정렬
        const newMessages = [...prev, message].sort((a, b) => {
          const timeA = new Date(a.timestamp).getTime()
          const timeB = new Date(b.timestamp).getTime()
          return timeA - timeB
        })

        //console.log('메시지 추가 및 정렬 완료, 총 메시지 수:', newMessages.length)
        return newMessages
      })

      markAsRead()
    },
    []
  )

  // 일반 메시지 처리 - 복잡한 로직 제거
  const processTextMessage = useCallback(
    (
      data: any,
      setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
      markAsRead: () => void
    ) => {
      // 부적절한 내용 감지
      if (data.content === '[부적절한 내용이 감지되었습니다]') {
        showToast('부적절한 내용이 감지되었습니다.', 'error')
        if (chatBarRef.current) {
          chatBarRef.current.handleFilteredMessage()
        }
        return false
      }

      // 키워드 정보 알림
      if (
        (data.keyword && data.title && data.content) ||
        data.type === 'KEYWORD_INFO' ||
        data.messageType === 'KEYWORD_INFO' ||
        (data.content && typeof data.content === 'string' && data.linkUrl)
      ) {
        let toastMessage = ''
        if (data.title) toastMessage = data.title
        if (data.content && data.content !== data.title) {
          if (toastMessage) toastMessage += '\n'
          toastMessage += data.content
        }
        if (data.linkUrl) toastMessage += '\n' + data.linkUrl

        if (toastMessage.trim()) {
          showToast(toastMessage, 'info')
        }
        return false
      }

      // 시스템 메시지
      if (data.type === 'SYSTEM' || data.messageType === 'SYSTEM') {
        if (data.content && data.content.trim()) {
          showToast(data.content, 'info')
        }
        return false
      }

      // 빈 메시지 필터링
      if (
        !data.content ||
        data.content.trim() === '' ||
        data.content === null ||
        data.content === undefined ||
        (typeof data.content === 'string' && data.content.trim().length === 0)
      ) {
        return false
      }

      // ChatBar 전송 완료 처리
      if (String(data.senderId) === String(myUserId) && chatBarRef.current) {
        chatBarRef.current.handleMessageSent()
      }

      // 메시지 파싱 및 추가
      const newMessage = parseMessage(data)
      addMessage(newMessage, setMessages, markAsRead)

      return true
    },
    [myUserId, showToast, chatBarRef, parseMessage, addMessage]
  )

  // 클린업
  const cleanup = useCallback(() => {
    if (messageProcessingTimeoutRef.current) {
      clearTimeout(messageProcessingTimeoutRef.current)
    }
  }, [])

  // 메모이제이션된 반환값
  return useMemo(
    () => ({
      parseMessage,
      processTextMessage,
      addMessage,
      cleanup,
    }),
    [parseMessage, processTextMessage, addMessage, cleanup]
  )
}
