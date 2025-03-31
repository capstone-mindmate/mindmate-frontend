/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useState } from 'react'

interface ReportItemProps {
  reportText: string
  onActiveChange?: (isActive: boolean) => void
}

const buttonStyle = (isActive: boolean) => css`
  width: 100%;
  height: 52px;
  background-color: #ffffff;
  color: #000000;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  font-size: 16px;
  line-height: 1.5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  cursor: pointer;
  transition: all 0.2s ease;

  ${isActive &&
  `
    border: 1px solid #392111;
    background-color: #FFFFFF;
  `}
`

const circleStyle = (isActive: boolean) => css`
  width: 21px;
  height: 21px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 3px solid ${isActive ? '#392111' : '#E8E8E8'};
  background-color: #ffffff;
  transition: all 0.2s ease;
`

const innercircleStyle = (isActive: boolean) => css`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: ${isActive ? '#392111' : '#ffffff'};
  transition: all 0.2s ease;
`

export const ReportItem: React.FC<ReportItemProps> = ({
  reportText,
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
      <button css={buttonStyle(isActive)} onClick={handleClick}>
        <span>{reportText}</span>
        <div css={circleStyle(isActive)}>
          <div css={innercircleStyle(isActive)} />
        </div>
      </button>
    </div>
  )
}

interface ReportButtonProps {
  onActiveChange?: (isActive: boolean) => void
}

const ReportButtonStyle = (isActive: boolean) => css`
  width: 100%;
  height: 50px;
  background-color: ${isActive ? '#FB4F50' : '#D9D9D9'};
  color: ${isActive ? '#ffffff' : '#A3A3A3'};
  border: none;
  border-radius: 8px;
  font-size: 16px;
  line-height: 1.5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  cursor: pointer;
  transition: all 0.2s ease;
`

export const ReportButton: React.FC<ReportButtonProps> = ({
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
      <button css={ReportButtonStyle(isActive)} onClick={handleClick}>
        <span>신고하기</span>
      </button>
    </div>
  )
}
