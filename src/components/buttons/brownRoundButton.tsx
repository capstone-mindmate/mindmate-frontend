/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useState } from 'react'

interface BrownRoundButtonProps {
  buttonText: string
  onActiveChange?: (isActive: boolean) => void
}

const buttonStyle = (isActive: boolean) => css`
  width: auto;
  height: 32px;
  background-color: ${isActive ? '#5C351B' : '#ffffff'};
  color: ${isActive ? '#FFFFFF' : '#727272'};
  border: 1px solid ${isActive ? '#5C351B' : '#D9D9D9'};
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: ${isActive ? 'bold' : 'normal'};
  line-height: 1.4;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
`

const BrownRoundButton: React.FC<BrownRoundButtonProps> = ({
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
      <button css={buttonStyle(isActive)} onClick={handleClick}>
        {buttonText}
      </button>
    </div>
  )
}

export default BrownRoundButton
