import React from 'react'
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
}

const ProfileEdit: React.FC<ProfileEditProps> = ({
  profileImage = '/public/image.png',
  username = '행복한 돌멩이',
  onEditClick = () => console.log('프로필 편집 버튼 클릭됨'),
}) => {
  return (
    <ProfileContainer>
      <ProfileImage src={profileImage} alt="프로필 이미지" />
      <UserNameText>{username}</UserNameText>
      <ProfileEditButton onClick={onEditClick}>프로필 편집</ProfileEditButton>
    </ProfileContainer>
  )
}

export default ProfileEdit
