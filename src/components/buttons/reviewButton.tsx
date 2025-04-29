/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useState } from 'react'

interface ReviewButtonProps {
  reviewText: string
  onActiveChange?: (isActive: boolean) => void
}

const buttonStyle = (isActive: boolean) => css`
  width: auto;
  height: 38px;
  background-color: ${isActive ? '#FFFCF5' : '#FFFFFF'};
  color: #393939;
  border: 1px solid ${isActive ? '#F0DAA9' : '#D9D9D9'};
  padding: 9px 16px;
  border-radius: 40px;
  font-size: 14px;
  font-weight: bold;
  line-height: 1.4;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
`

const ReviewButton: React.FC<ReviewButtonProps> = ({
  reviewText,
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
        {reviewText}
      </button>
    </div>
  )
}

export default ReviewButton
