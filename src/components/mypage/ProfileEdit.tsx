import React, { useState, useEffect } from 'react'
import {
  ProfileContainer,
  ProfileImage,
  UserNameText,
  ProfileEditButton,
} from '../../styles/ProfileEditStyles'

interface ProfileEditProps {
  profileImage?: string
  username?: string
  onEditClick?: () => void
  isOwnProfile?: boolean // 본인 프로필인지 여부를 확인하는 prop 추가
}

const ProfileEdit: React.FC<ProfileEditProps> = ({
  profileImage = '/default-profile-image.png',
  username = '행복한 돌멩이',
  onEditClick = () => console.log('프로필 편집 버튼 클릭됨'),
  isOwnProfile = false, // 기본값은 false로 설정
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  useEffect(() => {
    setIsImageLoaded(false)
  }, [profileImage])

  return (
    <ProfileContainer>
      {/* 이미지가 로드되기 전에는 기본 이미지 보여주기 */}
      {!isImageLoaded && (
        <ProfileImage
          src={
            'httpss://mindmate.shop/api/profileImages/default-profile-image.png'
          }
          alt="기본 프로필 이미지"
          style={{ position: 'absolute' }}
        />
      )}
      <ProfileImage
        src={profileImage}
        alt="프로필 이미지"
        style={{ display: isImageLoaded ? 'block' : 'none' }}
        onLoad={() => setIsImageLoaded(true)}
        onError={() => setIsImageLoaded(true)}
      />
      <UserNameText>{username}</UserNameText>
      {/* 본인 프로필일 경우에만 편집 버튼 표시 */}
      {isOwnProfile && (
        <ProfileEditButton onClick={onEditClick}>프로필 편집</ProfileEditButton>
      )}
    </ProfileContainer>
  )
}

export default ProfileEdit
