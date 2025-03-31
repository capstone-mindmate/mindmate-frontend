/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useState } from 'react'

interface FloatingButtonProps {
  buttonText: string
  buttonIcon: React.ReactNode
  onActiveChange?: (isActive: boolean) => void
}

const buttonStyle = (isActive: boolean) => css`
  position: fixed;
  bottom: 100px;
  right: 80px;
  z-index: 5;
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
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    transform: scale(1.03);
  }
`

const FloatingButton: React.FC<FloatingButtonProps> = ({
  buttonText,
  buttonIcon,
  onActiveChange,
}) => {
  const [isActive, setIsActive] = useState(false)

  const handleClick = () => {
    const newActiveState = !isActive
    setIsActive(newActiveState)
    onActiveChange?.(newActiveState)
  }

  return (
    <div className="container">
      <button css={buttonStyle(isActive)} onClick={handleClick}>
        {buttonIcon}
        {buttonText}
      </button>
    </div>
  )
}

export default FloatingButton
