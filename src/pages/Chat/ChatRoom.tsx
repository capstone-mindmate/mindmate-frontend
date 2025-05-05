/** @jsxImportSource @emotion/react */
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'

import { RootContainer } from './styles/RootStyles'
import { KebabIcon } from '../../components/icon/iconComponents'
import TopBar from '../../components/topbar/Topbar'
import ChatBar from '../../components/chat/ChatBar'
import Bubble from '../../components/chat/Bubble'
import EmoticonComponent, {
  EmoticonType,
} from '../../components/emoticon/Emoticon'
import { useToast } from '../../components/toast/ToastProvider'

import { ChatContainer } from './styles/RootStyles'
import {
  ChatBarWrapper,
  EmoticonWrapper,
  LoadingText,
} from './styles/ChatRoomStyles'

// 메시지 타입 정의
interface BaseMessage {
  id: string
  isMe: boolean
  timestamp: string
  isRead: boolean
}

interface TextMessage extends BaseMessage {
  type: 'text'
  content: string
}

interface EmoticonMessage extends BaseMessage {
  type: 'emoticon'
  emoticonType: EmoticonType
}

type Message = TextMessage | EmoticonMessage

interface ChatRoomProps {
  chatId: string | undefined
}

const ChatRoom = ({ chatId }: ChatRoomProps) => {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [otherUserName, setOtherUserName] = useState('상대방')
  const [isTyping, setIsTyping] = useState(false)
  const { showToast } = useToast()

  // WebSocket 연결 참조 저장
  const socketRef = useRef<WebSocket | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // 현재 사용자 정보 (실제 구현에서는 인증 시스템과 연동)
  const currentUserId = 'user123' // 실제 구현시 인증에서 가져와야 함

  // WebSocket 연결 설정
  useEffect(() => {
    if (!chatId) {
      showToast('채팅방 ID가 유효하지 않습니다', 'error')
      return
    }

    // WebSocket 연결
    const socket = new WebSocket(`ws://localhost:80/chat/${chatId}`)
    socketRef.current = socket

    // 연결 이벤트 처리
    socket.onopen = () => {
      console.log('WebSocket 연결됨')
      setIsConnected(true)

      // 연결 후 초기 데이터 요청 (채팅 이력 등)
      socket.send(
        JSON.stringify({
          type: 'INIT',
          chatId: chatId,
          userId: currentUserId,
        })
      )
    }

    // 메시지 수신 처리
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        // 메시지 유형에 따른 처리
        switch (data.type) {
          case 'CHAT_HISTORY':
            // 채팅 이력 처리
            const history = data.messages.map((msg: any) => ({
              id: msg.id,
              type: msg.messageType.toLowerCase(),
              content: msg.content,
              emoticonType: msg.emoticonType,
              isMe: msg.senderId === currentUserId,
              timestamp: formatTimestamp(msg.timestamp),
              isRead: msg.isRead,
            }))
            setMessages(history)
            break

          case 'MESSAGE':
            // 새 메시지 처리
            const newMessage: Message = {
              id: data.id,
              type: data.messageType.toLowerCase(),
              content: data.messageType === 'TEXT' ? data.content : '',
              emoticonType:
                data.messageType === 'EMOTICON' ? data.emoticonType : 'normal',
              isMe: data.senderId === currentUserId,
              timestamp: formatTimestamp(data.timestamp),
              isRead: false,
            }
            setMessages((prev) => [...prev, newMessage])
            break

          case 'USER_INFO':
            // 상대방 정보 처리
            setOtherUserName(data.userName)
            break

          case 'TYPING':
            // 타이핑 상태 처리
            setIsTyping(data.senderId !== currentUserId && data.isTyping)
            break

          case 'READ_RECEIPT':
            // 읽음 처리
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id <= data.messageId ? { ...msg, isRead: true } : msg
              )
            )
            break
        }
      } catch (error) {
        console.error('메시지 처리 중 오류:', error)
      }
    }

    // 에러 처리
    socket.onerror = (error) => {
      console.error('WebSocket 오류:', error)
      showToast('연결 중 오류가 발생했습니다', 'error')
    }

    // 연결 종료 처리
    socket.onclose = () => {
      console.log('WebSocket 연결 종료')
      setIsConnected(false)
    }

    // 컴포넌트 언마운트 시 연결 해제
    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close()
      }
    }
  }, [chatId, showToast, currentUserId])

  // 새 메시지가 추가될 때마다 스크롤을 아래로 이동
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 타임스탬프 형식 변환 함수
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp)
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? '오후' : '오전'
    const formattedHours = hours % 12 || 12
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes
    return `${ampm} ${formattedHours}:${formattedMinutes}`
  }

  // 현재 시간을 "오전/오후 h:mm" 형식으로 반환
  const getCurrentTime = (): string => {
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const ampm = hours >= 12 ? '오후' : '오전'
    const formattedHours = hours % 12 || 12
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes
    return `${ampm} ${formattedHours}:${formattedMinutes}`
  }

  // 메시지 전송 함수
  const sendMessage = (
    type: string,
    content: string,
    emoticonType?: EmoticonType
  ) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      showToast('연결이 끊어졌습니다. 다시 시도해주세요.', 'error')
      return
    }

    const messageData = {
      type: 'MESSAGE',
      messageType: type.toUpperCase(),
      content: type === 'text' ? content : '',
      emoticonType: type === 'emoticon' ? emoticonType : null,
      chatId: chatId,
      senderId: currentUserId,
      timestamp: new Date().toISOString(),
    }

    socketRef.current.send(JSON.stringify(messageData))
  }

  // 텍스트 메시지 전송 처리
  const handleSendMessage = (text: string) => {
    if (!text.trim()) return

    // 메시지 전송
    sendMessage('text', text)

    // UI에 즉시 반영 (낙관적 업데이트)
    const newMessage: TextMessage = {
      id: Date.now().toString(),
      type: 'text',
      content: text,
      isMe: true,
      timestamp: getCurrentTime(),
      isRead: false,
    }
    setMessages((prev) => [...prev, newMessage])
  }

  // 이모티콘 메시지 전송 처리
  const handleSendEmoticon = (emoticonType: EmoticonType) => {
    // 메시지 전송
    sendMessage('emoticon', '', emoticonType)

    // UI에 즉시 반영 (낙관적 업데이트)
    const newMessage: EmoticonMessage = {
      id: Date.now().toString(),
      type: 'emoticon',
      emoticonType,
      isMe: true,
      timestamp: getCurrentTime(),
      isRead: false,
    }
    setMessages((prev) => [...prev, newMessage])
  }

  // 타이핑 상태 전송 처리
  const handleTyping = (isTyping: boolean) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN)
      return

    socketRef.current.send(
      JSON.stringify({
        type: 'TYPING',
        chatId: chatId,
        senderId: currentUserId,
        isTyping,
      })
    )
  }

  // 연속된 메시지인지 확인하는 함수
  const isContinuousMessage = (index: number): boolean => {
    if (index === 0) return false
    const currentMsg = messages[index]
    const prevMsg = messages[index - 1]
    return currentMsg.isMe === prevMsg.isMe
  }

  // 시간을 표시할지 결정하는 함수
  const shouldShowTime = (index: number): boolean => {
    if (index === messages.length - 1) return true
    const currentMsg = messages[index]
    const nextMsg = messages[index + 1]
    return currentMsg.isMe !== nextMsg.isMe
  }

  // 뒤로가기 처리
  const handleBackClick = () => {
    navigate('/chat')
  }

  // 케밥 메뉴 클릭 처리
  const handleKebabClick = () => {
    // 추후 구현: 채팅방 메뉴 (신고, 차단, 나가기 등)
    showToast('채팅방 메뉴 준비 중입니다', 'info')
  }

  return (
    <RootContainer>
      <TopBar
        title={otherUserName}
        showBackButton={true}
        onBackClick={handleBackClick}
        rightContent={<KebabIcon color="#000000" onClick={handleKebabClick} />}
      />

      <ChatContainer>
        {!isConnected ? (
          <LoadingText>연결 중입니다...</LoadingText>
        ) : (
          <>
            {messages.map((message, index) => {
              const isContinuous = isContinuousMessage(index)
              const showTime = shouldShowTime(index)
              const isLastMessage = index === messages.length - 1

              if (message.type === 'emoticon') {
                return (
                  <Bubble
                    key={message.id}
                    isMe={message.isMe}
                    timestamp={message.timestamp}
                    showTime={showTime}
                    isLastMessage={isLastMessage}
                    isRead={message.isRead}
                    isContinuous={isContinuous}
                    profileImage={
                      message.isMe ? undefined : '/public/image.png'
                    }
                  >
                    <EmoticonWrapper>
                      <EmoticonComponent
                        type={message.emoticonType}
                        size="large"
                        inChat={true}
                        alt={`${message.emoticonType} 이모티콘`}
                      />
                    </EmoticonWrapper>
                  </Bubble>
                )
              } else {
                return (
                  <Bubble
                    key={message.id}
                    isMe={message.isMe}
                    timestamp={message.timestamp}
                    showTime={showTime}
                    isLastMessage={isLastMessage}
                    isRead={message.isRead}
                    isContinuous={isContinuous}
                    profileImage={
                      message.isMe ? undefined : '/public/image.png'
                    }
                  >
                    {message.content}
                  </Bubble>
                )
              }
            })}

            {isTyping && (
              <Bubble
                isMe={false}
                timestamp=""
                showTime={false}
                profileImage="/public/image.png"
              >
                <div style={{ padding: '4px 8px' }}>
                  <span style={{ fontSize: '14px' }}>입력 중...</span>
                </div>
              </Bubble>
            )}

            <div ref={chatEndRef} />
          </>
        )}
      </ChatContainer>

      <ChatBarWrapper>
        <ChatBar
          onSendMessage={handleSendMessage}
          onSendEmoticon={handleSendEmoticon}
          onTyping={handleTyping}
          disabled={!isConnected}
          chatId={chatId}
        />
      </ChatBarWrapper>
    </RootContainer>
  )
}

export default ChatRoom
