import React, { useState } from 'react'
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

interface TitleSelectBoxProps {
  placeholder: string
  options: string[]
  initialValue?: string
  onChange?: (value: string) => void
  titleText?: string
}

const getSelectStyle = (
  isFocused: boolean,
  isCompleted: boolean,
  hasValue: boolean
) => css`
  width: 100%;
  border: 1px solid
    ${isCompleted ? '#1B5BFE' : isFocused ? '#392111' : '#D9D9D9'};
  outline: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.4;
  background-color: #ffffff;
  transition: border-color 0.2s ease;
  color: ${hasValue ? '#150c06' : '#A3A3A3'};
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg width='14' height='8' viewBox='0 0 14 8' fill='none' xmlns='https://www.w3.org/2000/svg'%3e%3cpath d='M1 1L7 7L13 1' stroke='%23150C06' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  cursor: pointer;

  &:hover {
    border-color: ${isCompleted ? '#1B5BFE' : '#392111'};
  }
`

const selectBoxStyle = {
  container: css`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 14px;
  `,
  titleText: css`
    font-size: 14px;
    line-height: 1.4;
    color: #150c06;
    margin: 0;
  `,
  option: css`
    font-size: 14px;
    line-height: 1.4;
    color: #150c06;
    padding: 8px 12px;

    &:hover {
      background-color: #f5f5f5;
    }
  `,
  placeholder: css`
    color: #a3a3a3;
  `,
}

const TitleSelectBox: React.FC<TitleSelectBoxProps> = ({
  placeholder,
  options,
  initialValue = '',
  onChange,
  titleText,
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [selectedValue, setSelectedValue] = useState(initialValue)

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
    setIsCompleted(selectedValue.length > 0)
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value
    setSelectedValue(newValue)
    setIsCompleted(newValue.length > 0)
    onChange?.(newValue)
  }

  return (
    <div css={selectBoxStyle.container}>
      {titleText && <p css={selectBoxStyle.titleText}>{titleText}</p>}
      <select
        value={selectedValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        css={getSelectStyle(isFocused, isCompleted, selectedValue !== '')}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map((option, index) => (
          <option key={index} value={option} css={selectBoxStyle.option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

export default TitleSelectBox
