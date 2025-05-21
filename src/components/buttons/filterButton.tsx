/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useState, useEffect } from 'react'

interface FilterButtonProps {
  buttonText: string
  onActiveChange?: (isActive: boolean) => void
  isActive?: boolean
}

const buttonStyle = (isActive: boolean) => css`
  width: auto;
  height: 32px;
  background-color: ${isActive ? '#393939' : '#ffffff'};
  color: ${isActive ? '#FFFFFF' : '#727272'};
  border: 1px solid ${isActive ? '#393939' : '#D9D9D9'};
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

const FilterButton: React.FC<FilterButtonProps> = ({
  buttonText,
  onActiveChange,
  isActive: externalIsActive,
}) => {
  const [internalIsActive, setInternalIsActive] = useState(false)

  const isActive =
    externalIsActive !== undefined ? externalIsActive : internalIsActive

  useEffect(() => {
    if (externalIsActive !== undefined) {
      setInternalIsActive(externalIsActive)
    }
  }, [externalIsActive])

  const handleClick = () => {
    const newActiveState = !isActive

    if (externalIsActive === undefined) {
      setInternalIsActive(newActiveState)
    }

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

export default FilterButton
