import React, { useRef, useEffect, useState } from 'react'
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

interface GrayInputBoxProps {
  activeState: boolean
  height?: number
  placeholder: string
  value: string
  onChange?: (value: string) => void
  isTitle?: boolean
}

const getTextareaStyle = (isTitle: boolean, height: number) => css`
  width: 100%;
  height: ${height > 0 ? `${height}px` : 'auto'};
  border: 1px solid #d9d9d9;
  outline: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: ${isTitle ? 'bold' : 'normal'};
  line-height: 1.4;
  background-color: #f5f5f5;
  transition: border-color 0.2s ease;
  color: #150c06;
  resize: none;
  overflow-y: auto;
  font-family: inherit;
  box-sizing: border-box;
  margin-top: 4px;
`

const inputBoxStyle = {
  container: css`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 14px;
  `,
}

const GrayInputBox: React.FC<GrayInputBoxProps> = ({
  placeholder,
  onChange,
  value: externalValue = '',
  activeState = true,
  height = 42,
  isTitle = false,
}) => {
  const [value, setValue] = useState(externalValue)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 외부 value가 변경될 때 내부 상태 동기화
  useEffect(() => {
    setValue(externalValue)
  }, [externalValue])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    onChange?.(newValue)
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

export default GrayInputBox
