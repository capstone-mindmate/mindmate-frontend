/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useState } from 'react'

interface CategoryButtonProps {
  buttonText: string
  onActiveChange?: (isActive: boolean) => void
  widthType?: 'default' | 'full' | 'half'
}

const buttonStyle = (isActive: boolean) => css`
  width: 100%;
  height: 68px;
  background-color: ${isActive ? '#FFF9EB' : '#FFFFFF'};
  color: ${isActive ? '#392111' : '#727272'};
  border: 1px solid ${isActive ? '#F0DAA9' : '#D9D9D9'};
  border-radius: 10px;
  font-size: 16px;
  font-weight: ${isActive ? 'bold' : 'normal'};
  line-height: 1.5;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
`

const CategoryButton: React.FC<CategoryButtonProps> = ({
  buttonText,
  onActiveChange,
  widthType = 'default',
}) => {
  const [isActive, setIsActive] = useState(false)

  const handleClick = () => {
    const newActiveState = !isActive
    setIsActive(newActiveState)
    onActiveChange?.(newActiveState)
  }

  return (
    <div
      className="container"
      style={{
        width:
          widthType === 'full'
            ? '100%'
            : widthType === 'half'
              ? '48%'
              : '165px',
      }}
    >
      <button css={buttonStyle(isActive)} onClick={handleClick}>
        {buttonText}
      </button>
    </div>
  )
}

export default CategoryButton
