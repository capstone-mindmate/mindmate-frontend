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
  profileImage = '/public/image.png',
  username = '행복한 돌멩이',
  onEditClick = () => console.log('프로필 편집 버튼 클릭됨'),
  isOwnProfile = false, // 기본값은 false로 설정
}) => {
  return (
    <ProfileContainer>
      <ProfileImage src={profileImage} alt="프로필 이미지" />
      <UserNameText>{username}</UserNameText>
      {/* 본인 프로필일 경우에만 편집 버튼 표시 */}
      {isOwnProfile && (
        <ProfileEditButton onClick={onEditClick}>프로필 편집</ProfileEditButton>
      )}
    </ProfileContainer>
  )
}

export default ProfileEdit
