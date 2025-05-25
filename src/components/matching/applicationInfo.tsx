/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useState } from 'react'

import YellowInputBox from '../inputs/yellowInputBox'
import BrownRectButton from '../buttons/brownRectButton'

interface ApplicationInfoProps {
  profileImage: string
  name: string
  department: string
  makeDate: string
  onClick: () => void
  message: string
  borderSet: boolean
  onProfileClick?: () => void // 프로필 클릭 핸들러 추가
}

const applicationInfoStyle = {
  container: (borderSet: boolean) => css`
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 28px 24px;
    transition: background-color 0.2s ease;
    border-bottom: ${borderSet ? '1px solid #E6E6E6' : 'none'};
  `,

  userProfile: css`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  `,

  leftSide: css`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
  `,

  rightSide: css`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
  `,

  profileImageWrapper: css`
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: #f5f5f5;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    cursor: pointer; /* 클릭 가능 표시 */
    transition: transform 0.2s ease; /* 호버 효과 */

    &:hover {
      transform: scale(1.05);
    }
  `,

  profileImageStyle: css`
    width: 100%;
    height: 100%;
    object-fit: cover;
  `,

  infoWrapper: css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  `,

  userInfo: css`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 4px;
  `,

  userName: css`
    font-size: 16px;
    line-height: 1.5;
    color: #000000;
    font-weight: bold;
    margin: 0;
  `,

  userDepartment: css`
    font-size: 14px;
    line-height: 1.4;
    color: #727272;
    margin: 0;
  `,

  dateInfoWrapper: css`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 4px;
  `,

  dateInfo: css`
    font-size: 12px;
    line-height: 1.3;
    color: #a3a3a3;
    margin: 0;
  `,

  messageBox: css`
    width: 100%;
  `,

  matchingButton: css`
    background-color: #392111;
    color: #fff;
    border-radius: 4px;
    border: none;
    font-size: 12px;
    line-height: 1.3;
    font-weight: bold;
    padding: 8px;
    cursor: pointer;
  `,
}

const applicationInfo = ({
  profileImage,
  name,
  department,
  makeDate,
  onClick,
  message,
  borderSet,
  onProfileClick, // 프로필 클릭 핸들러 받기
}: ApplicationInfoProps) => {
  // 프로필 이미지 클릭 핸들러
  const handleProfileImageClick = (e: React.MouseEvent) => {
    e.stopPropagation() // 부모 요소의 클릭 이벤트 방지
    if (onProfileClick) {
      onProfileClick()
    }
  }

  return (
    <div className="container" css={applicationInfoStyle.container(borderSet)}>
      <div className="user-profile" css={applicationInfoStyle.userProfile}>
        <div className="left-side" css={applicationInfoStyle.leftSide}>
          <div
            className="profile-image"
            css={applicationInfoStyle.profileImageWrapper}
            onClick={handleProfileImageClick} // 프로필 이미지 클릭 이벤트 추가
            title={`${name}의 프로필 보기`} // 툴팁 추가
          >
            <img
              src={profileImage}
              css={applicationInfoStyle.profileImageStyle}
              alt={`${name}의 프로필 이미지`}
            />
          </div>

          <div className="info-wrapper" css={applicationInfoStyle.infoWrapper}>
            <div className="user-info" css={applicationInfoStyle.userInfo}>
              <p css={applicationInfoStyle.userName}>{name}</p>
              <p css={applicationInfoStyle.userDepartment}>{department}</p>
            </div>
            <div
              className="date-info"
              css={applicationInfoStyle.dateInfoWrapper}
            >
              <p css={applicationInfoStyle.dateInfo}>{makeDate}</p>
            </div>
          </div>
        </div>

        <div className="right-side" css={applicationInfoStyle.rightSide}>
          <button css={applicationInfoStyle.matchingButton} onClick={onClick}>
            매칭하기
          </button>
        </div>
      </div>

      <div className="message-box" css={applicationInfoStyle.messageBox}>
        <YellowInputBox
          placeholder=""
          value={message}
          onChange={() => {}}
          activeState={false}
          isTitle={false}
        />
      </div>
    </div>
  )
}

export default applicationInfo
