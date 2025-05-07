/** @jsxImportSource @emotion/react */
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'
import SockJS from 'sockjs-client'
import { Client, Stomp } from '@stomp/stompjs'
import { useAuthStore } from '../../stores/userStore'

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
import { fetchWithRefresh } from '../../utils/fetchWithRefresh'

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
  const { user } = useAuthStore()
  const [messages, setMessages] = useState<Message[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [otherUserName, setOtherUserName] = useState('상대방')
  const [isTyping, setIsTyping] = useState(false)
  const { showToast } = useToast()
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const stompClientRef = useRef<any>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // 최초 1회 REST로 메시지 목록 불러오기
  useEffect(() => {
    if (!chatId) return
    const fetchMessages = async () => {
      try {
        const res = await fetchWithRefresh(
          `http://localhost/api/chat/rooms/${chatId}/messages`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        )
        if (!res.ok) throw new Error('메시지 목록을 불러오지 못했습니다.')
        const data = await res.json()
        if (Array.isArray(data.messages)) {
          setMessages(data.messages)
        } else {
          setMessages([])
        }
      } catch (e) {
        setMessages([])
      }
    }
    fetchMessages()
  }, [chatId])

  // WebSocket 연결/구독
  useEffect(() => {
    if (!chatId || !user?.accessToken) return
    const socket = new SockJS('http://localhost:8080/ws')
    const stompClient = Stomp.over(socket)
    stompClientRef.current = stompClient
    stompClient.connect({ Authorization: `Bearer ${user.accessToken}` }, () => {
      setIsConnected(true)
      stompClient.subscribe(`/topic/chat.room.${chatId}`, onMessage)
      stompClient.subscribe(`/topic/chat.room.${chatId}.read`, onRead)
      stompClient.subscribe(`/topic/chat.room.${chatId}.reaction`, onReaction)
      stompClient.subscribe(
        `/topic/chat.room.${chatId}.customform`,
        onCustomForm
      )
      stompClient.subscribe(`/topic/chat.room.${chatId}.emoticon`, onEmoticon)
      stompClient.send(
        '/app/presence',
        {},
        JSON.stringify({ status: 'ONLINE', activeRoomId: chatId })
      )
      stompClient.send('/app/chat.read', {}, JSON.stringify({ roomId: chatId }))
    })
    return () => {
      stompClient.disconnect()
      setIsConnected(false)
    }
  }, [chatId, user?.accessToken])

  // 메시지 수신 핸들러 예시
  const onMessage = (msg: any) => {
    const data = JSON.parse(msg.body)
    setMessages((prev) => [...prev, data])
  }
  const onRead = (msg: any) => {
    /* 읽음 처리 UI 반영 */
  }
  const onReaction = (msg: any) => {
    /* 리액션 UI 반영 */
  }
  const onCustomForm = (msg: any) => {
    /* 커스텀폼 UI 반영 */
  }
  const onEmoticon = (msg: any) => {
    /* 이모티콘 UI 반영 */
  }

  // 메시지 전송
  const sendMessage = (content: string) => {
    stompClientRef.current?.send(
      '/app/chat.send',
      {},
      JSON.stringify({ roomId: chatId, content, type: 'TEXT' })
    )
  }
  // 이모티콘 전송
  const sendEmoticon = (emoticonType: EmoticonType) => {
    stompClientRef.current?.send(
      '/app/chat.emoticon',
      {},
      JSON.stringify({ roomId: chatId, emoticonType })
    )
  }
  // 리액션 전송
  const sendReaction = (messageId: number, reactionType: string) => {
    stompClientRef.current?.send(
      '/app/chat.reaction',
      {},
      JSON.stringify({ messageId, roomId: chatId, reactionType })
    )
  }
  // 읽음 처리
  const markAsRead = () => {
    stompClientRef.current?.send(
      '/app/chat.read',
      {},
      JSON.stringify({ roomId: chatId })
    )
  }

  // 새 메시지가 추가될 때마다 스크롤을 아래로 이동
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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
    setIsBottomSheetOpen(true)
  }

  return (
    <RootContainer>
      <TopBar
        title={otherUserName}
        showBackButton={true}
        onBackClick={handleBackClick}
        rightContent={<KebabIcon color="#000000" onClick={handleKebabClick} />}
      />

      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        menuItems={[
          { text: '신고', onClick: () => {} },
          { text: '종료 요청', onClick: () => {} },
          {
            text: '채팅 제거',
            onClick: () => {
              // API 호출로 확인하고 지우기
            },
          },
        ]}
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
          onSendMessage={sendMessage}
          onSendEmoticon={sendEmoticon}
          onTyping={setIsTyping}
          disabled={!isConnected}
          chatId={chatId}
        />
      </ChatBarWrapper>
    </RootContainer>
  )
}

export default ChatRoom
