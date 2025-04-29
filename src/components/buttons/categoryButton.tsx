/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useState, useEffect } from 'react'
import { media } from '../../styles/breakpoints'
interface CategoryButtonProps {
  buttonText: string
  onActiveChange?: (isActive: boolean) => void
  widthType: 'full' | 'half'
  initialActive?: boolean
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
  widthType = 'full',
  initialActive = false,
}) => {
  const [isActive, setIsActive] = useState(initialActive)

  useEffect(() => {
    setIsActive(initialActive)
  }, [initialActive])

  const handleClick = () => {
    const newActiveState = !isActive
    setIsActive(newActiveState)
    onActiveChange?.(newActiveState)
  }

  return (
    <div
      css={[
        buttonStyle(isActive),
        widthType === 'half'
          ? css`
              width: 48%;

              ${media.mobileSmall} {
                width: 46%;
              }
            `
          : css`
              width: 100%;
            `,
      ]}
      onClick={handleClick}
    >
      {buttonText}
    </div>
  )
}

export default CategoryButton
