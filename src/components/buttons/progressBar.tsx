/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useState, useEffect, ReactNode, TouchEvent, MouseEvent } from 'react'

interface ProgressBarProps {
  slides: ReactNode[]
  duration?: number
  onIndexChange?: (index: number) => void
  autoPlay?: boolean
}

const containerStyle = css`
  position: relative;
  width: 100%;
  min-height: 300px;
  overflow: hidden;
`

const sliderWrapperStyle = css`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const slideStyle = (isActive: boolean) => css`
  width: 100%;
  min-height: 300px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.5s ease;
  
  position: absolute;
      top: 0;
      left: 0;
      opacity: ${isActive ? 1 : 0};
      pointer-events: ${isActive ? 'auto' : 'none'};
      z-index: ${isActive ? 1 : 0};}
`

const progressBarContainerStyle = css`
  display: flex;
  gap: 8px;
  margin-top: 16px;
  justify-content: center;
`

const progressDotStyle = (isActive: boolean) => css`
  width: ${isActive ? '35px' : '8px'};
  height: 12px;
  border-radius: 8px;
  background-color: ${isActive ? '#392111' : '#D9D9D9'};
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
`

const ProgressBar: React.FC<ProgressBarProps> = ({
  slides,
  duration = 3000,
  onIndexChange,
  autoPlay = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const [autoPlayPaused, setAutoPlayPaused] = useState(false)

  useEffect(() => {
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (!autoPlay || !isInitialized || autoPlayPaused || isDragging) return

    const timer = setInterval(() => {
      nextSlide()
    }, duration)

    return () => clearInterval(timer)
  }, [
    currentIndex,
    autoPlay,
    duration,
    isInitialized,
    autoPlayPaused,
    isDragging,
  ])

  const nextSlide = () => {
    const nextIndex = (currentIndex + 1) % slides.length
    setCurrentIndex(nextIndex)
    onIndexChange?.(nextIndex)
  }

  const prevSlide = () => {
    const prevIndex = currentIndex <= 0 ? slides.length - 1 : currentIndex - 1
    setCurrentIndex(prevIndex)
    onIndexChange?.(prevIndex)
  }

  const handleDragStart = (e: TouchEvent | MouseEvent) => {
    setIsDragging(true)
    setAutoPlayPaused(true)
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    setStartX(clientX)
    setCurrentX(clientX)
  }

  const handleDragMove = (e: TouchEvent | MouseEvent) => {
    if (!isDragging) return
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    setCurrentX(clientX)
  }

  const handleDragEnd = () => {
    if (!isDragging) return

    const diff = currentX - startX
    const threshold = 50 // 슬라이드 전환을 위한 최소 드래그 거리

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // 오른쪽으로 드래그
        if (currentIndex > 0) {
          prevSlide()
        } else {
          // 첫 번째 슬라이드에서 마지막으로
          setCurrentIndex(slides.length - 1)
          onIndexChange?.(slides.length - 1)
        }
      } else if (diff < 0) {
        // 왼쪽으로 드래그
        if (currentIndex < slides.length - 1) {
          nextSlide()
        } else {
          // 마지막 슬라이드에서 처음으로
          setCurrentIndex(0)
          onIndexChange?.(0)
        }
      }
    }

    setIsDragging(false)
    setTimeout(() => setAutoPlayPaused(false), 1000)
  }

  const dragOffset = isDragging ? currentX - startX : 0
  const slideOffset = (index: number, currentIndex: number) => {
    let offset = (index - currentIndex) * 100 + dragOffset / 5

    // 첫 번째 슬라이드에서 오른쪽으로 드래그할 때
    if (currentIndex === 0 && dragOffset > 0) {
      const lastSlideOffset = (slides.length - 1 - currentIndex) * 100
      offset = dragOffset / 5 - lastSlideOffset
    }

    // 마지막 슬라이드에서 왼쪽으로 드래그할 때
    else if (currentIndex === slides.length - 1 && dragOffset < 0) {
      offset = dragOffset / 5 + 100
    }

    return offset
  }

  const slideStyleWithDrag = (
    isActive: boolean,
    index: number,
    currentIndex: number
  ) => css`
    ${slideStyle(isActive)}
    transform: translateX(${slideOffset(index, currentIndex)}%);
    transition: ${isDragging ? 'none' : 'all 0.5s ease'};
    user-select: none;
    cursor: ${isDragging ? 'grabbing' : 'grab'};
  `

  const handleDotClick = (index: number) => {
    if (index === currentIndex) return
    setCurrentIndex(index)
    onIndexChange?.(index)
  }

  if (!isInitialized) return null

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
      `}
    >
      <div css={containerStyle}>
        <div
          css={sliderWrapperStyle}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              css={slideStyleWithDrag(
                index === currentIndex,
                index,
                currentIndex
              )}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      <div css={progressBarContainerStyle}>
        {slides.map((_, index) => (
          <button
            key={index}
            css={progressDotStyle(index === currentIndex)}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default ProgressBar
