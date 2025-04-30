import React from 'react'
import { BackIcon, KebabIcon } from '../icon/iconComponents'
import {
  TopBarContainer,
  TopBarTitle,
  TopBarBackButton,
  TopBarActionButton,
} from '../../styles/TopBarStyles'

// 탑바 컴포넌트 Props 인터페이스
interface TopBarProps {
  title: string // 페이지 제목
  showBackButton?: boolean // 뒤로가기 버튼 표시 여부 (기본값: false)
  onBackClick?: () => void // 뒤로가기 버튼 클릭 핸들러
  actionText?: string // 액션 버튼 텍스트 (제공되지 않으면 버튼 미표시)
  actionIcon?: boolean
  onActionClick?: () => void // 액션 버튼 클릭 핸들러
  isActionDisabled?: boolean // 액션 버튼 비활성화 상태 (기본값: false)
}

// 탑바 컴포넌트
const TopBar: React.FC<TopBarProps> = ({
  title,
  showBackButton = false,
  onBackClick,
  actionText,
  actionIcon = false,
  onActionClick,
  isActionDisabled = false,
}) => {
  // 뒤로가기 기본 핸들러 - 브라우저 히스토리 API 사용
  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick()
    } else {
      window.history.back()
    }
  }

  return (
    <TopBarContainer>
      {showBackButton && (
        <TopBarBackButton onClick={handleBackClick}>
          <BackIcon color="#392111" />
        </TopBarBackButton>
      )}
      <TopBarTitle>{title}</TopBarTitle>
      {actionText && (
        <TopBarActionButton
          onClick={onActionClick}
          disabled={isActionDisabled}
          isDisabled={isActionDisabled}
        >
          {actionText}
        </TopBarActionButton>
      )}
      {actionIcon && (
        <TopBarActionButton
          onClick={onActionClick}
          disabled={isActionDisabled}
          isDisabled={isActionDisabled}
        >
          <KebabIcon color="#392111" />
        </TopBarActionButton>
      )}
    </TopBarContainer>
  )
}

export default TopBar
