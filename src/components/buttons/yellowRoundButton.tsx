/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useState, useEffect } from 'react'

interface YellowRoundButtonProps {
  buttonText: string
  onActiveChange?: (isActive: boolean) => void
  isControlled?: boolean
  isActive?: boolean
}

const buttonStyle = (isActive: boolean) => css`
  width: auto;
  height: 32px;
  background-color: ${isActive ? '#FFF9EB' : '#ffffff'};
  color: ${isActive ? '#392111' : '#727272'};
  border: 1px solid ${isActive ? '#F0DAA9' : '#D9D9D9'};
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

const YellowRoundButton: React.FC<YellowRoundButtonProps> = ({
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

export default YellowRoundButton
