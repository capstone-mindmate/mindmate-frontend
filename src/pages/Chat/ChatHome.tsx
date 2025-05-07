/** @jsxImportSource @emotion/react */
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import { RootContainer, ChatContainer, LogoText } from './styles/RootStyles'
import { CategoryFilterContainer } from './styles/ChatHomeStyles'

import TopBar from '../../components/topbar/Topbar'
import NavigationComponent from '../../components/navigation/navigationComponent'
import FilterButton from '../../components/buttons/filterButton'
import ChatItem from '../../components/chat/pageComponent/ChatItem'
import { fetchWithRefresh } from '../../utils/fetchWithRefresh'

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
  userType: '리스너' | '스피커'
  subject: string
  message: string
  isRead: boolean
  unreadCount: number
  isCompleted: boolean
}

const ChatHome = ({ matchId }: ChatHomeProps) => {
  // 채팅방 목록 상태
  const [chatItems, setChatItems] = useState<ChatItemType[]>([])

  // 필터 상태 관리 (전체, 리스너, 스피커, 완료)
  const [activeFilter, setActiveFilter] = useState<string>('전체')
  const [activeFilterButtons, setActiveFilterButtons] = useState({
    전체: true,
    리스너: false,
    스피커: false,
    완료: false,
  })

  // 필터링된 채팅 아이템 계산
  const filteredChatItems = chatItems.filter((item) => {
    if (activeFilter === '전체') return true
    if (activeFilter === '리스너') return item.userType === '리스너'
    if (activeFilter === '스피커') return item.userType === '스피커'
    if (activeFilter === '완료') return item.isCompleted
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

  const handleChatItemClick = (itemId: string) => {
    navigate(`/chat/${itemId}`)
  }

  useEffect(() => {
    // 채팅방 목록 API 호출
    const fetchChatRooms = async () => {
      try {
        const res = await fetchWithRefresh('http://localhost/api/chat/rooms', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        if (!res.ok) throw new Error('채팅방 목록을 불러오지 못했습니다.')
        const data = await res.json()
        if (Array.isArray(data.content)) {
          // 서버 응답을 ChatItemType[]로 변환
          const mapped = data.content.map((item: any) => ({
            id: String(item.roomId),
            profileImage: item.oppositeImage ?? '',
            userName: item.oppositeName ?? '본인',
            lastTime: item.lastMessageTime
              ? new Date(item.lastMessageTime).toLocaleTimeString('ko-KR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '',
            category: '', // 필요시 matchingTitle 등에서 추출
            userType: item.userRole === 'SPEAKER' ? '스피커' : '리스너',
            subject: item.matchingTitle ?? '',
            message: item.lastMessage ?? '',
            isRead: (item.unreadCount ?? 0) === 0,
            unreadCount: item.unreadCount ?? 0,
            isCompleted: item.chatRoomStatus === 'CLOSED',
          }))
          setChatItems(mapped)
        } else {
          setChatItems([])
        }
      } catch (e) {
        setChatItems([])
      }
    }
    fetchChatRooms()
  }, [])

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
        {filteredChatItems.length > 0 ? (
          filteredChatItems.map((item, index) => (
            <ChatItem
              key={item.id}
              profileImage={item.profileImage}
              userName={item.userName}
              lastTime={item.lastTime}
              category={item.category}
              userType={item.userType}
              subject={item.subject}
              message={item.message}
              isRead={item.isRead}
              unreadCount={item.unreadCount}
              borderBottom={index < filteredChatItems.length - 1}
              onClick={() => handleChatItemClick(item.id)}
            />
          ))
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#888',
            }}
          >
            해당하는 채팅방이 없습니다.
          </div>
        )}
      </ChatContainer>
      <NavigationComponent />
    </RootContainer>
  )
}

export default ChatHome
