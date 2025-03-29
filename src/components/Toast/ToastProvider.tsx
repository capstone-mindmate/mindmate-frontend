import React, { createContext, useContext, useState, useCallback } from 'react'
import Toast from './Toast.tsx'
import { ToastsContainer } from '../../styles/ToastStyles.tsx'

// 토스트 타입 정의
export type ToastType = 'info' | 'error' | 'warning' | 'success'

// 토스트 아이템 인터페이스
interface ToastItem {
  id: string //토스트를 식별하기 위한
  message: string
  type: ToastType
  autoClose: boolean //자동으로 닫힐지 여부
  duration?: number //자동으로 닫히기 전 표시 시간
}

// 토스트 컨텍스트 인터페이스
interface ToastContextType {
  showToast: (
    message: string,
    type: ToastType,
    autoClose?: boolean,
    duration?: number
  ) => string
  hideToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

// 커스텀 훅
export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast 훅을 사용하려면 ToastProvider가 필요합니다')
  }
  return context
}

// 프로바이더 Props 인터페이스
interface ToastProviderProps {
  children: React.ReactNode // Provider 내부에 렌더링될 자식 요소들
}

// 토스트 프로바이더 컴포넌트
export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  // 토스트 표시 함수
  const showToast = useCallback(
    (
      message: string,
      type: ToastType,
      autoClose = true,
      duration = 3000
    ): string => {
      const id = Math.random().toString(36).substring(2, 9)

      // 기존 토스트를 모두 대체하여 하나의 토스트만 표시
      setToasts([{ id, message, type, autoClose, duration }])

      return id // ID 반환 (나중에 특정 토스트를 제거할 수 있도록)
    },
    []
  )

  // 토스트 제거 함수
  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  // Context.Provider를 사용하여 토스트 관련 기능을 자식 컴포넌트들에게 제공
  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}

      <ToastsContainer>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => hideToast(toast.id)}
            autoClose={toast.autoClose}
            duration={toast.duration}
          />
        ))}
      </ToastsContainer>
    </ToastContext.Provider>
  )
}

export default ToastProvider
