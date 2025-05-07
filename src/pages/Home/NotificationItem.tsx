// src/components/notification/NotificationItem.tsx
import React from 'react'
import { ChatBoxIcon, MessageIcon } from '../../components/icon/iconComponents'
import {
  NotificationItemContainer,
  ItemInnerContainer,
  IconContainer,
  NotificationContent,
  NotificationTitle,
  NotificationDescription,
  NotificationTime,
} from './NotificationStyles.tsx'

interface NotificationItemProps {
  type: 'match' | 'comment'
  title: string
  time: string
  isRead: boolean
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  type,
  title,
  time,
  isRead,
}) => {
  const iconColor = isRead ? '#D9D9D9' : '#392111'

  let description = ''
  if (type === 'match') {
    description = `${title} 님의 매칭이 도착했습니다.`
  } else {
    description = `${title} 매거진에 댓글이 달렸습니다.`
  }

  return (
    <NotificationItemContainer isRead={isRead}>
      <ItemInnerContainer>
        <IconContainer isRead={isRead}>
          {type === 'match' ? (
            <MessageIcon
              width={32}
              height={32}
              color={iconColor}
              strokeWidth={1.5}
            />
          ) : (
            <ChatBoxIcon
              width={30}
              height={30}
              color={iconColor}
              strokeWidth={1.5}
            />
          )}
        </IconContainer>
        <NotificationContent>
          <NotificationTitle>
            {type === 'match' ? '매칭 도착!' : '댓글 알림'}
          </NotificationTitle>
          <NotificationDescription>{description}</NotificationDescription>
          <NotificationTime>{time}</NotificationTime>
        </NotificationContent>
      </ItemInnerContainer>
    </NotificationItemContainer>
  )
}

export default NotificationItem
