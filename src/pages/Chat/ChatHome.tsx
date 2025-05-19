/** @jsxImportSource @emotion/react */
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import { RootContainer, ChatContainer, LogoText } from './styles/RootStyles'
import { CategoryFilterContainer } from './styles/ChatHomeStyles'

import TopBar from '../../components/topbar/Topbar'
import NavigationComponent from '../../components/navigation/navigationComponent'
import FilterButton from '../../components/buttons/filterButton'
import ChatItem from '../../components/chat/pageComponent/ChatItem'
import { fetchWithRefresh, getTokenCookie } from '../../utils/fetchWithRefresh'
import { useAuthStore } from '../../stores/userStore'
import { useUserQuery } from '../../hooks/useUserQuery'
import { useMessageStore } from '../../store/messageStore'
import { useSocketMessage } from '../../hooks/useSocketMessage'

interface ChatHomeProps {
  matchId?: string
}

// 채팅 아이템 인터페이스 정의
interface ChatItemType {
  id: string
  profileImage: string
  userName: string
  lastTime: string
  category: string
  userType: '리스너' | '스피커' | '완료'
  subject: string
  message: string
  isRead: boolean
  unreadCount: number
  isCompleted: boolean
  matchingId: number
  oppositeId: number
  chatRoomStatus: string
}

