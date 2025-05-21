/** @jsxImportSource @emotion/react */
import React from 'react'

import {
  ChatItemContainer,
  ChatTopInfoContainer,
  ChatBottomInfoContainer,
  LeftContainer,
  RightContainer,
  ProfileImage,
  NickName,
  LastTime,
  UnreadCount,
  InfoBox,
  MainInfoBox,
  MessageInfoBox,
  Subject,
  Category,
  UserType,
  Message,
} from './styles/ChatItemStyles'

interface ChatItemProps {
  profileImage: string
  userName: string
  lastTime: string
  category: string
  userType: string
  subject: string
  message: string
  isRead: boolean
  unreadCount: number
  borderBottom: boolean
  onClick: () => void
}

const ChatItem = ({
  profileImage,
  userName,
  lastTime,
  category,
  userType,
  subject,
  message,
  isRead,
  unreadCount,
  borderBottom,
  onClick,
}: ChatItemProps) => {
  return (
    <ChatItemContainer borderBottom={borderBottom} onClick={onClick}>
      <ChatTopInfoContainer>
        <LeftContainer>
          <ProfileImage src={profileImage} />
          <NickName>{userName}</NickName>
        </LeftContainer>

        <RightContainer>
          <LastTime>{lastTime}</LastTime>
        </RightContainer>
      </ChatTopInfoContainer>

      <ChatBottomInfoContainer>
        <LeftContainer>
          <InfoBox>
            <MainInfoBox>
              <Subject>{subject}</Subject>
              <UserType userType={userType}>{userType}</UserType>
              <Category>{category}</Category>
            </MainInfoBox>
            <MessageInfoBox>
              <Message>{message}</Message>
            </MessageInfoBox>
          </InfoBox>
        </LeftContainer>

        <RightContainer>
          {isRead ? null : <UnreadCount>{unreadCount}</UnreadCount>}
        </RightContainer>
      </ChatBottomInfoContainer>
    </ChatItemContainer>
  )
}

export default ChatItem
