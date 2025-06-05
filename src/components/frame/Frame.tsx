import React, { useState, useCallback, memo } from 'react'
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
const Frame = memo(
  ({
    title,
    imageSrc,
    detail,
    currentPage,
    totalPages,
    onClick,
  }: FrameProps) => {
    const [imageLoaded, setImageLoaded] = useState(false)
    const [imageError, setImageError] = useState(false)

    // 제목 길이 체크 (최대 18자)
    const validateTitle = useCallback((text: string) => {
      if (text.length > 18) {
        console.warn(
          '프레임 제목은 최대 18자까지 권장됩니다만, 디자인에 맞게 여러 줄로 표시됩니다.'
        )
      }
      return text
    }, [])

    // 이미지 로드 완료 핸들러
    const handleImageLoad = useCallback(() => {
      setImageLoaded(true)
      setImageError(false)
    }, [])

    // 이미지 로드 에러 핸들러
    const handleImageError = useCallback(() => {
      setImageError(true)
      setImageLoaded(false)
      console.warn(`이미지 로드 실패: ${imageSrc}`)
    }, [imageSrc])

    // 클릭 핸들러
    const handleClick = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (onClick) {
          onClick()
        }
      },
      [onClick]
    )

    // 프레임의 UI 렌더링
    return (
      <FrameContainer onClick={handleClick}>
        <ImageContainer>
          {/* 로딩 상태 또는 에러 상태 표시 - 둘 다 스켈레톤으로 처리 */}
          {(!imageLoaded || imageError) && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background:
                  'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
                zIndex: 1,
              }}
            >
              <style>
                {`
                @keyframes shimmer {
                  0% { background-position: -200% 0; }
                  100% { background-position: 200% 0; }
                }
              `}
              </style>

              {/* 에러 시에만 작은 아이콘 표시 */}
              {imageError && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    opacity: 0.6,
                    fontSize: '12px',
                    color: '#999',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <div style={{ fontSize: '16px' }}>📷</div>
                  <div>로드 실패</div>
                </div>
              )}
            </div>
          )}

          {/* 실제 이미지 */}
          <FrameImage
            src={imageSrc}
            alt={title}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
            decoding="async"
            style={{
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease',
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)',
            }}
          />

          {/* 그라데이션은 이미지가 로드되었고 에러가 없을 때만 표시 */}
          {imageLoaded && !imageError && <ImageGradient />}

          {/* 텍스트 오버레이도 이미지가 로드되었고 에러가 없을 때만 표시 */}
          {imageLoaded && !imageError && (
            <TextOverlay>
              <TitleText>{validateTitle(title)}</TitleText>
              <DetailText>{detail}</DetailText>
            </TextOverlay>
          )}

          {/* 페이지 인디케이터도 이미지가 로드되었고 에러가 없을 때만 표시 */}
          {imageLoaded && !imageError && currentPage && totalPages && (
            <PageIndicator>
              {currentPage} / {totalPages} {'>'}
            </PageIndicator>
          )}
        </ImageContainer>
      </FrameContainer>
    )
  }
)

Frame.displayName = 'Frame'

export default Frame
