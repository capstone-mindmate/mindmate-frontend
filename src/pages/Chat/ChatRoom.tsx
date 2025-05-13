/** @jsxImportSource @emotion/react */
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'
import SockJS from 'sockjs-client'
import { Client, Stomp } from '@stomp/stompjs'
import { useAuthStore } from '../../stores/userStore'
import { useUserQuery } from '../../hooks/useUserQuery'
import { getTokenCookie } from '../../utils/fetchWithRefresh'

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
  // 사용자 정보 로드
  const { isLoading: isUserLoading, error: userError } = useUserQuery()

  const [messages, setMessages] = useState<Message[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [otherUserName, setOtherUserName] = useState('상대방')
  const [isTyping, setIsTyping] = useState(false)
  const { showToast } = useToast()
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const stompClientRef = useRef<any>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const [availableEmoticons, setAvailableEmoticons] = useState<any[]>([])
  const [customForms, setCustomForms] = useState<any[]>([])
  const [toastBoxes, setToastBoxes] = useState<any[]>([])
  const myUserId = user?.id || user?.userId

  // 메시지 파싱 함수 (type별로 필요한 필드 보완)
  const parseMessage = (msg: any): Message => {
    const senderId = msg.senderId ?? msg.userId ?? msg.creatorId
    // type, content, emoticonType 등 파싱
    let type = msg.type
    if (typeof type === 'string') type = type.toUpperCase()
    return {
      ...msg,
      isMe: senderId === myUserId,
      type,
      timestamp: msg.timestamp || msg.createdAt || '',
      content: msg.content || msg.message || '',
      emoticonType: msg.emoticonType || msg.emoticonName || msg.emoticonId,
      isRead: msg.isRead ?? false,
    }
  }

  // 1. WebSocket 연결 및 topic 구독
  useEffect(() => {
    if (!chatId) {
      console.log('채팅방 ID가 없습니다.')
      return
    }

    // 쿠키에서 직접 토큰 가져오기
    const cookieToken = getTokenCookie('accessToken')

    // 상태에서 토큰이 없으면 쿠키에서 확인
    const tokenToUse = user?.accessToken || cookieToken

    if (!tokenToUse) {
      console.log('액세스 토큰이 없습니다. 쿠키와 상태 모두 확인했습니다.')
      return
    }

    console.log('WebSocket 연결 시도 중...')
    console.log(`사용할 토큰 시작 부분: ${tokenToUse.substring(0, 15)}...`)

    setIsConnecting(true)

    const socket = new SockJS('http://localhost/api/ws')
    const stompClient = Stomp.over(socket)
    stompClientRef.current = stompClient

    stompClient.connect(
      { Authorization: `Bearer ${tokenToUse}` },
      () => {
        console.log('WebSocket 연결 성공!')
        setIsConnected(true)
        setIsConnecting(false)

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
        stompClient.send(
          '/app/chat.read',
          {},
          JSON.stringify({ roomId: chatId })
        )
      },
      (error: any) => {
        console.error('WebSocket 연결 실패:', error)
        setIsConnecting(false)
      }
    )

    return () => {
      if (stompClient && stompClient.connected) {
        console.log('WebSocket 연결 종료')
        stompClient.disconnect()
      }
      setIsConnected(false)
    }
  }, [chatId, user?.accessToken, isUserLoading, userError])

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
        setMessages(
          Array.isArray(data.messages) ? data.messages.map(parseMessage) : []
        )
      } catch (e) {
        console.error('메시지 조회 실패:', e)
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
        console.error('이모티콘 조회 실패:', e)
        setAvailableEmoticons([])
      }
    }
    fetchMessages()
    fetchEmoticons()
  }, [chatId])

  // 3. 각 topic 핸들러 (isMe 계산 및 읽음 처리)
  const onMessage = (msg: any) => {
    const data = JSON.parse(msg.body)
    setMessages((prev) => [...prev, parseMessage(data)])
    markAsRead()
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
    setMessages((prev) => [...prev, parseMessage(data)])
    markAsRead()
  }
  const onToastBox = (msg: any) => {
    const data = JSON.parse(msg.body)
    setToastBoxes((prev) => [...prev, data])
  }
  const onEmoticon = (msg: any) => {
    const data = JSON.parse(msg.body)
    setMessages((prev) => [...prev, parseMessage(data)])
    markAsRead()
  }

  // 읽음 처리 함수
  const markAsRead = () => {
    stompClientRef.current?.send(
      '/app/chat.read',
      {},
      JSON.stringify({ roomId: chatId })
    )
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
        {isUserLoading ? (
          <LoadingText>사용자 정보 로딩 중...</LoadingText>
        ) : isConnecting ? (
          <LoadingText>WebSocket 연결 중...</LoadingText>
        ) : !isConnected ? (
          <LoadingText>
            {user?.accessToken
              ? '서버에 연결할 수 없습니다'
              : '로그인이 필요합니다'}
          </LoadingText>
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
