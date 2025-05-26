/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { BackIcon } from '../icon/iconComponents'

interface ModalUserProfileProps {
  profileImage: string
  name: string
  department: string
  makeDate?: string
  onBackClick?: () => void
  showDetails?: boolean
  onClick?: () => void
}

const profileStyles = {
  container: css`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
  `,
  containerFailure: css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
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

    &:active {
      transform: scale(0.95);
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

  userDepartmentFailure: css`
    font-size: 12px;
    line-height: 1.3;
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

  modalFailureLeftBox: css`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
  `,

  modalFailureRightBox: css``,

  backIcon: (showDetails: boolean = false) => css`
    transform: rotate(${showDetails ? '90deg' : '-90deg'});
  `,
}

export const ModalMatchingUserProfile = ({
  profileImage = '',
  name,
  department,
  makeDate,
  onClick,
}: ModalUserProfileProps) => {
  // 프로필 이미지 클릭 핸들러
  const handleProfileImageClick = (e: React.MouseEvent) => {
    e.stopPropagation() // 부모 요소의 클릭 이벤트 방지
    if (onClick) {
      onClick()
    }
  }

  // 전체 컨테이너 클릭 핸들러 (기존 onClick 유지)
  const handleContainerClick = () => {
    if (onClick) {
      onClick()
    }
  }

  return (
    <div
      className="container"
      css={profileStyles.container}
      onClick={handleContainerClick}
      style={{ cursor: onClick ? 'pointer' : undefined }}
      data-testid="profile-container"
    >
      <div
        className="profile-image"
        css={profileStyles.profileImageWrapper}
        onClick={handleProfileImageClick}
        title={onClick ? `${name}의 프로필 보기` : undefined}
        style={{
          cursor: onClick ? 'pointer' : 'default',
        }}
      >
        <img
          src={profileImage}
          css={profileStyles.profileImageStyle}
          alt={`${name}의 프로필 이미지`}
        />
      </div>

      <div className="info-wrapper" css={profileStyles.infoWrapper}>
        <div className="user-info" css={profileStyles.userInfo}>
          <p css={profileStyles.userName}>{name}</p>
          <p css={profileStyles.userDepartment}>{department}</p>
        </div>
        <div className="date-info" css={profileStyles.dateInfoWrapper}>
          <p css={profileStyles.dateInfo}>{makeDate}</p>
        </div>
      </div>
    </div>
  )
}

export const ModalMatchingFailureUserProfile = ({
  profileImage = '',
  name,
  department,
  onBackClick,
  showDetails,
  onClick, // 프로필 클릭 핸들러 받기
}: ModalUserProfileProps) => {
  // 프로필 이미지 클릭 핸들러
  const handleProfileImageClick = (e: React.MouseEvent) => {
    e.stopPropagation() // 부모 요소의 클릭 이벤트 방지
    if (onClick) {
      onClick()
    }
  }

  return (
    <div className="container" css={profileStyles.containerFailure}>
      <div className="leftBox" css={profileStyles.modalFailureLeftBox}>
        <div
          className="profile-image"
          css={profileStyles.profileImageWrapper}
          onClick={handleProfileImageClick}
          title={onClick ? `${name}의 프로필 보기` : undefined}
          style={{
            cursor: onClick ? 'pointer' : 'default',
          }}
        >
          <img
            src={profileImage}
            css={profileStyles.profileImageStyle}
            alt={`${name}의 프로필 이미지`}
          />
        </div>

        <div className="info-wrapper" css={profileStyles.infoWrapper}>
          <div className="user-info" css={profileStyles.userInfo}>
            <p css={profileStyles.userName}>{name}</p>
          </div>
          <div className="department-info">
            <p css={profileStyles.userDepartmentFailure}>{department}</p>
          </div>
        </div>
      </div>

      <div className="rightBox" css={profileStyles.modalFailureRightBox}>
        <BackIcon
          css={profileStyles.backIcon(showDetails)}
          onClick={onBackClick}
          data-testid="back-icon"
        />
      </div>
    </div>
  )
}
