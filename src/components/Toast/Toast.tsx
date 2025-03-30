import React, { useState, useEffect } from 'react'
import {
  ToastContainer,
  IconContainer,
  MessageText,
  CloseButton,
  IconImage,
} from '../../styles/ToastStyles.tsx'
import { ToastType } from './ToastProvider.tsx'

// 토스트 타입별 아이콘 컴포넌트
const ToastIcon = ({ type }: { type: ToastType }) => {
  const getIconPath = () => {
    switch (type) {
      case 'info':
        return '/icon/info.svg'
      case 'error':
        return '/icon/error.svg'
      case 'warning':
        return '/icon/warning.svg'
      case 'success':
        return '/icon/check_small.svg'
      default:
        return '/icon/info.svg'
    }
  }

  return <IconImage src={getIconPath()} alt={`${type} icon`} type={type} />
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
      <CloseButton onClick={handleClose}>×</CloseButton>
    </ToastContainer>
  )
}

export default Toast