const ChatHome = ({ matchId }: ChatHomeProps) => {
  // 사용자 인증 정보 가져오기
  const { user } = useAuthStore()
  // 사용자 정보 로드
  const { isLoading: isUserLoading, error: userError } = useUserQuery()

  // 소켓 연결 (채팅방 별 읽지 않은 메시지 수 업데이트 목적)
  const { isConnected } = useSocketMessage()

  // 채팅방별 읽지 않은 메시지 수 가져오기
  const { roomUnreadCounts } = useMessageStore()

  // 채팅방 목록 상태
  const [chatItems, setChatItems] = useState<ChatItemType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const loadAttemptRef = useRef(0) // 로드 시도 횟수 추적

  // 필터 상태 관리 (전체, 리스너, 스피커, 완료)
  const [activeFilter, setActiveFilter] = useState<string>('전체')
  const [activeFilterButtons, setActiveFilterButtons] = useState({
    전체: true,
    리스너: false,
    스피커: false,
    완료: false,
  })

  // 필터링된 채팅 아이템 계산 (웹소켓으로부터 업데이트된 읽지 않은 메시지 수 적용)
  const filteredChatItems = chatItems
    .map((item) => {
      // 웹소켓으로부터 업데이트된 읽지 않은 메시지 수 적용
      const socketUnreadCount = roomUnreadCounts[item.id]
      return {
        ...item,
        // 새로운 읽지 않은 메시지 수가 있으면 적용, 없으면 기존 값 유지
        unreadCount:
          socketUnreadCount !== undefined
            ? socketUnreadCount
            : item.unreadCount,
        isRead:
          socketUnreadCount !== undefined
            ? socketUnreadCount === 0
            : item.isRead,
      }
    })
    .filter((item) => {
      if (activeFilter === '전체') return item.userType !== '완료'
      if (activeFilter === '리스너') return item.userType === '리스너'
      if (activeFilter === '스피커') return item.userType === '스피커'
      if (activeFilter === '완료') return item.userType === '완료'
      return true
    })

  // 필터 버튼 클릭 핸들러
  const handleFilterChange = (filter: string, isActive: boolean) => {
    if (isActive) {
      setActiveFilter(filter)

      // 버튼 상태 업데이트
      const updatedButtons = {
        전체: false,
        리스너: false,
        스피커: false,
        완료: false,
      }
      updatedButtons[filter as keyof typeof updatedButtons] = true
      setActiveFilterButtons(updatedButtons)
    }
  }

  const navigate = useNavigate()

  const handleChatItemClick = (
    itemId: string,
    profileImage: string,
    userName: string,
    matchingId: number,
    oppositeId: number
  ) => {
    navigate(`/chat/${itemId}`, {
      state: { profileImage, userName, matchingId, oppositeId },
    })
  }

  // 채팅방 목록 로드 함수 (실패 시 재시도 로직 포함)
  const fetchChatRooms = async (token: string) => {
    loadAttemptRef.current += 1
    setIsLoading(true)
    setLoadError(null)

    try {
      // 429 에러 방지를 위한 지수 백오프 전략
      const backoffDelay = Math.min(
        1000 * Math.pow(1.5, loadAttemptRef.current - 1),
        10000
      )
      if (loadAttemptRef.current > 1) {
        console.log(
          `채팅방 목록 로드 ${loadAttemptRef.current}번째 시도, ${backoffDelay}ms 대기 후 재시도...`
        )
        await new Promise((resolve) => setTimeout(resolve, backoffDelay))
      }

      const res = await fetchWithRefresh(
        'https://mindmate.shop/api/chat/rooms',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        }
      )

      if (!res.ok) {
        if (res.status === 429) {
          const retryAfter = res.headers.get('Retry-After') || '5'
          console.log(`요청 제한 (429): ${retryAfter}초 후 재시도`)
          throw new Error(
            `요청 제한에 도달했습니다. ${retryAfter}초 후 재시도합니다.`
          )
        }
        throw new Error(`채팅방 목록을 불러오지 못했습니다. (${res.status})`)
      }

      const data = await res.json()
      if (Array.isArray(data.content)) {
        // 서버 응답을 ChatItemType[]로 변환
        const mapped = data.content.map((item: any) => ({
          id: String(item.roomId),
          profileImage: item.oppositeImage ?? '',
          userName: item.oppositeName ?? '본인',
          oppositeId: item.oppositeId,
          lastTime: item.lastMessageTime
            ? new Date(
                new Date(item.lastMessageTime).getTime() + 9 * 60 * 60 * 1000
              ).toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
              })
            : '',
          category: '', // 필요시 matchingTitle 등에서 추출
          userType:
            item.chatRoomStatus === 'CLOSED'
              ? '완료'
              : item.userRole === 'SPEAKER'
                ? '스피커'
                : '리스너',
          subject: item.matchingTitle ?? '',
          message: item.lastMessage ?? '',
          isRead: (item.unreadCount ?? 0) === 0,
          unreadCount: item.unreadCount ?? 0,
          isCompleted: item.chatRoomStatus === 'CLOSED',
          matchingId: item.matchingId ?? 0,
          chatRoomStatus: item.chatRoomStatus ?? '',
        }))
        setChatItems(mapped)
        // 성공적으로 로드되면 시도 횟수 리셋
        loadAttemptRef.current = 0
      } else {
        setChatItems([])
      }
    } catch (e) {
      const error = e as Error
      console.error('채팅방 목록 불러오기 실패:', error)
      setLoadError(error.message)

      // 최대 3번까지 재시도
      if (loadAttemptRef.current < 3) {
        console.log(`채팅방 목록 로드 실패, ${loadAttemptRef.current}/3회 시도`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // 토큰 확인
    const cookieToken = getTokenCookie('accessToken')
    const tokenToUse = user?.accessToken || cookieToken

    if (!tokenToUse) {
      return
    }

    // 사용자 정보 로딩 중이면 API 호출 안함
    if (isUserLoading) {
      return
    }

    // 초기 로드
    fetchChatRooms(tokenToUse)

    // 주기적으로 채팅방 목록 갱신 (웹소켓 장애 대비, 1분마다)
    const intervalId = setInterval(() => {
      // 웹소켓이 연결되어 있으면 굳이 API 호출 안함
      if (!isConnected) {
        console.log('웹소켓 연결 안됨, REST API로 채팅방 목록 갱신')
        fetchChatRooms(tokenToUse)
      }
    }, 60000)

    return () => {
      clearInterval(intervalId)
    }
  }, [user?.id, isUserLoading, isConnected])

  // 로드 실패 시 재시도 버튼 핸들러
  const handleRetry = () => {
    const cookieToken = getTokenCookie('accessToken')
    const tokenToUse = user?.accessToken || cookieToken
    if (tokenToUse) {
      fetchChatRooms(tokenToUse)
    }
  }

  const [imageLoadedMap, setImageLoadedMap] = useState<{
    [id: string]: boolean
  }>({})

  const handleImageLoad = (id: string) => {
    setImageLoadedMap((prev) => ({ ...prev, [id]: true }))
  }

  useEffect(() => {
    setImageLoadedMap({})
  }, [chatItems])

  return (
    <RootContainer>
      <TopBar
        leftContent={<LogoText>채팅</LogoText>}
        showBorder={false}
        isFixed={true}
      />

      <CategoryFilterContainer>
        <FilterButton
          buttonText="전체"
          onActiveChange={(isActive) => handleFilterChange('전체', isActive)}
          isActive={activeFilterButtons.전체}
        />

        <FilterButton
          buttonText="리스너"
          onActiveChange={(isActive) => handleFilterChange('리스너', isActive)}
          isActive={activeFilterButtons.리스너}
        />

        <FilterButton
          buttonText="스피커"
          onActiveChange={(isActive) => handleFilterChange('스피커', isActive)}
          isActive={activeFilterButtons.스피커}
        />

        <FilterButton
          buttonText="완료"
          onActiveChange={(isActive) => handleFilterChange('완료', isActive)}
          isActive={activeFilterButtons.완료}
        />
      </CategoryFilterContainer>

      <ChatContainer>
        {isLoading ? (
          <div
            style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#888',
            }}
          >
            채팅방 목록을 불러오는 중...
          </div>
        ) : loadError ? (
          <div
            style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#e74c3c',
            }}
          >
            <div>{loadError}</div>
            <button
              onClick={handleRetry}
              style={{
                marginTop: '16px',
                padding: '8px 16px',
                backgroundColor: '#392111',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              다시 시도
            </button>
          </div>
        ) : filteredChatItems.length > 0 ? (
          filteredChatItems.map((item, index) => {
            const realImageUrl = 'https://mindmate.shop/api' + item.profileImage
            const defaultProfileImageUrl = '/default-profile-image.png'
            const uniqueKey = `${item.id}-${item.profileImage}`
            return (
              <div key={uniqueKey} style={{ position: 'relative' }}>
                {!imageLoadedMap[item.id] && (
                  <img
                    src={realImageUrl}
                    alt=""
                    style={{ display: 'none' }}
                    onLoad={() => handleImageLoad(item.id)}
                    onError={() => handleImageLoad(item.id)}
                  />
                )}
                <ChatItem
                  profileImage={
                    imageLoadedMap[item.id]
                      ? realImageUrl
                      : defaultProfileImageUrl
                  }
                  userName={item.userName}
                  lastTime={item.lastTime}
                  category={item.category}
                  userType={item.userType}
                  subject={item.subject}
                  message={item.message}
                  isRead={item.isRead}
                  unreadCount={item.unreadCount}
                  borderBottom={index < filteredChatItems.length - 1}
                  onClick={() => {
                    handleChatItemClick(
                      item.id,
                      realImageUrl,
                      item.userName,
                      item.matchingId,
                      item.oppositeId
                    )
                  }}
                />
              </div>
            )
          })
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#888',
            }}
          >
            채팅방이 없습니다.
          </div>
        )}
      </ChatContainer>
      <NavigationComponent />
    </RootContainer>
  )
}

export default ChatHome
