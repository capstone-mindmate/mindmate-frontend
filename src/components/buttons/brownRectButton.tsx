/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useState } from 'react'

interface BrownRectButtonProps {
  buttonText: string
  onActiveChange?: (isActive: boolean) => void
}

const buttonStyle = css`
  width: 95%;
  height: 50px;
  background-color: #392111;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  line-height: 1.5;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
`

const BrownRectButton: React.FC<BrownRectButtonProps> = ({
  buttonText,
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
      <button css={buttonStyle} onClick={handleClick}>
        {buttonText}
      </button>
    </div>
  )
}

export default BrownRectButton
