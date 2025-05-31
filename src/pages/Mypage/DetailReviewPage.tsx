/**
 * 상세 리뷰 전체보기 페이지
 *
 * 마이페이지에서 전체보기 버튼을 클릭했을 때 이동하는 페이지로,
 * TopBar와 함께 모든 리뷰를 표시합니다.
 */
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import TopBar from '../../components/topbar/Topbar'
import DetailReview from '../../components/review/DetailReview'
import {
  PageContainer,
  ContentContainer,
  ComponentContainer,
} from './DetailReviewPageStyles'
import { fetchWithRefresh } from '../../utils/fetchWithRefresh'
import { useAuthStore } from '../../stores/userStore'

const DetailReviewPage: React.FC = () => {
  const navigate = useNavigate()
  const topRef = useRef<HTMLDivElement>(null)
  const { user } = useAuthStore()
  const { userId } = useParams<{ userId: string }>()
  const [reviewsData, setReviewsData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // 페이지 로드 시 맨 위로 스크롤
  useEffect(() => {
    window.scrollTo(0, 0)
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'auto' })
    }
  }, [])

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true)
      try {
        let profileId
        if (!userId || (user && String(user.id) === userId)) {
          // 내 프로필
          if (user?.profileId) {
            profileId = user.profileId
          } else {
            const myProfileRes = await fetchWithRefresh(
              `http://localhost/api/profiles/users/${user?.id}`,
              {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
              }
            )
            const myProfileData = await myProfileRes.json()
            profileId = myProfileData.id
          }
        } else {
          // 타인 프로필
          const otherRes = await fetchWithRefresh(
            `http://localhost/api/profiles/users/${userId}`,
            {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
            }
          )
          const otherData = await otherRes.json()
          profileId = otherData.id
        }
        // 리뷰 목록
        const reviewRes = await fetchWithRefresh(
          `http://localhost/api/reviews/profile/${profileId}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        )
        const reviewData = await reviewRes.json()
        setReviewsData(
          (reviewData.content || [])
            .filter((r: any) => r.comment !== '')
            .map((r: any) => ({
              profileImage: 'http://localhost/api' + r.reviewerProfileImage,
              username: r.reviewerNickname,
              rating: r.rating,
              date: r.createdAt
                ? r.createdAt.slice(2, 10).replace(/-/g, '.')
                : '',
              content: r.comment,
            }))
        )
      } catch (e) {
        setReviewsData([])
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [userId, user])

  // 뒤로가기 버튼 클릭 핸들러
  const handleBackClick = () => {
    navigate(-1) // 이전 페이지로 돌아가기
  }

  if (loading) {
    return <div>로딩 중...</div>
  }

  return (
    <PageContainer>
      <TopBar
        title="리뷰 전체보기"
        showBackButton={true}
        onBackClick={handleBackClick}
        isFixed={true}
      />
      <ContentContainer>
        <ComponentContainer>
          {/* fullView prop을 true로 설정하여 전체 보기 모드 활성화 */}
          <DetailReview reviews={reviewsData} fullView={true} />
        </ComponentContainer>
      </ContentContainer>
    </PageContainer>
  )
}

export default DetailReviewPage
