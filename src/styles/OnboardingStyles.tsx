/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

// 컨테이너 스타일
export const pageContainerStyle = css`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 0;
  box-sizing: border-box;
`

// 프로그레스바 스타일
export const progressBarContainerStyle = css`
  height: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fix;
`

export const buttonContainerStyle = css`
  padding: 0 20px 40px;
  position: fix;
  margin-top: auto;
  background-color: white;
`

export const headerStyle = css`
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
`

export const contentContainerStyle = css`
  display: flex;
  flex-direction: column;
  flex: 1;
`

// 텍스트 스타일
export const textContainerStyle = css`
  padding: 20px;
`

export const head2BoldStyle = css`
  font-size: 24px;
  font-weight: bold;
  line-height: 1.4;
  white-space: pre-line;
  color: #000;
  margin-bottom: 8px;
`

export const body2ReStyle = css`
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-line;
  color: #666;
`

// 이모티콘 스타일
export const emoticonContainerStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
`

export const googleButtonStyle = css`
  width: 100%;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: white;
  cursor: pointer;
  font-size: 14px;
  color: #333;
`

export const iconStyle = css`
  margin-right: 8px;
  width: 18px;
  height: 18px;
`

// 슬라이드 스타일
export const emptySlideStyle = css`
  width: 100%;
  justify-content: center;
  align-items: center;
  background: transparent;
`
