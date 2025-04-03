import React from 'react'
import {
  BubbleContainer,
  BubbleWrapper,
  ProfileImage,
  ProfileContainer,
  TimeInfo,
  ReadStatus,
  MessageContainer,
} from '../../styles/BubbleStyles'

interface BubbleProps {
  children: React.ReactNode
  isMe?: boolean
  profileImage?: string
  timestamp?: string
  showTime?: boolean
  isLastMessage?: boolean
  isRead?: boolean
  isContinuous?: boolean
}

const Bubble: React.FC<BubbleProps> = ({
  children,
  isMe = true,
  profileImage = '',
  timestamp = '',
  showTime = false,
  isLastMessage = false,
  isRead = false,
  isContinuous = false,
}) => {
  return (
    <BubbleWrapper isMe={isMe} isContinuous={isContinuous}>
      {!isMe &&
        (profileImage && !isContinuous ? (
          <ProfileImage src={profileImage} alt="프로필" />
        ) : (
          <ProfileContainer />
        ))}
      <MessageContainer isMe={isMe}>
        <BubbleContainer isMe={isMe}>{children}</BubbleContainer>
        {showTime && !isLastMessage && <TimeInfo>{timestamp}</TimeInfo>}
        {isMe && isLastMessage && (
          <ReadStatus>{isRead ? '읽음' : '읽지 않음'}</ReadStatus>
        )}
      </MessageContainer>
    </BubbleWrapper>
  )
}

export default Bubble
