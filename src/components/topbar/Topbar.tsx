import React, { ReactNode } from 'react'
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
  title?: string | React.ReactNode // 페이지 제목
  showBackButton?: boolean // 뒤로가기 버튼 표시 여부 (기본값: false)
  onBackClick?: () => void // 뒤로가기 버튼 클릭 핸들러
  actionText?: string // 액션 버튼 텍스트 (제공되지 않으면 버튼 미표시)
  actionIcon?: boolean
  onActionClick?: () => void // 액션 버튼 클릭 핸들러
  isActionDisabled?: boolean // 액션 버튼 비활성화 상태 (기본값: false)
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
  showBorder = false,
  isFixed = true, // 기본값을 true로 설정
}) => {
  const topBarHeight = 56 // 고정 높이

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

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <TopBarContainer
        showBorder={showBorder}
        isFixed={isFixed} // isFixed 프롭 사용
        style={{ maxWidth: 'inherit' }}
      >
        {renderLeftContent()}
        {title && <TopBarTitle>{title}</TopBarTitle>}
        {renderRightContent()}
      </TopBarContainer>

      {/* 항상 여백 공간 추가 (isFixed일 때만) */}
      {isFixed && <div style={{ height: `${topBarHeight}px` }} />}
    </div>
  )
}

export default TopBar
