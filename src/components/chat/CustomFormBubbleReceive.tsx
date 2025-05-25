/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

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
  isMe?: boolean
  profileImage?: string
  timestamp?: string
  showTime?: boolean
  isLastMessage?: boolean
  isRead?: boolean
  isContinuous?: boolean
  isCustomFormMake?: boolean
  onClick?: () => void
}

const CustomFormBubbleSendStyles = {
  container: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
  `,
  head: css`
    font-size: 14px;
    font-weight: bold;
    line-height: 1.4;
    color: #393939;
    margin: 0;
  `,
  imgBox: css`
    width: 95px;
  `,
  buttonBox: css`
    width: 100%;
  `,
  button: css`
    width: 160px;
    height: 32px;
    border-radius: 4px;
    background-color: #ffffff;
    border: 1px solid #d9d9d9;
    color: #393939;
    font-size: 12px;
    font-weight: regular;
    line-height: 1.3;
    cursor: pointer;
  `,
  img: css`
    width: 100%;
    object-fit: cover;
  `,
}

const Bubble = ({
  isMe = true,
  profileImage = '',
  timestamp = '',
  showTime = false,
  isLastMessage = false,
  isRead = false,
  isContinuous = false,
  isCustomFormMake = false,
  onClick,
}: BubbleProps) => {
  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation() // 이벤트 버블링 방지
    if (onClick) onClick()
  }

  return (
    <BubbleWrapper
      isMe={isMe}
      isContinuous={isContinuous}
      isCustomFormMake={true}
    >
      {!isMe &&
        (profileImage && !isContinuous ? (
          <ProfileImage src={profileImage} alt="프로필" />
        ) : (
          <ProfileContainer />
        ))}
      <MessageContainer isMe={isMe}>
        <BubbleContainer isMe={isMe} isCustomFormMake={true}>
          <div
            className="custom-form-bubble-send"
            css={CustomFormBubbleSendStyles.container}
          >
            <p className="head" css={CustomFormBubbleSendStyles.head}>
              답변이 도착했어요!
            </p>
            <div
              className="button-box"
              css={CustomFormBubbleSendStyles.buttonBox}
            >
              <button
                onClick={handleButtonClick}
                css={CustomFormBubbleSendStyles.button}
              >
                확인하기
              </button>
            </div>
          </div>
        </BubbleContainer>
        {showTime && !isLastMessage && <TimeInfo>{timestamp}</TimeInfo>}
        {isMe && isLastMessage && (
          <ReadStatus>{isRead ? '읽음' : '읽지 않음'}</ReadStatus>
        )}
      </MessageContainer>
    </BubbleWrapper>
  )
}

export default Bubble
