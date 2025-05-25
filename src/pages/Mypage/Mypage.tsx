import { SettingIcon, KebabIcon } from '../../components/icon/iconComponents'
import InfoBox from '../../components/mypage/InfoBox'
import MatchingGraph from '../../components/mypage/MatchingGraph'
import ProfileEdit from '../../components/mypage/ProfileEdit'
import NavigationComponent from '../../components/navigation/navigationComponent'
import DetailReview from '../../components/review/DetailReview'
import TagReview from '../../components/review/TagReview'
import TopBar from '../../components/topbar/Topbar'
import BottomSheet from '../../components/bottomSheet/BottomSheet'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ContentContainer,
  MypageContainer,
  LogoText,
  ComponentContainer,
  InfoBoxContainer,
  MatchingGraphContainer,
} from './MypageStyles'
import { useAuthStore } from '../../stores/userStore'
import { useEffect, useState } from 'react'
import { fetchWithRefresh } from '../../utils/fetchWithRefresh'

const categoryMap: Record<string, string> = {
  ACADEMIC: '학업',
  CAREER: '진로',
  RELATIONSHIP: '인간관계',
  MENTAL_HEALTH: '건강',
  CAMPUS_LIFE: '학교생활',
  PERSONAL_GROWTH: '자기계발',
  FINANCIAL: '경제',
  EMPLOYMENT: '취업',
  OTHER: '기타',
}

const categoryEngMap: Record<string, string> = {
  학업: 'ACADEMIC',
  진로: 'CAREER',
  인간관계: 'RELATIONSHIP',
  건강: 'MENTAL_HEALTH',
  학교생활: 'CAMPUS_LIFE',
  자기계발: 'PERSONAL_GROWTH',
  경제: 'FINANCIAL',
  취업: 'EMPLOYMENT',
  기타: 'OTHER',
}

