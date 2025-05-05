/** @jsxImportSource @emotion/react */
import { useState, useEffect, useRef } from 'react'

import { RootContainer, ChatContainer, LogoText } from './styles/RootStyles'
import { CategoryFilterContainer } from './styles/ChatHomeStyles'

import TopBar from '../../components/topbar/Topbar'
import NavigationComponent from '../../components/navigation/navigationComponent'
import FilterButton from '../../components/buttons/filterButton'
import ChatItem from '../../components/chat/pageComponent/ChatItem'

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
  // 채팅 목록 더미 데이터
  const chatItems: ChatItemType[] = [
    {
      id: '1',
      profileImage:
        'https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg?wp=1&w=357&h=357',
      userName: '홍길동',
      lastTime: '19:52',
      category: '진로',
      userType: '리스너',
      subject: '진로 고민 들어주세요',
      message: '진짜 괜찮겠죠?,,ㅠ',
      isRead: false,
      unreadCount: 10,
      isCompleted: false,
    },
    {
      id: '2',
      profileImage:
        'https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg?wp=1&w=357&h=357',
      userName: '석지원',
      lastTime: '19:20',
      category: '진로',
      userType: '리스너',
      subject: '살려주세요..',
      message: '마감이 얼마 안남았어요..ㅠㅠ',
      isRead: true,
      unreadCount: 0,
      isCompleted: false,
    },
    {
      id: '3',
      profileImage:
        'https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg?wp=1&w=357&h=357',
      userName: '김스피커',
      lastTime: '18:45',
      category: '인간관계',
      userType: '스피커',
      subject: '선배와의 관계',
      message: '선배가 요새 연락을 안받아요',
      isRead: true,
      unreadCount: 2,
      isCompleted: false,
    },
    {
      id: '4',
      profileImage:
        'https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg?wp=1&w=357&h=357',
      userName: '이완료',
      lastTime: '어제',
      category: '취업',
      userType: '스피커',
      subject: '취업 준비',
      message: '감사합니다! 도움이 많이 됐어요.',
      isRead: true,
      unreadCount: 0,
      isCompleted: true,
    },
  ]

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
