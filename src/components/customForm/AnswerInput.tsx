/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useState } from 'react'

interface AskInputProps {
  title: string
}

const askInputStyles = {
  container: css`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
  `,
  input: (hasValue: boolean) => css`
    width: calc(100% - 32px);
    height: 48px;
    padding: 0 16px;
    border-radius: 8px;
    border: 1px solid ${hasValue ? '#F0DAA9' : '#D9D9D9'};
    background-color: ${hasValue ? '#FFF9EB' : '#FFFFFF'};
    font-size: 14px;
    line-height: 1.4;
    color: #150c06;
    transition: all 0.3s ease;

    &::placeholder {
      color: #a3a3a3;
      transition: all 0.3s ease;
    }

    &:focus {
      outline: none;
      border-color: #f0daa9;
      transition: all 0.3s ease;
    }
  `,
  title: css`
    font-size: 16px;
    line-height: 1.5;
    font-weight: bold;
    color: #150c06;
    margin: 0;
  `,
}

const AskInput = ({ title }: AskInputProps) => {
  const [inputValue, setInputValue] = useState('')

  const hasValue = inputValue.length > 0

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  return (
    <div className="answer-input" css={askInputStyles.container}>
      <p css={askInputStyles.title}>{title}</p>
      <input
        type="text"
        placeholder="답변을 입력해주세요"
        value={inputValue}
        onChange={handleInputChange}
        css={askInputStyles.input(hasValue)}
      />
    </div>
  )
}

export default AskInput
