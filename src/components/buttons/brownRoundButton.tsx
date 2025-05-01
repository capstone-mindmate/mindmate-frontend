/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useState, useEffect } from 'react'

interface BrownRoundButtonProps {
  buttonText: string
  onActiveChange?: (isActive: boolean) => void
  isControlled?: boolean
  isActive?: boolean
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
  isControlled = false,
  isActive: externalIsActive = false,
}) => {
  const [internalIsActive, setInternalIsActive] = useState(false)

  const isActive = isControlled ? externalIsActive : internalIsActive

  useEffect(() => {
    if (isControlled) {
      setInternalIsActive(externalIsActive)
    }
  }, [isControlled, externalIsActive])

  const handleClick = () => {
    if (!isControlled) {
      const newActiveState = !internalIsActive
      setInternalIsActive(newActiveState)
      onActiveChange?.(newActiveState)
    } else {
      onActiveChange?.(!externalIsActive)
    }
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
