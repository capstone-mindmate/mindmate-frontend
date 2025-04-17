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
  title?: string // 페이지 제목 (선택적)
  showBackButton?: boolean // 뒤로가기 버튼 표시 여부 (기본값: false)
  onBackClick?: () => void // 뒤로가기 버튼 클릭 핸들러
  actionText?: string // 오른쪽 액션 버튼 텍스트 (제공되지 않으면 버튼 미표시)
  onActionClick?: () => void // 오른쪽 액션 버튼 클릭 핸들러
  isActionDisabled?: boolean // 오른쪽 액션 버튼 비활성화 상태 (기본값: false)
  leftContent?: ReactNode // 왼쪽에 표시할 커스텀 컨텐츠 (텍스트 또는 아이콘)
  rightContent?: ReactNode // 오른쪽에 표시할 커스텀 컨텐츠 (텍스트 또는 아이콘)
  showBorder?: boolean // 하단 테두리 표시 여부 (기본값: true)
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
  showBorder = true, // 기본값은 true로 설정하여 기존 동작 유지
}) => {
  // 뒤로가기 기본 핸들러 - 브라우저 히스토리 API 사용
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
    <TopBarContainer showBorder={showBorder}>
      {renderLeftContent()}
      {title && <TopBarTitle>{title}</TopBarTitle>}
      {renderRightContent()}
    </TopBarContainer>
  )
}

export default TopBar
