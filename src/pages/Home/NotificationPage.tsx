import React from 'react'
import TopBar from '../../components/topbar/Topbar'
import NotificationItem from './NotificationItem'
import { NotificationContainer, ContentContainer } from './NotificationStyles'
import { BackIcon } from '../../components/icon/iconComponents'
import { useNavigate } from 'react-router-dom'

// 테스트용 더미 데이터
const dummyNotifications = [
  {
    id: 1,
    type: 'match' as const,
    title: '건드리면 짖는댕',
    time: '4시간 전',
    isRead: false,
  },
  {
    id: 2,
    type: 'comment' as const,
    title: '붕어빵 먹는법',
    time: '03월 24일 11:33',
    isRead: true,
  },
  {
    id: 3,
    type: 'match' as const,
    title: '누렁이',
    time: '03월 23일 17:33',
    isRead: true,
  },
  {
    id: 4,
    type: 'match' as const,
    title: '건드리면 짖는댕',
    time: '3월 20일 12:00',
    isRead: true,
  },
]

const NotificationPage = () => {
  const navigate = useNavigate()

  const handleBackClick = () => {
    navigate(-1)
  }

  return (
    <NotificationContainer>
      <ContentContainer>
        <TopBar
          showBackButton={true}
          isFixed={true}
          title={'알림'}
          leftContent={
            <button onClick={handleBackClick}>
              <BackIcon color="#392111" />
            </button>
          }
        />
        {dummyNotifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            type={notification.type}
            title={notification.title}
            time={notification.time}
            isRead={notification.isRead}
          />
        ))}
      </ContentContainer>
    </NotificationContainer>
  )
}

export default NotificationPage
