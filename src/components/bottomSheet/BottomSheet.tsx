/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useState, useEffect, useRef } from 'react'

interface MenuItem {
  text: string
  onClick: () => void
}

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  menuItems: MenuItem[]
  title?: string
  children?: React.ReactNode
}

const BottomSheet = ({
  isOpen,
  onClose,
  menuItems,
  title,
  children,
}: BottomSheetProps) => {
  const [isClosing, setIsClosing] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false)
      setShouldRender(true)
      document.body.style.overflow = 'hidden'
    } else {
      setIsClosing(true)

      timerRef.current = setTimeout(() => {
        setShouldRender(false)
        document.body.style.overflow = ''
      }, 300)
    }

    return () => {
      document.body.style.overflow = ''
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [isOpen])

  if (!shouldRender) return null

  const handleClose = () => {
    onClose()
  }

  const styles = {
    overlay: css`
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #00000055;
      z-index: 1001;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      animation: ${isClosing ? 'fadeOut' : 'fadeIn'} 0.3s ease-in-out;

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes fadeOut {
        from {
          opacity: 1;
        }
        to {
          opacity: 0;
        }
      }
    `,

    bottomSheet: css`
      width: 100%;
      max-width: 100%;
      background-color: white;
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
      overflow: hidden;
      animation: ${isClosing ? 'slideDown' : 'slideUp'} 0.3s ease-in-out;

      @keyframes slideUp {
        from {
          transform: translateY(100%);
        }
        to {
          transform: translateY(0);
        }
      }

      @keyframes slideDown {
        from {
          transform: translateY(0);
        }
        to {
          transform: translateY(100%);
        }
      }
    `,

    titleContainer: css`
      padding: 16px;
      text-align: center;
      border-bottom: 1px solid #f0f0f0;
      font-weight: 600;
      font-size: 16px;
    `,

    menuItemContainer: css`
      display: flex;
      flex-direction: column;
      width: 100%;
    `,

    menuItem: css`
      padding: 16px;
      border-bottom: 1px solid #f0f0f0;
      text-align: center;
      font-size: 16px;
      cursor: pointer;

      &:active {
        background-color: #f8f8f8;
      }
    `,

    cancelButton: css`
      padding: 16px;
      text-align: center;
      color: #ff4d4f;
      font-weight: 600;
      cursor: pointer;
    `,
  }

  const handleItemClick = (onClick: () => void) => {
    onClick()
    handleClose()
  }

  return (
    <div
      css={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose()
      }}
    >
      <div css={styles.bottomSheet} onClick={(e) => e.stopPropagation()}>
        {title && <div css={styles.titleContainer}>{title}</div>}

        {children ? (
          children
        ) : (
          <div css={styles.menuItemContainer}>
            {menuItems.map((item, index) => (
              <div
                key={index}
                css={styles.menuItem}
                onClick={() => handleItemClick(item.onClick)}
              >
                {item.text}
              </div>
            ))}
          </div>
        )}

        <div css={styles.cancelButton} onClick={handleClose}>
          취소
        </div>
      </div>
    </div>
  )
}

export default BottomSheet
