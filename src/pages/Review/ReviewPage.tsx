import { useState } from 'react'
import { useParams } from 'react-router-dom'
import TopBar from '../../components/topbar/Topbar'
import Star from '../../components/review/Star'
import ReviewButton from '../../components/buttons/reviewButton'
import {
  ContentContainer,
  ExplainText,
  ReviewPageContainer,
  TitleText,
  ReviewButtonsContainer,
  TextAreaContainer,
  ReviewTextArea,
  CharCounter,
  SubmitButton,
} from './ReviewPageStyles.tsx'

// 리뷰 버튼 데이터
const REVIEW_OPTIONS = [
  { id: 1, text: '⚡️ 응답이 빨라요' },
  { id: 2, text: '❤️‍🩹 공감을 잘해줘요' },
  { id: 3, text: '🤝🏻 신뢰할 수 있는 대화였어요' },
  { id: 4, text: '🎯 솔직하고 현실적인 조언을 해줘요' },
  { id: 5, text: '💡 새로운 관점을 제시해줘요' },
  { id: 6, text: '☕️ 편안한 분위기에서 이야기할 수 있었어요' },
]

const MAX_CHARS = 1000

const ReviewPage = () => {
  // URL 파라미터에서 id 값을 가져옵니다
  const { id } = useParams()

  // 별점 상태
  const [selectedRating, setSelectedRating] = useState(0)

  // 선택된 리뷰 옵션들을 추적합니다
  const [selectedReviews, setSelectedReviews] = useState<string[]>([])

  // 텍스트 입력 상태
  const [reviewText, setReviewText] = useState('')

  // 별점 변경 핸들러
  const handleRatingChange = (rating: number) => {
    setSelectedRating(rating)
  }

  // 리뷰 버튼 활성화 상태 변경 핸들러
  const handleReviewActiveChange = (reviewText: string, isActive: boolean) => {
    if (isActive) {
      // 활성화된 경우 목록에 추가
      setSelectedReviews((prev) => [...prev, reviewText])
    } else {
      // 비활성화된 경우 목록에서 제거
      setSelectedReviews((prev) => prev.filter((text) => text !== reviewText))
    }
  }

  // 텍스트 입력 핸들러
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (value.length <= MAX_CHARS) {
      setReviewText(value)
    }
  }

  // 등록하기 버튼 클릭 핸들러
  const handleSubmit = () => {
    // 유효성 검사
    if (selectedRating > 0 && selectedReviews.length > 0) {
      console.log('리뷰 제출 완료!')
      console.log('별점:', selectedRating)
      console.log('선택된 리뷰:', selectedReviews)
      console.log('추가 리뷰 텍스트:', reviewText)

      // Todo: 서버로 데이터 전송 로직 추가 가능
    }
  }

  // 버튼 활성화 여부 확인
  const isButtonActive = selectedRating > 0 && selectedReviews.length > 0

  return (
    <ReviewPageContainer>
      <TopBar
        title="후기 작성"
        showBackButton
        showBorder={false}
        isFixed={true}
      />
      <ContentContainer>
        <TitleText>
          {id}님과 나눈 이야기,
          <br />
          도움이 되었나요?
        </TitleText>

        <Star 별점={selectedRating} onChange={handleRatingChange} />

        <ReviewButtonsContainer>
          {REVIEW_OPTIONS.map((option) => (
            <ReviewButton
              key={option.id}
              reviewText={option.text}
              onActiveChange={(isActive) =>
                handleReviewActiveChange(option.text, isActive)
              }
            />
          ))}
        </ReviewButtonsContainer>

        <ExplainText>추가로 나누고 싶은 이야기가 있나요?</ExplainText>

        <TextAreaContainer>
          <ReviewTextArea
            placeholder="후기를 입력해 주세요. (최대 1000자)"
            value={reviewText}
            onChange={handleTextChange}
            maxLength={MAX_CHARS}
          />
          <CharCounter>
            {reviewText.length}/{MAX_CHARS}
          </CharCounter>
        </TextAreaContainer>

        <SubmitButton active={isButtonActive} onClick={handleSubmit}>
          등록하기
        </SubmitButton>
      </ContentContainer>
    </ReviewPageContainer>
  )
}

export default ReviewPage
