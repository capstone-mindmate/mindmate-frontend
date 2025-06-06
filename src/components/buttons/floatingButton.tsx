/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useState, useEffect, useRef } from 'react'

interface FloatingButtonProps {
  buttonText: string
  buttonIcon: React.ReactNode
  onActiveChange?: (isActive: boolean) => void
  containerSelector?: string // 컨테이너 선택자 (기본값: body)
}

const FloatingButton: React.FC<FloatingButtonProps> = ({
  buttonText,
  buttonIcon,
  onActiveChange,
  containerSelector = 'body', // 기본값은 body
}) => {
  const [isActive, setIsActive] = useState(false)
  const [rightPosition, setRightPosition] = useState(24) // 기본 우측 여백
  const buttonRef = useRef<HTMLButtonElement>(null)

  // 화면 크기가 변경될 때마다 버튼 위치 재계산
  useEffect(() => {
    const calculatePosition = () => {
      const container = document.querySelector(containerSelector)
      if (!container || !buttonRef.current) return

      const containerRect = container.getBoundingClientRect()
      const windowWidth = window.innerWidth

      // 컨테이너의 우측 여백 계산
      const containerRightMargin = (windowWidth - containerRect.width) / 2

      // 반응형 여백 설정
      let margin = 24 // 기본값 (모바일)

      if (windowWidth >= 1440) {
        margin = 50 // 대형 화면
      } else if (windowWidth >= 1024) {
        margin = 40 // 데스크탑
      } else if (windowWidth >= 768) {
        margin = 32 // 태블릿
      }

      // 컨테이너 우측 여백과 설정한 여백 중 큰 값 사용
      const rightPos = Math.max(containerRightMargin, margin)
      setRightPosition(rightPos)
    }

    // 초기 계산 및 이벤트 리스너 설정
    calculatePosition()
    window.addEventListener('resize', calculatePosition)

    return () => {
      window.removeEventListener('resize', calculatePosition)
    }
  }, [containerSelector])

  const handleClick = () => {
    const newActiveState = !isActive
    setIsActive(newActiveState)
    onActiveChange?.(newActiveState)
  }

  // 동적으로 계산된 버튼 스타일
  const buttonStyle = css`
    position: fixed;
    bottom: 100px;
    right: ${rightPosition}px;
    z-index: 1003;
    width: auto;
    height: 44px;
    background-color: #392111;
    color: #ffffff;
    border: none;
    padding: 10px 14px;
    border-radius: 100px;
    font-size: 14px;
    font-weight: bold;
    line-height: 1.4;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

    &:hover {
      transform: scale(1.03);
    }

    /* 모바일 화면에서의 높이 조정 */
    @media (max-width: 767px) {
      bottom: 100px;
      height: 40px;
      padding: 8px 12px;
      font-size: 13px;
    }
  `

  const iconStyle = css`
    display: flex;
    align-items: center;
  `

  return (
    <button ref={buttonRef} css={buttonStyle} onClick={handleClick}>
      <span css={iconStyle}>{buttonIcon}</span>
      {buttonText}
    </button>
  )
}

export default FloatingButton
