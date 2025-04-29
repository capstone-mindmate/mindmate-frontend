import React from 'react'
import {
  DetailReviewContainer,
  TitleContainer,
  Title,
  ViewAllButton,
  ReviewHeader,
  ProfileImage,
  UserInfoSection,
  Username,
  RatingSection,
  StarIconWrapper,
  Rating,
  DateText,
  ReviewContent,
  ReviewList,
} from '../../styles/DetailReviewStyles'

interface ReviewItem {
  profileImage: string
  username: string
  rating: number
  date: string
  content: string
}

interface DetailReviewProps {
  reviews: ReviewItem[]
  onViewAllClick?: () => void
}

// Star icon as SVG with gold color
const StarIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      fill="#F0DAA9"
      stroke="#F0DAA9"
      strokeWidth="1.5"
    />
  </svg>
)

const DetailReview: React.FC<DetailReviewProps> = ({
  reviews,
  onViewAllClick,
}) => {
  return (
    <DetailReviewContainer>
      <TitleContainer>
        <Title>상세 리뷰</Title>
        <ViewAllButton onClick={onViewAllClick}>전체보기</ViewAllButton>
      </TitleContainer>
      <ReviewList>
        {reviews.map((review, index) => (
          <div key={index}>
            <ReviewHeader>
              <ProfileImage
                src={review.profileImage}
                alt={`${review.username}의 프로필 이미지`}
              />
              <UserInfoSection>
                <Username>{review.username}</Username>
                <RatingSection>
                  <StarIconWrapper>
                    <StarIcon />
                  </StarIconWrapper>
                  <Rating>{review.rating.toFixed(1)}점</Rating>
                  <DateText>{review.date}</DateText>
                </RatingSection>
              </UserInfoSection>
            </ReviewHeader>
            <ReviewContent>{review.content}</ReviewContent>
          </div>
        ))}
      </ReviewList>
    </DetailReviewContainer>
  )
}

export default DetailReview