const MyPage = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { userId } = useParams<{ userId?: string }>()
  const [isOwnProfile, setIsOwnProfile] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [userStats, setUserStats] = useState<any>(null)
  const [categoryData, setCategoryData] = useState<any>(null)
  const [reviewTags, setReviewTags] = useState<any[]>([])
  const [userReviews, setUserReviews] = useState<any[]>([])
  const [pointBalance, setPointBalance] = useState<number | null>(null)
  const [isProfileImageLoaded, setIsProfileImageLoaded] = useState(false)
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)

  const realProfileImageUrl = userProfile?.profileImage
    ? `https://mindmate.shop/api${userProfile.profileImage}`
    : ''
  const defaultProfileImageUrl =
    'https://mindmate.shop/api/profileImages/default-profile-image.png'

  useEffect(() => {
    setIsProfileImageLoaded(false)
  }, [realProfileImageUrl])

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      try {
        let profileRes, profileData, reveiwListRes
        if (!userId || (user && String(user.id) === String(userId))) {
          // 내 프로필
          setIsOwnProfile(true)
          if (user?.id) {
            profileRes = await fetchWithRefresh(
              `https://mindmate.shop/api/profiles`,
              {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
              }
            )
          } else {
            throw new Error('로그인 정보가 없습니다.')
          }
          profileData = await profileRes.json()
          setUserProfile({
            profileImage: profileData.profileImage,
            username: profileData.nickname || '닉네임 없음',
            department: profileData.department || '',
            entranceTime: profileData.entranceTime
              ? String(profileData.entranceTime)
              : '',
          })
          setUserStats({
            averageScore: profileData.averageRating,
            coins: profileData.points,
            matchCount: profileData.totalCounselingCount,
            avgResponseTime: profileData.avgResponseTime,
          })
          // categoryData를 한글로 변환
          const convertedCategoryData = Object.entries(
            profileData.categoryCounts || {}
          ).reduce(
            (acc, [key, value]) => ({
              ...acc,
              [categoryMap[key] || key]: value,
            }),
            {}
          )
          setCategoryData(convertedCategoryData)
          // 리뷰 태그(임시: 태그 카운트)
          if (profileData.tagCounts) {
            setReviewTags(
              Object.entries(profileData.tagCounts).map(([text, count]) => ({
                icon: '',
                text,
                count,
              }))
            )
          }

          reveiwListRes = await fetchWithRefresh(
            `https://mindmate.shop/api/reviews/profile/${profileData.id}`,
            {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
            }
          )

          const reveiwListData = await reveiwListRes.json()

          // 상세 리뷰 (응답의 reviews 배열 활용)
          setUserReviews(
            (reveiwListData.content || []).map((r: any) => ({
              profileImage:
                'https://mindmate.shop/api' + r.reviewerProfileImage,
              username: r.reviewerNickname,
              rating: r.rating,
              date: r.createdAt
                ? r.createdAt.slice(2, 10).replace(/-/g, '.')
                : '',
              content: r.comment,
            }))
          )
        } else {
          // 타인 프로필 (상대방 userId)
          setIsOwnProfile(false)
          if (!userId) {
            alert('상대방 userId가 없습니다.')
            setUserProfile(null)
            setUserStats(null)
            setCategoryData(null)
            setReviewTags([])
            setUserReviews([])
            setLoading(false)
            return
          }
          profileRes = await fetchWithRefresh(
            `https://mindmate.shop/api/profiles/users/${userId}`,
            {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
            }
          )
          profileData = await profileRes.json()
          setUserProfile({
            profileImage: profileData.profileImage,
            username: profileData.nickname,
            department: profileData.department || '',
            entranceTime: profileData.entranceTime
              ? String(profileData.entranceTime)
              : '',
          })
          setUserStats({
            averageScore: profileData.averageRating,
            coins: profileData.points,
            matchCount: profileData.totalCounselingCount,
            avgResponseTime: profileData.avgResponseTime,
          })
          // categoryData를 한글로 변환
          const convertedCategoryData = Object.entries(
            profileData.categoryCounts || {}
          ).reduce(
            (acc, [key, value]) => ({
              ...acc,
              [categoryMap[key] || key]: value,
            }),
            {}
          )
          setCategoryData(convertedCategoryData)
          // 리뷰 태그, 상세 리뷰 등 추가 API 호출
          // 리뷰 태그(임시: 태그 카운트)
          if (profileData.tagCounts) {
            setReviewTags(
              Object.entries(profileData.tagCounts).map(([text, count]) => ({
                icon: '',
                text,
                count,
              }))
            )
          }

          reveiwListRes = await fetchWithRefresh(
            `https://mindmate.shop/api/reviews/profile/${profileData.id}`,
            {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
            }
          )

          const reveiwListData = await reveiwListRes.json()

          // 상세 리뷰 (응답의 reviews 배열 활용)
          setUserReviews(
            (reveiwListData.content || []).map((r: any) => ({
              profileImage:
                'https://mindmate.shop/api' + r.reviewerProfileImage,
              username: r.reviewerNickname,
              rating: r.rating,
              date: r.createdAt
                ? r.createdAt.slice(2, 10).replace(/-/g, '.')
                : '',
              content: r.comment,
            }))
          )
        }
      } catch (e) {
        setUserProfile(null)
        setUserStats(null)
        setCategoryData(null)
        setReviewTags([])
        setUserReviews([])
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()

    // 포인트 잔액 별도 조회
    const fetchPointBalance = async () => {
      try {
        const res = await fetchWithRefresh(
          'https://mindmate.shop/api/points/balance',
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          }
        )
        if (res.ok) {
          const balance = await res.json()
          setPointBalance(balance)
        }
      } catch (e) {
        setPointBalance(null)
      }
    }
    fetchPointBalance()
  }, [userId, user])

  const handleProfileEdit = () => {
    navigate('/profile/edit')
  }

  const handleSettingClick = () => {
    navigate('/profile/setting')
  }

  const handleKebabClick = () => {
    setIsBottomSheetOpen(true)
  }

  // 리뷰 전체보기 클릭 핸들러 - 상세 리뷰 페이지로 이동
  const handleViewAllReviewsClick = () => {
    navigate('/detailreview')
  }

  if (loading) {
    return <div></div>
  }

  return (
    <MypageContainer>
      <ContentContainer>
        <TopBar
          leftContent={
            <LogoText>{isOwnProfile ? '마이페이지' : '프로필'}</LogoText>
          }
          rightContent={
            isOwnProfile ? (
              <button onClick={handleSettingClick}>
                <SettingIcon color="#392111" />
              </button>
            ) : (
              <button onClick={handleKebabClick}>
                <KebabIcon />
              </button>
            )
          }
          showBorder={false}
          isFixed={true}
        />
        {!isOwnProfile && (
          <BottomSheet
            isOpen={isBottomSheetOpen}
            onClose={() => setIsBottomSheetOpen(false)}
            menuItems={[
              {
                text: '신고',
                onClick: () => {
                  navigate(`/profile/${userId}/report/${user?.id}/${userId}`)
                },
              },
            ]}
          />
        )}
        <ComponentContainer>
          <ProfileEdit
            profileImage={
              isProfileImageLoaded
                ? realProfileImageUrl
                : defaultProfileImageUrl
            }
            username={userProfile?.username}
            onEditClick={handleProfileEdit}
            isOwnProfile={isOwnProfile}
          />
          {realProfileImageUrl && !isProfileImageLoaded && (
            <img
              src={realProfileImageUrl}
              alt=""
              style={{ display: 'none' }}
              onLoad={() => setIsProfileImageLoaded(true)}
              onError={() => setIsProfileImageLoaded(true)}
            />
          )}
          <InfoBoxContainer>
            <InfoBox
              averageScore={userStats?.averageScore || 0}
              coins={
                isOwnProfile
                  ? pointBalance !== null
                    ? pointBalance
                    : userStats?.coins
                  : undefined
              }
              matchCount={userStats?.matchCount}
              avgResponseTime={
                !isOwnProfile ? userStats?.avgResponseTime : undefined
              }
            />
          </InfoBoxContainer>
          <MatchingGraphContainer>
            <MatchingGraph categoryData={categoryData || {}} />
          </MatchingGraphContainer>
          <TagReview tags={reviewTags} />
          {userReviews.length === 0 ? (
            <div
              style={{
                background: 'whitesmoke',
                borderRadius: 12,
                padding: '32px 0',
                textAlign: 'center',
                color: '#aaa',
                fontSize: 14,
                margin: '16px 0',
              }}
            >
              아직 받은 평가가 없어요 : (
            </div>
          ) : (
            <DetailReview
              reviews={userReviews}
              onViewAllClick={handleViewAllReviewsClick}
            />
          )}
        </ComponentContainer>
      </ContentContainer>
      <NavigationComponent />
    </MypageContainer>
  )
}

export default MyPage
