import React, { useState, useRef, useEffect } from 'react'
import styled from '@emotion/styled'
import { useToast } from '../../components/toast/Toastprovider'
import Bubble from '../../components/chat/Bubble'
import EmoticonComponent, {
  EmoticonType,
} from '../../components/emoticon/Emoticon'
import TopBar from '../../components/topbar/Topbar'
import ChatBar from '../../components/chat/ChatBar'

// ChatTest 컴포넌트 내부에서 사용할 스타일 컴포넌트 정의
const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 100%;
  margin: 0 auto;
  position: relative;
  background-color: #f9f9f9;
`

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 70px; // TopBar 높이만큼 여백 추가
`

const ChatBarWrapper = styled.div`
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 100;
  boxsizing: 'border-box' as const;
`

const EmoticonWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 5px;
`

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

const ChatTest: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'text',
      content: '안녕하세요! 어떤 고민이 있으신가요?',
      isMe: false,
      timestamp: '오후 2:30',
      isRead: true,
    },
  ])
  const chatEndRef = useRef<HTMLDivElement>(null)
  const { showToast } = useToast()

  // 새 메시지가 추가될 때마다 스크롤을 아래로 이동
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleBackClick = () => {
    showToast('뒤로가기 버튼이 클릭되었습니다', 'info')
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

  // 텍스트 메시지 전송 처리
  const handleSendMessage = (text: string) => {
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

  return (
    <ChatContainer>
      <TopBar
        title="채팅 테스트"
        showBackButton
        onBackClick={handleBackClick}
      />

      <ChatMessages>
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
                profileImage={message.isMe ? undefined : '/public/image.png'}
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
                profileImage={message.isMe ? undefined : '/public/image.png'}
              >
                {message.content}
              </Bubble>
            )
          }
        })}
        <div ref={chatEndRef} />
      </ChatMessages>

      <ChatBarWrapper>
        <ChatBar
          onSendMessage={handleSendMessage}
          onSendEmoticon={handleSendEmoticon}
        />
      </ChatBarWrapper>
    </ChatContainer>
  )
}

export default ChatTest
