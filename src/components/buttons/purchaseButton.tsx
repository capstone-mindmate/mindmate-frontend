/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useState } from 'react'

interface PurchaseButtonProps {
  priceText: number
  onActiveChange?: (isActive: boolean) => void
}

const buttonStyle = css`
  width: auto;
  height: 32px;
  background-color: #392111;
  color: #ffffff;
  border: none;
  padding: 6px 14px;
  border-radius: 4px;
  font-size: 14px;
  line-height: 1.4;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
`

const priceTextStyle = css`
  font-size: 14px;
  line-height: 1.4;
  margin: 0;
`

const PurchaseButton: React.FC<PurchaseButtonProps> = ({
  priceText,
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
        <p css={priceTextStyle}>
          {priceText.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
        </p>
      </button>
    </div>
  )
}

export default PurchaseButton
