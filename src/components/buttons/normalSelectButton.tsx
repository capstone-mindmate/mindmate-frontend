/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useState, useEffect, ChangeEvent } from 'react'

interface NormalSelectButtonProps {
  options: string[]
  onChange?: (value: string, isActive: boolean) => void
  initialValue?: string
}

const selectStyles = {
  container: css`
    display: inline-block;
    position: relative;
  `,

  select: (isActive: boolean) => css`
    min-width: 80px;
    height: 32px;
    background-color: ${isActive ? '#FFF9EB' : '#ffffff'};
    color: ${isActive ? '#392111' : '#727272'};
    border: 1px solid ${isActive ? '#F0DAA9' : '#D9D9D9'};
    border-radius: 20px;
    padding: 6px 36px 6px 16px; /* 오른쪽 패딩 증가 */
    font-size: 14px;
    font-weight: ${isActive ? 'bold' : 'normal'};
    line-height: 1.4;
    display: flex;
    align-items: center;
    white-space: nowrap;
    text-overflow: ellipsis;

    width: auto;
    transition:
      all 0.3s ease,
      width 0.3s ease,
      padding 0.3s ease;

    appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg width='12' height='6' viewBox='0 0 14 8' fill='none' xmlns='https://www.w3.org/2000/svg'%3e%3cpath d='M1 1L7 7L13 1' stroke='%23150C06' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 12px center; /* 화살표 위치 조정 */
    background-size: 14px;
    cursor: pointer;

    &:focus {
      outline: none;
      border-color: ${isActive ? '#E9C989' : '#BBBBBB'};
    }

    box-sizing: border-box;
  `,

  option: css`
    color: #392111;
    font-weight: normal;
    padding: 8px 12px;

    &:hover {
      background-color: #fff9eb;
    }
  `,
}

const NormalSelectButton = ({
  options,
  onChange,
  initialValue = '',
}: NormalSelectButtonProps) => {
  const allOptions = ['선택 안함', ...options]

  const getInitialSelectedOption = () => {
    if (initialValue && options.includes(initialValue)) {
      return initialValue
    }
    return '선택 안함'
  }

  const [selectedOption, setSelectedOption] = useState(
    getInitialSelectedOption()
  )
  const [isActive, setIsActive] = useState(selectedOption !== '선택 안함')
  const [width, setWidth] = useState('auto')

  useEffect(() => {
    const calculateWidth = () => {
      const displayText = getDisplayValue(selectedOption)
      const tempSpan = document.createElement('span')
      tempSpan.style.visibility = 'hidden'
      tempSpan.style.position = 'absolute'
      tempSpan.style.fontSize = '14px'
      tempSpan.style.fontWeight = isActive ? 'bold' : 'normal'
      tempSpan.style.whiteSpace = 'nowrap'
      tempSpan.innerHTML = displayText
      document.body.appendChild(tempSpan)

      const textWidth = tempSpan.offsetWidth
      const calculatedWidth = Math.max(80, textWidth + 60)

      document.body.removeChild(tempSpan)
      return `${calculatedWidth}px`
    }

    setWidth(calculateWidth())
  }, [selectedOption, isActive])

  useEffect(() => {
    if (initialValue && options.includes(initialValue)) {
      setSelectedOption(initialValue)
      setIsActive(true)
    }
  }, [initialValue, options])

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    const isSelected = value !== '선택 안함'

    setSelectedOption(value)
    setIsActive(isSelected)

    if (onChange) {
      onChange(value, isSelected)
    }
  }

  const getDisplayValue = (value: string) => {
    return value === '선택 안함' ? '선택 안함' : value
  }

  return (
    <div className="container" css={selectStyles.container}>
      <select
        value={selectedOption}
        onChange={handleChange}
        css={[
          selectStyles.select(isActive),
          css`
            width: ${width};
          `,
        ]}
      >
        {allOptions.map((option, index) => (
          <option key={index} value={option} css={selectStyles.option}>
            {getDisplayValue(option)}
          </option>
        ))}
      </select>
    </div>
  )
}

export default NormalSelectButton
