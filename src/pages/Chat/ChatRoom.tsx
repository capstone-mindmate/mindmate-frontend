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

  // 리팩토링된 채팅룸 훅 사용 (종료 기능 포함)
  const {
    messages,
    isLoadingMessages,
    errorMessage,
    customForms,
    roomStatus,
    closeModalType,
    closeRequestRoleType,
    listener,
    sendMessage,
    sendEmoticon,
    markAsRead,
    setErrorMessage,
    setCloseModalType,
    requestClose,
    acceptClose,
    rejectClose,
  } = useChatRoom({
    chatId: chatId || '',
    chatBarRef,
  })

  // UI 상태
  const [isAtBottom, setIsAtBottom] = useState(true)
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // 실시간 종료 추적
  const [isRealTimeClose, setIsRealTimeClose] = useState(false)
  const [prevRoomStatus, setPrevRoomStatus] = useState<
    'ACTIVE' | 'CLOSED' | 'CLOSE_REQUEST'
  >('ACTIVE')

  // 이전 메시지 로드 관련 상태
  const [isLoadingPrev, setIsLoadingPrev] = useState(false)
  const [hasMorePrev, setHasMorePrev] = useState(true)

  // 메시지 참조 추적
  const messageRefs = useRef<{ [id: string]: HTMLDivElement | null }>({})

  // 이모티콘 피커 상태
  const [isEmoticonPickerOpen, setIsEmoticonPickerOpen] = useState(false)

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

  // useEffect들
  // 상대방 이름 설정
  useEffect(() => {
    if (otherUserNameFromNav) setOtherUserName(otherUserNameFromNav)
  }, [otherUserNameFromNav])

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

  // 종료 수락 시 리뷰 페이지로 이동 처리
  useEffect(() => {
    // roomStatus가 변경되어 CLOSED가 되었고, 초기 로딩이 완료된 경우에만
    if (
      prevRoomStatus === 'CLOSE_REQUEST' &&
      roomStatus === 'CLOSED' &&
      !isLoadingMessages &&
      closeModalType === 'NONE'
    ) {
      // 웹소켓으로 받은 종료 알림인 경우 리뷰 페이지로 이동
      const timer = setTimeout(() => {
        navigate(`/review/${chatId}`, {
          state: { opponentName: otherUserName },
        })
      }, 500)

      return () => clearTimeout(timer)
    }

    // 이전 상태 업데이트
    setPrevRoomStatus(roomStatus)
  }, [
    roomStatus,
    prevRoomStatus,
    isLoadingMessages,
    closeModalType,
    chatId,
    otherUserName,
    navigate,
  ])

  // 이모티콘 피커가 열릴 때 채팅을 맨 아래로 스크롤 (핸들러에서 처리하므로 제거)
  // useEffect(() => {
  //   if (isEmoticonPickerOpen && chatEndRef.current) {
  //     chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
  //   }
  // }, [isEmoticonPickerOpen])

  // 이전 메시지 무한 스크롤 처리
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

  // 메시지 가시성 감지 IntersectionObserver
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

  // PWA 키보드 감지 및 이모티콘 피커 자동 닫기
  useEffect(() => {
    let initialViewportHeight =
      window.visualViewport?.height || window.innerHeight

    const handleViewportChange = () => {
      const currentHeight = window.visualViewport?.height || window.innerHeight
      const heightDifference = initialViewportHeight - currentHeight

      // 키보드가 올라왔다고 판단 (높이가 150px 이상 줄어들었을 때)
      if (heightDifference > 100 && isEmoticonPickerOpen) {
        setIsEmoticonPickerOpen(false)
      }

      // 키보드가 내려갔을 때 초기 높이 업데이트
      if (heightDifference < 50) {
        initialViewportHeight = currentHeight
      }
    }

    // Visual Viewport API 지원 시 사용 (더 정확함)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange)
      return () => {
        window.visualViewport?.removeEventListener(
          'resize',
          handleViewportChange
        )
      }
    } else {
      // 폴백: window resize 이벤트 사용
      window.addEventListener('resize', handleViewportChange)
      return () => {
        window.removeEventListener('resize', handleViewportChange)
      }
    }
  }, [isEmoticonPickerOpen])

  // 함수들
  // 유틸리티 함수
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

  // 이전 메시지 로드 함수
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
        `http://localhost/api/chat/rooms/${chatId}/messages/before/${oldestId}?size=30`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      )

      if (!res.ok) throw new Error('이전 메시지 불러오기 실패')

      const data = await res.json()

      if (Array.isArray(data) && data.length > 0) {
        const newMsgs = data
          .map((msg) => {
            return {
              id: msg.id || msg.messageId || `msg-${Date.now()}`,
              isMe: String(msg.senderId) === String(myUserId),
              timestamp:
                msg.createdAt || msg.timestamp || new Date().toISOString(),
              isRead: msg.isRead ?? false,
              senderId: msg.senderId,
              type: msg.type || 'TEXT',
              content: msg.content || msg.message || '',
            }
          })
          .filter((msg) => !messages.some((m) => m.id === msg.id))

        setMessages((prev) => [...newMsgs, ...prev])

        if (data.length < 30) setHasMorePrev(false)
      } else {
        setHasMorePrev(false)
      }
    } catch (e) {
      console.error('이전 메시지 로드 실패:', e)
      setHasMorePrev(false)
    } finally {
      setIsLoadingPrev(false)
    }
  }

  // 이벤트 핸들러들
  const handleProfileClick = () => {
    if (otherUserId) {
      navigate(`/mypage/${otherUserId}`)
    } else {
      showToast('상대방 정보를 찾을 수 없습니다.', 'error')
    }
  }

  const handleRetry = () => {
    setErrorMessage(null)
  }

  // 이모티콘 피커 열림/닫힘 핸들러
  const handleEmoticonPickerToggle = (isOpen: boolean) => {
    setIsEmoticonPickerOpen(isOpen)

    // 피커가 열릴 때 스크롤을 즉시 실행
    if (isOpen && chatEndRef.current) {
      // transform 애니메이션과 함께 부드럽게 스크롤
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        })
      }, 50) // 아주 짧은 딜레이로 transform과 타이밍 맞춤
    }
  }

  // 키보드 포커스 시 이모티콘 피커 닫기 핸들러
  const handleInputFocus = () => {
    if (isEmoticonPickerOpen) {
      setIsEmoticonPickerOpen(false)
    }
  }

  // 종료 기능 핸들러들
  const handleCloseRequest = async () => {
    const success = await requestClose()
    if (success) {
      setIsBottomSheetOpen(false)
    }
  }

  const handleCloseAccept = async () => {
    const success = await acceptClose()
    if (success) {
      setTimeout(() => {
        navigate(`/review/${chatId}`, {
          state: { opponentName: otherUserName },
        })
      }, 500)
    }
  }

  const handleCloseReject = async () => {
    const success = await rejectClose()
  }

  const handleDeleteButtonClick = () => {
    setIsBottomSheetOpen(false)
    setShowDeleteModal(true)
  }

  // 채팅 삭제 핸들러
  const handleDeleteChatRoom = async () => {
    if (!chatId) {
      showToast('채팅방 정보가 없습니다.', 'error')
      return
    }

    try {
      showToast('채팅방을 삭제하는 중입니다...', 'info')

      const res = await fetchWithRefresh(
        `http://localhost/api/chat/rooms/${chatId}/delete`,
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

  // 커스텀폼 클릭 핸들러
  const handleCustomFormClick = async (message: CustomFormMessage) => {
    const formId = message.customForm?.id
    const answered = message.customForm?.answered || false

    if (!formId || !chatId) {
      showToast('폼 정보가 유효하지 않습니다.', 'error')
      return
    }

    try {
      const response = await fetchWithRefresh(
        `http://localhost/api/custom-forms/${formId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      )

      if (response.ok) {
        const formData = await response.json()
        const isAnswered = formData.answered || false

        if (message.isMe && !isAnswered) {
          showToast('상대방이 아직 답변하지 않았습니다.', 'info')
          return
        }

        if (!message.isMe && !isAnswered) {
          navigate(`/chat/custom-form/view/${formId}/${chatId}`, {
            state: {
              profileImage: otherProfileImageFromNav,
              userName: otherUserName,
            },
          })
          return
        }

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

  // 조건부 렌더링
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

  // 메인 렌더링
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

      <ChatContainer
        ref={chatContainerRef}
        style={{
          transform: isEmoticonPickerOpen
            ? 'translateY(-200px)'
            : 'translateY(20px)',
          transition: 'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          paddingBottom: isEmoticonPickerOpen ? '10px' : '70px', // 여백도 함께 조정
        }}
      >
        {isLoadingMessages ? (
          <LoadingText>채팅 내용을 불러오는 중...</LoadingText>
        ) : (
          <>
            {messages.map((message, index) => {
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
                            'http://localhost/api' +
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
                      ref={(el) => {
                        messageRefs.current[message.id] = el
                      }}
                      data-message-id={message.id}
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
                        onProfileClick={
                          message.isMe ? undefined : handleProfileClick
                        }
                      />
                    </div>
                  )
                } else {
                  return (
                    <div
                      key={message.id}
                      ref={(el) => {
                        messageRefs.current[message.id] = el
                      }}
                      data-message-id={message.id}
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
                        onProfileClick={
                          message.isMe ? undefined : handleProfileClick
                        }
                      />
                    </div>
                  )
                }
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
          onEmoticonPickerToggle={handleEmoticonPickerToggle}
          onInputFocus={handleInputFocus} // 인풋 포커스 핸들러 추가
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
          onClose={handleCloseReject}
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
