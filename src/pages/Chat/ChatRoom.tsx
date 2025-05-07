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
  const [availableEmoticons, setAvailableEmoticons] = useState<any[]>([])
  const [customForms, setCustomForms] = useState<any[]>([])
  const [toastBoxes, setToastBoxes] = useState<any[]>([])

  // 1. WebSocket 연결 및 topic 구독
  useEffect(() => {
    if (!chatId || !user?.accessToken) return
    const socket = new SockJS('http://localhost/api/ws')
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
      stompClient.subscribe(`/topic/chat.room.${chatId}.toastbox`, onToastBox)
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

  // 2. REST 메시지/이모티콘/참가자 상태 등 조회
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
        setMessages(Array.isArray(data.messages) ? data.messages : [])
      } catch (e) {
        setMessages([])
      }
    }
    const fetchEmoticons = async () => {
      try {
        const res = await fetchWithRefresh(
          'http://localhost/api/emoticons/available',
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
        setAvailableEmoticons([])
      }
    }
    fetchMessages()
    fetchEmoticons()
  }, [chatId])

  // 3. 각 topic 핸들러
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
    const data = JSON.parse(msg.body)
    setCustomForms((prev) => [...prev, data])
  }
  const onToastBox = (msg: any) => {
    const data = JSON.parse(msg.body)
    setToastBoxes((prev) => [...prev, data])
  }
  const onEmoticon = (msg: any) => {
    const data = JSON.parse(msg.body)
    setMessages((prev) => [...prev, data])
  }

  // 4. 메시지/이모티콘/리액션/커스텀폼 전송 함수
  const sendMessage = (content: string) => {
    stompClientRef.current?.send(
      '/app/chat.send',
      {},
      JSON.stringify({ roomId: chatId, content, type: 'TEXT' })
    )
  }
  const sendEmoticon = (emoticonType: EmoticonType) => {
    stompClientRef.current?.send(
      '/app/chat.emoticon',
      {},
      JSON.stringify({ roomId: chatId, emoticonType })
    )
  }
  const sendReaction = (messageId: number, reactionType: string) => {
    stompClientRef.current?.send(
      '/app/chat.reaction',
      {},
      JSON.stringify({ messageId, roomId: chatId, reactionType })
    )
  }
  const sendCustomForm = (questions: string[]) => {
    stompClientRef.current?.send(
      '/app/chat.customform.create',
      {},
      JSON.stringify({ chatRoomId: chatId, questions })
    )
  }
  const respondCustomForm = (formId: number, answers: string[]) => {
    stompClientRef.current?.send(
      '/app/chat.customform.respond',
      {},
      JSON.stringify({ formId, answers })
    )
  }

  // 5. UI 렌더링 (type별 분기)
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
          { text: '신고', onClick: () => {} },
          { text: '종료 요청', onClick: () => {} },
          { text: '채팅 제거', onClick: () => {} },
        ]}
      />
      <ChatContainer>
        {!isConnected ? (
          <LoadingText>연결 중입니다...</LoadingText>
        ) : (
          <>
            {messages.map((message: any, index) => {
              // type별로 분기 (서버는 대문자 EMOTICON 등으로 내려옴)
              if (message.type === 'EMOTICON') {
                return (
                  <Bubble
                    key={message.id}
                    isMe={message.isMe}
                    timestamp={message.timestamp}
                    showTime={true}
                    isLastMessage={index === messages.length - 1}
                    isRead={message.isRead}
                    isContinuous={false}
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
              } else if (message.type === 'CUSTOM_FORM') {
                // 커스텀폼 메시지 렌더링
                return null // TODO: 커스텀폼 UI 구현
              } else if (message.type === 'TOAST_BOX') {
                // 토스트박스 메시지 렌더링
                return null // TODO: 토스트박스 UI 구현
              } else {
                // 일반 메시지
                return (
                  <Bubble
                    key={message.id}
                    isMe={message.isMe}
                    timestamp={message.timestamp}
                    showTime={true}
                    isLastMessage={index === messages.length - 1}
                    isRead={message.isRead}
                    isContinuous={false}
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
