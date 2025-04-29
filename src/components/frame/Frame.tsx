import React from 'react'
import {
  FrameContainer,
  ImageContainer,
  TitleText,
  DetailText,
  FrameImage,
  TextOverlay,
  PageIndicator,
  ImageGradient,
} from '../../styles/FrameStyles'

// Frame 컴포넌트 Props 인터페이스
interface FrameProps {
  title: string
  imageSrc: string
  detail: string
  currentPage?: number
  totalPages?: number
  onClick?: () => void
}

// Frame 컴포넌트
const Frame = ({
  title,
  imageSrc,
  detail,
  currentPage,
  totalPages,
  onClick,
}: FrameProps) => {
  // 제목 길이 체크 (최대 18자)
  const validateTitle = (text: string) => {
    if (text.length > 18) {
      console.warn(
        '프레임 제목은 최대 18자까지 권장됩니다만, 디자인에 맞게 여러 줄로 표시됩니다.'
      )
    }
    return text
  }

  // 프레임의 UI 렌더링
  return (
    <FrameContainer onClick={onClick}>
      <ImageContainer>
        <FrameImage src={imageSrc} alt={title} />
        <ImageGradient />
        <TextOverlay>
          <TitleText>{validateTitle(title)}</TitleText>
          <DetailText>{detail}</DetailText>
        </TextOverlay>
        {currentPage && totalPages && (
          <PageIndicator>
            {currentPage} / {totalPages} {'>'}
          </PageIndicator>
        )}
      </ImageContainer>
    </FrameContainer>
  )
}

export default Frame
