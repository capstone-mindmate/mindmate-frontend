/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useState } from 'react'
import { CloseIcon } from '../icon/iconComponents'

interface AskInputProps {
  placeHolder: string
  onCloseBtnClick: () => void
}

const askInputStyles = {
  container: css`
    position: relative;
    width: 100%;
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
    }

    &:focus {
      outline: none;
      border-color: #f0daa9;
    }
  `,
  closeButton: (hasValue: boolean) => css`
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    cursor: ${hasValue ? 'pointer' : 'default'};
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    padding: 0;
    transition: all 0.3s ease;
  `,
}

const AskInput = ({ placeHolder, onCloseBtnClick }: AskInputProps) => {
  const [inputValue, setInputValue] = useState('')
  const hasValue = inputValue.length > 0

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleCloseClick = () => {
    if (hasValue) {
      setInputValue('')
      onCloseBtnClick()
    }
  }

  return (
    <div className="ask-input" css={askInputStyles.container}>
      <input
        type="text"
        placeholder={placeHolder}
        value={inputValue}
        onChange={handleInputChange}
        css={askInputStyles.input(hasValue)}
      />
      <button onClick={() => {}} css={askInputStyles.closeButton(hasValue)}>
        <CloseIcon
          width={24}
          height={24}
          color={hasValue ? '#000000' : '#A3A3A3'}
        />
      </button>
    </div>
  )
}

export default AskInput
