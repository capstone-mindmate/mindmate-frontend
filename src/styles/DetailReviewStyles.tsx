import styled from '@emotion/styled'

export const DetailReviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 16px;
`

export const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`

export const Title = styled.h2`
  font-family: 'Pretendard', sans-serif;
  font-weight: bold;
  font-size: 16px;
  margin: 0;
`

export const ViewAllButton = styled.button`
  font-family: 'Pretendard', sans-serif;
  font-weight: regular;
  font-size: 14px;
  color: #393939;
  background: none;
  border: none;
  text-align: right;
  cursor: pointer;
  padding: 4px 0;

  &:active {
    opacity: 0.7;
  }
`

export const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`

export const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`

export const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 12px;
`

export const UserInfoSection = styled.div`
  display: flex;
  flex-direction: column;
`

export const Username = styled.h3`
  font-family: 'Pretendard', sans-serif;
  font-weight: bold;
  font-size: 14px;
  color: #393939;
  margin: 0 0 4px 0;
`

export const RatingSection = styled.div`
  display: flex;
  align-items: center;
`

export const StarIconWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 4px;
`

export const Rating = styled.span`
  font-family: 'Pretendard', sans-serif;
  font-weight: bold;
  font-size: 14px;
  color: #393939;
  margin-right: 8px;
`

export const DateText = styled.span`
  font-family: 'Pretendard', sans-serif;
  font-weight: normal;
  font-size: 14px;
  color: #a3a3a3;
`

export const ReviewContent = styled.div`
  font-family: 'Pretendard', sans-serif;
  font-weight: normal;
  font-size: 14px;
  color: #393939;
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 8px;
`
