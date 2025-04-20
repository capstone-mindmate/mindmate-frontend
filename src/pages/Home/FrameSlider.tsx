import React, { useState, useEffect, useRef } from 'react'
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
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [animationDirection, setAnimationDirection] = useState<
    'to-left' | 'to-right'
  >('to-left')
  const [animatedFrames, setAnimatedFrames] = useState<string[]>([])
  const [targetIndex, setTargetIndex] = useState<number | null>(null)

  // 스와이프 감지를 위한 ref와 상태값 추가
  const wrapperRef = useRef<HTMLDivElement>(null)
  const touchStartXRef = useRef<number | null>(null)
  const touchEndXRef = useRef<number | null>(null)

  // 순환 배열을 생성하되 애니메이션 상태도 함께 관리
  const getVisibleFrames = () => {
    const farPrev = (currentIndex - 2 + frames.length) % frames.length
    const prev = (currentIndex - 1 + frames.length) % frames.length
    const next = (currentIndex + 1) % frames.length
    const farNext = (currentIndex + 2) % frames.length

    return [
      {
        ...frames[farPrev],
        position: 'far-prev',
        index: farPrev,
        animating: animatedFrames.includes('far-prev'),
      },
      {
        ...frames[prev],
        position: 'prev',
        index: prev,
        animating: animatedFrames.includes('prev'),
      },
      {
        ...frames[currentIndex],
        position: 'current',
        index: currentIndex,
        animating: animatedFrames.includes('current'),
      },
      {
        ...frames[next],
        position: 'next',
        index: next,
        animating: animatedFrames.includes('next'),
      },
      {
        ...frames[farNext],
        position: 'far-next',
        index: farNext,
        animating: animatedFrames.includes('far-next'),
      },
    ]
  }

  // 다음 프레임으로 이동 (오른쪽에서 왼쪽으로 이동)
  const nextFrame = () => {
    if (isTransitioning) return

    setIsTransitioning(true)
    setAnimationDirection('to-left')
    // 모든 프레임을 애니메이션에 포함
    setAnimatedFrames(['far-prev', 'prev', 'current', 'next', 'far-next'])

    // 애니메이션 완료 후 인덱스 변경
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % frames.length)
      setAnimatedFrames([])
      setIsTransitioning(false)
    }, 500)
  }

  // 이전 프레임으로 이동 (왼쪽에서 오른쪽으로 이동)
  const prevFrame = () => {
    if (isTransitioning) return

    setIsTransitioning(true)
    setAnimationDirection('to-right')
    // 모든 프레임을 애니메이션에 포함
    setAnimatedFrames(['far-prev', 'prev', 'current', 'next', 'far-next'])

    // 애니메이션 완료 후 인덱스 변경
    setTimeout(() => {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + frames.length) % frames.length
      )
      setAnimatedFrames([])
      setIsTransitioning(false)
    }, 500)
  }

  // 프레임 클릭 핸들러
  const handleFrameClick = (position: string, frameIndex: number) => {
    if (isTransitioning) return

    if (position === 'current') {
      console.log(`Current frame clicked, navigate to detail page`)
      // 상위 컴포넌트에 클릭 이벤트 전달
      if (onFrameClick) {
        onFrameClick(frames[frameIndex].id)
      }
    } else if (position === 'next') {
      // 다음(오른쪽) 프레임을 클릭하면 해당 프레임이 중앙으로 오도록 처리
      setTargetIndex(frameIndex)
      setAnimationDirection('to-left')
      setIsTransitioning(true)
      // 모든 프레임을 애니메이션에 포함
      setAnimatedFrames(['far-prev', 'prev', 'current', 'next', 'far-next'])

      // 애니메이션 완료 후 해당 프레임을 중앙으로 설정
      setTimeout(() => {
        setCurrentIndex(frameIndex)
        setAnimatedFrames([])
        setIsTransitioning(false)
        setTargetIndex(null)
      }, 500)
    } else if (position === 'prev') {
      // 이전(왼쪽) 프레임을 클릭하면 해당 프레임이 중앙으로 오도록 처리
      setTargetIndex(frameIndex)
      setAnimationDirection('to-right')
      setIsTransitioning(true)
      // 모든 프레임을 애니메이션에 포함
      setAnimatedFrames(['far-prev', 'prev', 'current', 'next', 'far-next'])

      // 애니메이션 완료 후 해당 프레임을 중앙으로 설정
      setTimeout(() => {
        setCurrentIndex(frameIndex)
        setAnimatedFrames([])
        setIsTransitioning(false)
        setTargetIndex(null)
      }, 500)
    }
  }

  // 터치 이벤트 핸들러 - 터치 시작
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX
    touchEndXRef.current = null
  }

  // 터치 이벤트 핸들러 - 터치 이동
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX
  }

  // 터치 이벤트 핸들러 - 터치 종료
  const handleTouchEnd = () => {
    if (touchStartXRef.current && touchEndXRef.current) {
      const diff = touchStartXRef.current - touchEndXRef.current
      const threshold = 50 // 스와이프로 인식할 최소 이동 거리

      // 왼쪽에서 오른쪽으로 스와이프 (다음 프레임으로 이동, 방향 주의)
      if (diff < -threshold) {
        prevFrame() // 왼쪽에서 오른쪽으로 스와이프하면 이전 프레임으로
      }
      // 오른쪽에서 왼쪽으로 스와이프 (이전 프레임으로 이동, 방향 주의)
      else if (diff > threshold) {
        nextFrame() // 오른쪽에서 왼쪽으로 스와이프하면 다음 프레임으로
      }
    }

    // 터치 값 초기화
    touchStartXRef.current = null
    touchEndXRef.current = null
  }

  // 자동 슬라이드 효과
  useEffect(() => {
    if (isPaused || isTransitioning) return

    const interval = setInterval(() => {
      if (!isTransitioning) {
        nextFrame()
      }
    }, 5000) // 5초마다 자동 슬라이드

    return () => clearInterval(interval)
  }, [isTransitioning, isPaused])

  // 마우스 오버 핸들러
  const handleMouseEnter = () => {
    setIsPaused(true)
  }

  // 마우스 리브 핸들러
  const handleMouseLeave = () => {
    setIsPaused(false)
  }

  // 가시적인 프레임 배열
  const visibleFrames = getVisibleFrames()

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
        {visibleFrames.map((frame) => (
          <div
            key={`${frame.id}-${frame.position}`}
            className={`frame-item ${frame.position} ${frame.animating ? `animating ${animationDirection}` : ''}`}
            onClick={() => handleFrameClick(frame.position, frame.index)}
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
