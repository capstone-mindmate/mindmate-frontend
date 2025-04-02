import React, { useState, useRef, useEffect } from 'react'
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

interface YellowInputBoxProps {
  activeState: boolean
  height?: number
  placeholder: string
  value: string
  onChange?: (value: string) => void
  isTitle?: boolean
}

const getTextareaStyle = (isTitle: boolean, height: number) => css`
  width: 100%;
  min-height: ${height > 0 ? `${height}px` : 'auto'};
  border: 1px solid #f0daa9;
  outline: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: ${isTitle ? 'bold' : 'normal'};
  line-height: 1.4;
  background-color: #fff9eb;
  transition: border-color 0.2s ease;
  color: #150c06;
  resize: none;
  overflow-y: hidden;
  font-family: inherit;
  box-sizing: border-box;
`

const inputBoxStyle = {
  container: css`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 14px;
  `,
}

const YellowInputBox: React.FC<YellowInputBoxProps> = ({
  placeholder,
  onChange,
  value = '',
  activeState = true,
  height = 42,
  isTitle = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto' // 높이를 초기화
      textarea.style.height = `${textarea.scrollHeight}px` // 스크롤 높이로 설정
    }
  }

  // 초기 렌더링과 value 변경시 높이 조정
  useEffect(() => {
    adjustHeight()
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    onChange?.(newValue)
    adjustHeight()
  }

  return (
    <div css={inputBoxStyle.container}>
      <textarea
        ref={textareaRef}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        css={getTextareaStyle(isTitle, height)}
        disabled={!activeState}
        rows={1}
      />
    </div>
  )
}

export default YellowInputBox
