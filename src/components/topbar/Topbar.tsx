import React, { ReactNode, useState, useEffect } from 'react'
import { BackIcon } from '../icon/iconComponents'
import {
  TopBarContainer,
  TopBarTitle,
  TopBarBackButton,
  TopBarActionButton,
  TopBarLeftContent,
  TopBarRightContent,
} from '../../styles/TopBarStyles'

// 탑바 컴포넌트 Props 인터페이스
interface TopBarProps {
  title?: string
  showBackButton?: boolean
  onBackClick?: () => void
  actionText?: string
  onActionClick?: () => void
  isActionDisabled?: boolean
  leftContent?: ReactNode
  rightContent?: ReactNode
  showBorder?: boolean
  isFixed?: boolean // 상단 고정 여부 (기본값: true)
}

// 탑바 컴포넌트
const TopBar: React.FC<TopBarProps> = ({
  title,
  showBackButton = false,
  onBackClick,
  actionText,
  onActionClick,
  isActionDisabled = false,
  leftContent,
  rightContent,
  showBorder = true,
  isFixed = true,
}) => {
  // 스크롤 위치에 따른 고정 상태 관리
  const [isScrolled, setIsScrolled] = useState(false)
  const [topBarHeight, setTopBarHeight] = useState(56) // 기본 높이
  const topBarRef = React.useRef<HTMLDivElement>(null)
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState<number | undefined>(
    undefined
  )

  // 스크롤 이벤트 처리 및 컨테이너 너비 측정
  useEffect(() => {
    if (!isFixed) return // isFixed가 false인 경우 스크롤 이벤트 무시

    // 초기 TopBar 위치와 높이, 너비 측정
    const measureTopBar = () => {
      if (topBarRef.current) {
        const rect = topBarRef.current.getBoundingClientRect()
        setTopBarHeight(rect.height)
      }

      if (wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect()
        setContainerWidth(rect.width)
      }
    }

    measureTopBar()

    // 스크롤 핸들러
    const handleScroll = () => {
      if (topBarRef.current) {
        const rect = topBarRef.current.getBoundingClientRect()
        // TopBar가 화면 상단에 도달하면 고정 상태로 변경
        setIsScrolled(rect.top <= 0)
      }
    }

    // 이벤트 리스너 등록
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', measureTopBar)

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', measureTopBar)
    }
  }, [isFixed])

  // 뒤로가기 핸들러
  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick()
    } else {
      window.history.back()
    }
  }

  // 왼쪽 영역 렌더링
  const renderLeftContent = () => {
    if (showBackButton) {
      return (
        <TopBarBackButton onClick={handleBackClick}>
          <BackIcon color="#392111" />
        </TopBarBackButton>
      )
    }

    if (leftContent) {
      return <TopBarLeftContent>{leftContent}</TopBarLeftContent>
    }

    return null
  }

  // 오른쪽 영역 렌더링
  const renderRightContent = () => {
    if (actionText) {
      return (
        <TopBarActionButton
          onClick={onActionClick}
          disabled={isActionDisabled}
          isDisabled={isActionDisabled}
        >
          {actionText}
        </TopBarActionButton>
      )
    }

    if (rightContent) {
      return <TopBarRightContent>{rightContent}</TopBarRightContent>
    }

    return null
  }

  // TopBar 컨테이너 스타일 - 고정 시 너비 설정
  const containerStyle =
    isFixed && isScrolled && containerWidth
      ? { maxWidth: `${containerWidth}px` }
      : {}

  return (
    <div ref={wrapperRef} style={{ width: '100%', position: 'relative' }}>
      <TopBarContainer
        ref={topBarRef}
        showBorder={showBorder}
        isFixed={isFixed && isScrolled} // 스크롤 시에만 고정
        style={containerStyle}
      >
        {renderLeftContent()}
        {title && <TopBarTitle>{title}</TopBarTitle>}
        {renderRightContent()}
      </TopBarContainer>

      {/* 고정 상태일 때 컨텐츠 겹침 방지용 스페이서 */}
      {isFixed && isScrolled && <div style={{ height: `${topBarHeight}px` }} />}
    </div>
  )
}

export default TopBar
