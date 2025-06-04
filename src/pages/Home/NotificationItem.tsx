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
  id: number
  type: 'match' | 'comment'
  title: string
  time: string
  isRead: boolean
  description: string
  onClick: () => void
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  id,
  type,
  title,
  time,
  isRead,
  description,
  onClick,
}) => {
  const iconColor = isRead ? '#D9D9D9' : '#392111'

  const formatDateTime = (input: string) => {
    const date = new Date(input)

    const yy = String(date.getFullYear()).slice(2) // '25'
    const mm = String(date.getMonth() + 1).padStart(2, '0') // '06'
    const dd = String(date.getDate()).padStart(2, '0') // '03'
    const hh = String(date.getHours()).padStart(2, '0') // '02'
    const min = String(date.getMinutes()).padStart(2, '0') // '27'

    return `${yy}-${mm}-${dd} ${hh}:${min}`
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
        <NotificationContent onClick={onClick}>
          <NotificationTitle>{title}</NotificationTitle>
          <NotificationDescription>{description}</NotificationDescription>
          <NotificationTime>{formatDateTime(time)}</NotificationTime>
        </NotificationContent>
      </ItemInnerContainer>
    </NotificationItemContainer>
  )
}

export default NotificationItem
