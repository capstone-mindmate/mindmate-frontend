import React, { useState } from 'react'
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

interface TitleInputBoxProps {
  placeholder: string
  initialValue?: string
  onChange?: (value: string) => void
  titleText?: string
}

const getInputStyle = (isFocused: boolean, isCompleted: boolean) => css`
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
  color: #150c06;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
`

const inputBoxStyle = {
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
}

const TitleInputBox: React.FC<TitleInputBoxProps> = ({
  placeholder,
  initialValue = '',
  onChange,
  titleText,
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [inputValue, setInputValue] = useState(initialValue)

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
    setIsCompleted(inputValue.length > 0)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    onChange?.(newValue)
  }

  return (
    <div css={inputBoxStyle.container}>
      {titleText && <p css={inputBoxStyle.titleText}>{titleText}</p>}
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        css={getInputStyle(isFocused, isCompleted)}
      />
    </div>
  )
}

export default TitleInputBox
