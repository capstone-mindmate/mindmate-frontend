import React, { useState, useEffect, useRef, useMemo } from 'react'
import Frame from '../../components/frame/Frame'
import {
  FrameSlider as FrameSliderContainer,
  FrameWrapper,
} from './FrameSliderStyles'

// Frame 인터페이스 정의
export interface FrameData {
  id: number
  title: string
  detail: string
  imageSrc: string
  currentPage: number
  totalPages: number
}

// FrameSlider 컴포넌트 프롭 정의
interface FrameSliderProps {
  frames: FrameData[]
  onFrameClick?: (frameId: number) => void
}

const FrameSlider: React.FC<FrameSliderProps> = ({ frames, onFrameClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // 스와이프 감지를 위한 ref와 상태값
  const wrapperRef = useRef<HTMLDivElement>(null)
  const touchStartXRef = useRef<number | null>(null)
  const touchEndXRef = useRef<number | null>(null)

  // 모든 프레임을 항상 렌더링 - 핵심!
  const allFrames = useMemo(() => {
    return frames.map((frame, frameIndex) => {
      // 현재 인덱스 기준으로 상대적 위치 계산
      let relativePosition = frameIndex - currentIndex

      // 순환 처리 (-2, -1, 0, 1, 2 범위로 정규화)
      if (relativePosition > frames.length / 2) {
        relativePosition -= frames.length
      } else if (relativePosition < -frames.length / 2) {
        relativePosition += frames.length
      }

      let position = 'hidden'
      let transform = 'translateX(300%) scale(0)'
      let opacity = 0
      let zIndex = 0
      let filter = 'brightness(0.9)'

      // 위치별 스타일 설정
      if (relativePosition === -2) {
        position = 'far-prev'
        transform = 'translateX(-160%) scale(0)'
        opacity = 0
        zIndex = 0
      } else if (relativePosition === -1) {
        position = 'prev'
        transform = 'translateX(-80%) scale(0.7)'
        opacity = 0.85
        zIndex = 1
        filter = 'brightness(0.9)'
      } else if (relativePosition === 0) {
        position = 'current'
        transform = 'translateX(0) scale(0.8)'
        opacity = 1
        zIndex = 3
        filter = 'brightness(1)'
      } else if (relativePosition === 1) {
        position = 'next'
        transform = 'translateX(80%) scale(0.7)'
        opacity = 0.85
        zIndex = 1
        filter = 'brightness(0.9)'
      } else if (relativePosition === 2) {
        position = 'far-next'
        transform = 'translateX(160%) scale(0)'
        opacity = 0
        zIndex = 0
      }

      return {
        ...frame,
        position,
        index: frameIndex,
        transform,
        opacity,
        zIndex,
        filter,
        // 고정된 키 사용 - 이게 핵심!
        key: `frame-${frame.id}`,
      }
    })
  }, [frames, currentIndex])

  // 다음 프레임으로 이동
  const nextFrame = () => {
    setCurrentIndex((prev) => (prev + 1) % frames.length)
  }

  // 이전 프레임으로 이동
  const prevFrame = () => {
    setCurrentIndex((prev) => (prev - 1 + frames.length) % frames.length)
  }

  // 프레임 클릭 핸들러
  const handleFrameClick = (position: string, frameIndex: number) => {
    if (position === 'current') {
      console.log(`Current frame clicked, navigate to detail page`)
      if (onFrameClick) {
        onFrameClick(frames[frameIndex].id)
      }
    } else if (position === 'next') {
      nextFrame()
    } else if (position === 'prev') {
      prevFrame()
    }
  }

  // 터치 이벤트 핸들러
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX
    touchEndXRef.current = null
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (touchStartXRef.current && touchEndXRef.current) {
      const diff = touchStartXRef.current - touchEndXRef.current
      const threshold = 50

      if (diff < -threshold) {
        prevFrame()
      } else if (diff > threshold) {
        nextFrame()
      }
    }

    touchStartXRef.current = null
    touchEndXRef.current = null
  }

  // 자동 슬라이드 효과
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      nextFrame()
    }, 5000)

    return () => clearInterval(interval)
  }, [isPaused, frames.length])

  // 마우스 이벤트 핸들러
  const handleMouseEnter = () => {
    setIsPaused(true)
  }

  const handleMouseLeave = () => {
    setIsPaused(false)
  }

  return (
    <FrameSliderContainer>
      <FrameWrapper
        ref={wrapperRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {allFrames.map((frame) => (
          <div
            key={frame.key} // 고정된 키 사용!
            className={`frame-item ${frame.position}`}
            onClick={() => handleFrameClick(frame.position, frame.index)}
            style={{
              // 인라인 스타일로 부드러운 전환
              position: 'absolute',
              cursor: 'pointer',
              width: '280px',
              height: '230px',
              backfaceVisibility: 'hidden',
              transformStyle: 'preserve-3d',
              transform: frame.transform,
              opacity: frame.opacity,
              zIndex: frame.zIndex,
              filter: frame.filter,
              transition: 'all 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)',
              willChange: 'transform, opacity, filter',
              pointerEvents: frame.opacity > 0 ? 'auto' : 'none',
            }}
          >
            <div>
              <Frame
                title={frame.title}
                detail={frame.detail}
                imageSrc={frame.imageSrc}
                currentPage={frame.currentPage}
                totalPages={frame.totalPages}
                onClick={() => handleFrameClick(frame.position, frame.index)}
              />
            </div>
          </div>
        ))}
      </FrameWrapper>
    </FrameSliderContainer>
  )
}

export default FrameSlider
