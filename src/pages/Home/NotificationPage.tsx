import React, { useEffect, useState } from 'react'
import TopBar from '../../components/topbar/Topbar'
import NotificationItem from './NotificationItem'
import { NotificationContainer, ContentContainer } from './NotificationStyles'
import { BackIcon } from '../../components/icon/iconComponents'
import { useNavigate } from 'react-router-dom'
import { fetchWithRefresh } from '../../utils/fetchWithRefresh'

interface Notification {
  id: number
  type: 'match' | 'comment'
  title: string
  createdAt: string
  readNotification: boolean
  content: string
}

const NotificationPage = () => {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await fetchWithRefresh('http://localhost/api/notifications', {
        method: 'GET',
      })
      const data = await res.json()
      setNotifications(data.content)
    }

    fetchNotifications()
  }, [])

  const handleBackClick = () => {
    navigate(-1)
  }

  const handleNotificationClick = async (id: number) => {
    try {
      const res = await fetchWithRefresh(
        `http://localhost/api/notifications/${id}`,
        {
          method: 'PUT',
        }
      )

      if (res.ok) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification.id === id
              ? { ...notification, readNotification: true }
              : notification
          )
        )
      }
    } catch (error) {
      console.error('알림 상태 업데이트 실패:', error)
    }
  }

  const handleAllReadClick = async () => {
    try {
      const res = await fetchWithRefresh(
        `http://localhost/api/notifications/all`,
        {
          method: 'PUT',
        }
      )

      if (res.ok) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) => ({
            ...notification,
            readNotification: true,
          }))
        )
      }
    } catch (error) {
      console.error('전체 알림 상태 업데이트 실패:', error)
    }
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
          rightContent={
            <button onClick={handleAllReadClick} style={{ color: '#392111' }}>
              전체 읽음
            </button>
          }
        />
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            id={notification.id}
            type={notification.type}
            title={notification.title}
            description={notification.content}
            time={notification.createdAt}
            isRead={notification.readNotification}
            onClick={() => handleNotificationClick(notification.id)}
          />
        ))}
      </ContentContainer>
    </NotificationContainer>
  )
}

export default NotificationPage
