/** @jsxImportSource @emotion/react */
import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../stores/userStore'
import { useUserQuery } from '../../hooks/useUserQuery'
import { useChatRoom } from '../../hooks/useChatRoom'
import { CustomFormMessage } from '../../types/message'

import { RootContainer } from './styles/RootStyles'
import { KebabIcon } from '../../components/icon/iconComponents'
import TopBar from '../../components/topbar/Topbar'
import ChatBar, { ChatBarRef } from '../../components/chat/ChatBar'
import Bubble from '../../components/chat/Bubble'
import EmoticonComponent from '../../components/emoticon/Emoticon'
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

interface ChatRoomProps {
  chatId: string | undefined
}

const ChatRoom = ({ chatId }: ChatRoomProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuthStore()
  const { isLoading: isUserLoading } = useUserQuery()
  const { showToast } = useToast()

  const chatBarRef = useRef<ChatBarRef>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // 리팩토링된 채팅룸 훅 사용
  const {
    messages,
    isLoadingMessages,
    errorMessage,
    customForms,
    sendMessage,
    sendEmoticon,
    markAsRead,
  } = useChatRoom({
    chatId: chatId || '',
    chatBarRef,
  })

  // UI 상태
  const [isAtBottom, setIsAtBottom] = useState(true)
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
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
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // 네비게이션 상태
  const otherProfileImageFromNav = location.state?.profileImage
  const otherUserNameFromNav = location.state?.userName
  const matchingIdFromNav = location.state?.matchingId
  const [otherUserName, setOtherUserName] = useState(
    otherUserNameFromNav || '상대방'
  )

  const myUserId = user?.userId
  const otherUserId =
    location.state?.oppositeId || messages.find((m) => !m.isMe)?.senderId || ''

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

  // 새 메시지 오면 자동 스크롤
  useEffect(() => {
    if (isAtBottom && chatEndRef.current && !isLoadingMessages) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isAtBottom, isLoadingMessages])

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
  }, [chatId, markAsRead])

  // 채팅창 맨 아래 도달 시 읽음 처리
  useEffect(() => {
    if (!chatEndRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && chatId) {
          markAsRead()
        }
      },
      { threshold: 1 }
    )
    observer.observe(chatEndRef.current)
    return () => observer.disconnect()
  }, [chatId, messages.length, markAsRead])

  // 상대방 이름 설정
  useEffect(() => {
    if (otherUserNameFromNav) setOtherUserName(otherUserNameFromNav)
  }, [otherUserNameFromNav])

  // 시간 포맷 함수
  const formatKoreanTime = (timestamp: string) => {
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

  // 프로필 이미지 클릭 핸들러
  const handleProfileClick = () => {
    if (otherUserId) {
      navigate(`/mypage/${otherUserId}`)
    } else {
      showToast('상대방 정보를 찾을 수 없습니다.', 'error')
    }
  }

  // 종료 요청
  const handleCloseRequest = async () => {
    try {
      await fetchWithRefresh(
        `https://mindmate.shop/api/chat/rooms/${chatId}/close`,
        { method: 'POST' }
      )
      setCloseModalType('REQUEST')
      setRoomStatus('CLOSE_REQUEST')
    } catch (e) {
      showToast('종료 요청 실패', 'error')
    }
  }

  // 종료 수락
  const handleCloseAccept = async () => {
    try {
      await fetchWithRefresh(
        `https://mindmate.shop/api/chat/rooms/${chatId}/close/accept`,
        { method: 'POST' }
      )
      setCloseModalType('NONE')
      navigate(`/review/${chatId}`, {
        state: { opponentName: otherUserName },
      })
    } catch (e) {
      showToast('종료 수락 실패', 'error')
    }
  }

  // 종료 거절
  const handleCloseReject = async () => {
    try {
      await fetchWithRefresh(
        `https://mindmate.shop/api/chat/rooms/${chatId}/close/reject`,
        { method: 'POST' }
      )
      setCloseModalType('NONE')
    } catch (e) {
      showToast('종료 거절 실패', 'error')
    }
  }

  // 채팅 삭제
  const handleDeleteChatRoom = async () => {
    if (!chatId) {
      showToast('채팅방 정보가 없습니다.', 'error')
      return
    }

    try {
      showToast('채팅방을 삭제하는 중입니다...', 'info')

      const res = await fetchWithRefresh(
        `https://mindmate.shop/api/chat/rooms/${chatId}/delete`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      )

      if (res.ok) {
        navigate('/chat')
        showToast('채팅방이 삭제되었습니다.', 'success')
      } else {
        if (res.status === 404) {
          showToast('이미 삭제된 채팅방입니다.', 'error')
        } else if (res.status === 403) {
          showToast('채팅방을 삭제할 권한이 없습니다.', 'error')
        } else {
          showToast('채팅방 삭제에 실패했습니다.', 'error')
        }
      }
    } catch (error) {
      console.error('채팅방 삭제 실패:', error)
      showToast('채팅방 삭제 중 오류가 발생했습니다.', 'error')
    } finally {
      setIsBottomSheetOpen(false)
      setShowDeleteModal(false)
    }
  }

  const handleDeleteButtonClick = () => {
    setIsBottomSheetOpen(false)
    setShowDeleteModal(true)
  }

  // 커스텀폼 클릭 핸들러
  const handleCustomFormClick = async (message: CustomFormMessage) => {
    const formId = message.customForm?.id
    const answered = message.customForm?.answered || false

    if (!formId || !chatId) {
      showToast('폼 정보가 유효하지 않습니다.', 'error')
      return
    }

    try {
      // 최신 폼 데이터 조회
      const response = await fetchWithRefresh(
        `https://mindmate.shop/api/custom-forms/${formId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      )

      if (response.ok) {
        const formData = await response.json()
        const isAnswered = formData.answered || false

        // 내가 보낸 폼이고 아직 답변이 없으면
        if (message.isMe && !isAnswered) {
          showToast('상대방이 아직 답변하지 않았습니다.', 'info')
          return
        }

        // 상대방이 보낸 폼이고 아직 내가 답변 안했으면
        if (!message.isMe && !isAnswered) {
          navigate(`/chat/custom-form/view/${formId}/${chatId}`, {
            state: {
              profileImage: otherProfileImageFromNav,
              userName: otherUserName,
            },
          })
          return
        }

        // 이미 답변한 폼이면 결과 보기
        navigate(`/chat/custom-form/done/${formId}/${chatId}`, {
          state: {
            profileImage: otherProfileImageFromNav,
            userName: otherUserName,
          },
        })
      } else {
        showToast('폼 정보를 불러올 수 없습니다.', 'error')
      }
    } catch (error) {
      console.error('폼 데이터 확인 중 오류:', error)
      showToast('폼 정보 확인 중 오류가 발생했습니다.', 'error')
    }
  }

  // 로드 실패 시 재시도
  const handleRetry = () => {
    setErrorMessage(null)
    // fetchMessages() 호출 필요시 여기서 처리
  }

  if (isUserLoading) {
    return (
      <RootContainer>
        <LoadingText>사용자 정보 로딩 중...</LoadingText>
      </RootContainer>
    )
  }

  if (errorMessage) {
    return (
      <RootContainer>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ color: '#ff4444', marginBottom: '20px' }}>
            {errorMessage}
          </div>
          <button onClick={handleRetry}>다시 시도</button>
        </div>
      </RootContainer>
    )
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
          ...(roomStatus === 'CLOSED'
            ? [
                {
                  text: '채팅 제거',
                  onClick: handleDeleteButtonClick,
                },
              ]
            : [
                {
                  text: '종료 요청',
                  onClick: handleCloseRequest,
                },
              ]),
        ]}
      />

      <ChatContainer ref={chatContainerRef}>
        {isLoadingMessages ? (
          <LoadingText>채팅 내용을 불러오는 중...</LoadingText>
        ) : (
          <>
            {messages.map((message, index) => {
              // 이모티콘 메시지
              if (message.type === 'EMOTICON') {
                return (
                  <div key={message.id}>
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
                            'https://mindmate.shop/api' +
                            (message as any).emoticonUrl
                          }
                          type={(message as any).emoticonType}
                          size="large"
                          inChat={true}
                          alt={`${(message as any).emoticonType} 이모티콘`}
                        />
                      </EmoticonWrapper>
                    </Bubble>
                  </div>
                )
              }

              // 커스텀폼 메시지
              if (message.type === 'CUSTOM_FORM') {
                const customFormMessage = message as CustomFormMessage
                const answered = customFormMessage.customForm?.answered || false

                if (answered) {
                  return (
                    <div
                      key={message.id}
                      onClick={() => handleCustomFormClick(customFormMessage)}
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
                        onClick={() => handleCustomFormClick(customFormMessage)}
                      />
                    </div>
                  )
                } else {
                  return (
                    <div
                      key={message.id}
                      onClick={() => handleCustomFormClick(customFormMessage)}
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
                        onClick={() => handleCustomFormClick(customFormMessage)}
                      />
                    </div>
                  )
                }
              }

              // 기본 텍스트 메시지
              return (
                <div key={message.id}>
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

            <div ref={chatEndRef} />

            {messages.length === 0 && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: '#888',
                }}
              >
                첫 대화를 나누어보세요!
              </div>
            )}
          </>
        )}
      </ChatContainer>

      <ChatBarWrapper>
        <ChatBar
          ref={chatBarRef}
          onSendMessage={sendMessage}
          onSendEmoticon={sendEmoticon}
          disabled={
            isLoadingMessages || !!errorMessage || roomStatus !== 'ACTIVE'
          }
          chatId={matchingIdFromNav}
        />
      </ChatBarWrapper>

      {/* 모달들 */}
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

      {showDeleteModal && (
        <ModalComponent
          modalType="채팅방삭제"
          isOpen={true}
          onClose={() => setShowDeleteModal(false)}
          onAccept={handleDeleteChatRoom}
          onReject={() => setShowDeleteModal(false)}
          buttonText="삭제"
          buttonClick={() => {}}
        />
      )}
    </RootContainer>
  )
}

export default ChatRoom
