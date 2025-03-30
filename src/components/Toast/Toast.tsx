import React, { useState, useEffect } from 'react'
import {
  ToastContainer,
  IconContainer,
  MessageText,
  CloseButton,
} from '../../styles/ToastStyles.tsx'
import { ToastType } from '../toast/ToastProvider.tsx'
import {
  InfoIcon,
  ErrorIcon,
  WarningIcon,
  CheckIconSmall,
  CloseIcon,
} from '../icon/iconComponents.tsx'

// 토스트 타입별 색상 매핑 함수 (공통으로 사용)
const getTypeColor = (type: ToastType): string => {
  switch (type) {
    case 'info':
      return '#1B5BFE'
    case 'error':
      return '#FB4F50'
    case 'warning':
      return '#F8C73D'
    case 'success':
      return '#01A700'
    default:
      return '#1B5BFE'
  }
}

// 토스트 타입별 아이콘 컴포넌트
const ToastIcon = ({ type }: { type: ToastType }) => {
  const color = getTypeColor(type)

  switch (type) {
    case 'info':
      return <InfoIcon width={24} height={24} color={color} />
    case 'error':
      return <ErrorIcon width={24} height={24} color={color} />
    case 'warning':
      return <WarningIcon width={24} height={24} color={color} />
    case 'success':
      return <CheckIconSmall width={24} height={24} color={color} />
    default:
      return <InfoIcon width={24} height={24} color={color} />
  }
}

// 토스트 박스 컴포넌트 Props 인터페이스
interface ToastProps {
  message: string
  type: ToastType
  onClose: () => void
  autoClose?: boolean
  duration?: number
}

// 토스트 컴포넌트
const Toast: React.FC<ToastProps> = ({
  message,
  type,
  onClose,
  autoClose = true,
  duration = 3000,
}) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300) // 애니메이션 완료 후 제거
      }, duration)
      // 타이머 정리
      return () => clearTimeout(timer)
    }
  }, [autoClose, duration, onClose])

  // 닫기 버튼
  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  // 토스트의 UI 렌더링
  return (
    <ToastContainer isVisible={isVisible} type={type}>
      <IconContainer>
        <ToastIcon type={type} />
      </IconContainer>
      <MessageText>{message}</MessageText>
      <CloseButton onClick={handleClose}>
        <CloseIcon width={18} height={18} color={getTypeColor(type)} />
      </CloseButton>
    </ToastContainer>
  )
}

export default Toast
