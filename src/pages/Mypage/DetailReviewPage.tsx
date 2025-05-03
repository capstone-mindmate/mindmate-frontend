/**
 * 상세 리뷰 전체보기 페이지
 *
 * 마이페이지에서 전체보기 버튼을 클릭했을 때 이동하는 페이지로,
 * TopBar와 함께 모든 리뷰를 표시합니다.
 */
import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../../components/topbar/Topbar'
import DetailReview from '../../components/review/DetailReview'
import {
  PageContainer,
  ContentContainer,
  ComponentContainer,
} from './DetailReviewPageStyles'

const DetailReviewPage: React.FC = () => {
  const navigate = useNavigate()
  const topRef = useRef<HTMLDivElement>(null)

  // 페이지 로드 시 맨 위로 스크롤
  useEffect(() => {
    window.scrollTo(0, 0)
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'auto' })
    }
  }, [])

  // 뒤로가기 버튼 클릭 핸들러
  const handleBackClick = () => {
    navigate(-1) // 이전 페이지로 돌아가기
  }

  // TODO: API에서 데이터를 가져오기
  // 테스트를 위한 하드코딩된 샘플 데이터
  const reviewsData = [
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
    {
      profileImage: '/public/image.png',
      username: '햇살가득 바다',
      rating: 5.0,
      date: '25.03.26',
      content:
        '정말 감사해요! 고민이 해결됐어요. 진짜 다음에도 꼭 또 상담하고 싶어요 ^^ 정말 감사해요! 고민이 해결됐어요. 진짜 다음에도 꼭 또 상담하고 싶어요 ^^ 정말 감사해요! 고민이 해결됐어요. 진짜 다음에도 꼭 또 상담하고 싶어요 ^^ 정말 감사해요! 고민이 해결됐어요. 진짜 다음에도 꼭 또 상담하고 싶어요 ^^ 정말 감사해요! 고민이 해결됐어요. 진짜 다음에도 꼭 또 상담하고 싶어요 ^^',
    },
    {
      profileImage: '/public/image copy.png',
      username: '자유로움',
      rating: 4.5,
      date: '25.03.24',
      content:
        '상대방의 관점에서 생각해볼 수 있는 계기가 됐어요. 대화가 너무 편안했습니다.',
    },
    {
      profileImage: '/public/image.png',
      username: '가을하늘',
      rating: 4.0,
      date: '25.03.22',
      content: '진심어린 조언 감사합니다! 많은 도움이 됐어요.',
    },
  ]

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
