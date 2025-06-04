/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import React, { useState, useRef, useEffect } from 'react'
import { useToast } from '../toast/ToastProvider'

interface YellowInputBoxProps {
  activeState: boolean
  height?: number
  placeholder: string
  value: string
  onChange?: (value: string) => void
  isTitle?: boolean
  maxLength?: number
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
  overflow-y: auto;
  font-family: inherit;
  box-sizing: border-box;
  -webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
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
  value: externalValue = '',
  activeState = true,
  height = 42,
  isTitle = false,
  maxLength = 20,
}) => {
  const [value, setValue] = useState(externalValue)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { showToast } = useToast()

  const adjustHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }

  useEffect(() => {
    adjustHeight()
    setValue(externalValue)
  }, [externalValue])

  useEffect(() => {
    adjustHeight()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let newValue = e.target.value
    console.log(newValue.length)
    if (newValue.length >= maxLength) {
      showToast(`최대 ${maxLength}자까지 입력 가능합니다.`, 'warning')
      newValue = newValue.slice(0, maxLength)
    }
    adjustHeight()
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
        maxLength={maxLength}
      />
    </div>
  )
}

export default YellowInputBox
