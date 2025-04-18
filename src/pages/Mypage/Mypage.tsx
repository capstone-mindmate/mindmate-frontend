import { SettingIcon } from '../../components/icon/iconComponents'
import InfoBox from '../../components/mypage/InfoBox'
import MatchingGraph from '../../components/mypage/MatchingGraph'
import ProfileEdit from '../../components/mypage/ProfileEdit'
import NavigationComponent from '../../components/navigation/navigationComponent'
import DetailReview from '../../components/review/DetailReview'
import TagReview from '../../components/review/TagReview'
import TopBar from '../../components/topbar/Topbar'
import {
  ContentContainer,
  MypageContainer,
  LogoText,
  ComponentContainer,
  InfoBoxContainer,
  MatchingGraphContainer,
} from './MypageStyles'

const MyPage = () => {
  // TODO: API 또는 상태 관리 라이브러리에서 사용자 정보를 가져오는 로직 추가
  // const { userProfile, userStats, userReviews } = useUserData() 같은 형태로 구현

  // TODO: 현재 로그인한 사용자의 ID와 보고 있는 프로필의 사용자 ID를 비교하는 로직
  // 실제 구현 시에는 아래와 같은 형태가 될 수 있음
  // const { currentUserId } = useAuth() // 현재 로그인한 사용자 ID
  // const { id: profileUserId } = useParams() // URL에서 가져온 프로필 사용자 ID
  // const isOwnProfile = currentUserId === profileUserId

  // 임시로 하드코딩된 값 (실제 구현 시 위 로직으로 대체)
  const isOwnProfile = false // TODO: 실제 인증 상태에 따라 변경되어야 함

  // TODO: 프로필 편집 버튼 클릭 핸들러
  const handleProfileEdit = () => {
    console.log('프로필 편집 버튼이 클릭되었습니다')
    // TODO: 프로필 편집 페이지로 이동하는 로직 추가
  }

  // TODO: 설정 버튼 클릭 핸들러
  const handleSettingClick = () => {
    console.log('설정 버튼이 클릭되었습니다')
    // TODO: 설정 페이지로 이동 또는 설정 모달 표시 로직 추가
  }

  // TODO: 리뷰 전체보기 클릭 핸들러
  const handleViewAllReviewsClick = () => {
    console.log('전체보기 클릭됨')
    // TODO: 리뷰 전체보기 페이지로 이동하는 로직 추가
  }

  // TODO: API에서 가져온 데이터로 대체해야 함
  // TagReview 테스트 데이터
  const reviewTags = [
    { icon: '⚡', text: '응답이 빨라요', count: 12 },
    { icon: '🤝', text: '신뢰할 수 있는 대화였어요', count: 9 },
    { icon: '❤️', text: '공감을 잘해줘요', count: 8 },
    { icon: '☕', text: '편안한 분위기에서 이야기할 수 있었어요', count: 6 },
    { icon: '🎯', text: '솔직하고 현실적인 조언을 해줘요', count: 3 },
    { icon: '💡', text: '새로운 관점을 제시해줘요', count: 1 },
  ]

  // TODO: API에서 가져온 데이터로 대체해야 함
  const userProfile = {
    profileImage: '/public/image.png',
    username: '행복한 돌멩이',
  }

  // TODO: API에서 가져온 데이터로 대체해야 함
  const userStats = {
    averageScore: 4.6,
    coins: 500,
    matchCount: 3,
  }

  // TODO: API에서 가져온 데이터로 대체해야 함
  const categoryData = {
    진로: 3,
    취업: 7,
    학업: 1,
    인간관계: 6,
    경제: 4,
    기타: 1,
  }

  // TODO: API에서 가져온 데이터로 대체해야 함
  const userReviews = [
    {
      profileImage: '/public/image.png',
      username: '건들면 짖는댕',
      rating: 4.0,
      date: '25.03.28',
      content: '응답이 엄청 빨랐어요! 대화 재밌었어요 ㅎ ㅎ',
    },
    {
      profileImage: '/public/image copy.png',
      username: '말하고 싶어라',
      rating: 3.5,
      date: '25.03.28',
      content: '공감 천재세요',
    },
  ]

  return (
    <MypageContainer>
      <ContentContainer>
        <TopBar
          leftContent={<LogoText>마이페이지</LogoText>}
          rightContent={
            isOwnProfile && ( // 본인 프로필일 경우에만 설정 버튼 표시
              <button onClick={handleSettingClick}>
                <SettingIcon color="#392111" />
              </button>
            )
          }
          showBorder={false}
          isFixed={true}
        />
        <ComponentContainer>
          <ProfileEdit
            profileImage={userProfile.profileImage}
            username={userProfile.username}
            onEditClick={handleProfileEdit}
            isOwnProfile={isOwnProfile} // 본인 프로필 여부 전달
          />
          <InfoBoxContainer>
            <InfoBox
              averageScore={userStats.averageScore}
              coins={userStats.coins}
              matchCount={userStats.matchCount}
            />
          </InfoBoxContainer>
          <MatchingGraphContainer>
            <MatchingGraph categoryData={categoryData} />
          </MatchingGraphContainer>
          <TagReview tags={reviewTags} />
          <DetailReview
            reviews={userReviews}
            onViewAllClick={handleViewAllReviewsClick}
          />
        </ComponentContainer>
      </ContentContainer>
      <NavigationComponent />
    </MypageContainer>
  )
}

export default MyPage
