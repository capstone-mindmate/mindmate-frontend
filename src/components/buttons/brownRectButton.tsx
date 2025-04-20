/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useState } from 'react'

interface BrownRectButtonProps {
  buttonText: string
  onActiveChange?: (isActive: boolean) => void
  isEnabled?: boolean
}

const getButtonStyle = (isEnabled: boolean) => css`
  width: 100%;
  height: 50px;
  background-color: ${isEnabled ? '#392111' : '#D9D9D9'};
  color: ${isEnabled ? '#ffffff' : '#A3A3A3'};
  border: none;
  border-radius: 8px;
  font-size: 16px;
  line-height: 1.5;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${isEnabled ? 'pointer' : 'default'};
  transition: all 0.3s ease;
`

const BrownRectButton: React.FC<BrownRectButtonProps> = ({
  buttonText,
  onActiveChange,
  isEnabled = true,
}) => {
  const [isActive, setIsActive] = useState(false)

  const handleClick = () => {
    if (!isEnabled) return

    const newActiveState = !isActive
    setIsActive(newActiveState)
    onActiveChange?.(newActiveState)
  }

  return (
    <div className="container">
      <button css={getButtonStyle(isEnabled)} onClick={handleClick}>
        {buttonText}
      </button>
    </div>
  )
}

export default BrownRectButton
