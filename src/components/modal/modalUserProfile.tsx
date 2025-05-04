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
  `,

  profileImageStyle: css`
    width: 100%;
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
}: ModalUserProfileProps) => {
  return (
    <div className="container" css={profileStyles.container}>
      <div className="profile-image" css={profileStyles.profileImageWrapper}>
        <img src={profileImage} css={profileStyles.profileImageStyle} />
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
}: ModalUserProfileProps) => {
  return (
    <div className="container" css={profileStyles.containerFailure}>
      <div className="leftBox" css={profileStyles.modalFailureLeftBox}>
        <div className="profile-image" css={profileStyles.profileImageWrapper}>
          <img src={profileImage} css={profileStyles.profileImageStyle} />
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
        />
      </div>
    </div>
  )
}
