import { css } from '@emotion/react'

// 이모티콘 버튼 스타일
export const emoticonButtonStyles = css`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: transparent;
  border: none;
  margin: 0 5px;
  padding: 0;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 2px;
  }

  svg {
    width: 18px;
    height: 18px;
    fill: #000;
  }
`

// 이모티콘 피커 오버레이 스타일
export const emoticonPickerOverlayStyles = css`
  position: absolute;
  z-index: 100;
  left: 0;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: white;
`
