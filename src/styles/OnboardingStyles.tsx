/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { media } from './breakpoints'

export const RootContainer = css`
  width: 100%;
  height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

export const OnboardingContainer = css`
  width: 884px;
  height: 100%;
  box-sizing: border-box;

  ${media.tablet} {
    width: 100%;
  }
`

// 페이지 컨테이너
export const pageContainerStyle = css`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 0 24px;
  box-sizing: border-box;
  position: relative;
`

export const contentContainerStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  margin-top: 40px;
  position: relative;
  overflow: hidden;
`

// 슬라이더 스타일
export const containerStyle = css`
  position: relative;
  width: 100%;
`

export const sliderWrapperStyle = css`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: row;
  position: relative;
  height: auto;
`

// 추가된 슬라이드 컨텐츠 스타일 함수
export const slideContentStyle = (
  isActive: boolean,
  _index: number,
  _currentIndex: number,
  isDragging: boolean
) => css`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: ${isActive ? 1 : 0};
  pointer-events: ${isActive ? 'auto' : 'none'};
  user-select: none; // 텍스트 선택 방지
`

export const textContainerStyle = css`
  // padding: 20px 20px 20px 20px;
  text-align: left;
  width: 100%;
  margin-top: 0px;
  box-sizing: border-box;

  ${media.tablet} {
    // padding: 16px;
    // margin-top: 30px;
  }

  ${media.mobileBig} {
    // padding: 12px;
    // margin-top: 20px;
  }
`

//텍스트 페이드 효과
export const textFadeStyle = (isActive: boolean) => css`
  opacity: ${isActive ? 1 : 0};
  transition: opacity 1s ease;
  transform: translateY(${isActive ? 0 : 10}px);
`

export const head2BoldStyle = css`
  font-size: 24px;
  font-weight: bold;
  line-height: 1.4;
  white-space: pre-line;
  color: #000;
  margin-bottom: 8px;
  width: 100%;
  overflow-wrap: break-word; // 긴 단어 줄바꿈
  word-wrap: break-word; // 긴 단어 줄바꿈

  ${media.tablet} {
    font-size: 22px;
    margin-bottom: 6px;
  }

  ${media.mobileBig} {
    font-size: 20px;
    margin-bottom: 4px;
  }
`

export const body2ReStyle = css`
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-line;
  color: #666;
  width: 100%;
  overflow-wrap: break-word; // 긴 단어 줄바꿈
  word-wrap: break-word; // 긴 단어 줄바꿈

  ${media.tablet} {
    font-size: 13px;
  }

  ${media.mobileBig} {
    font-size: 12px;
  }
`

// 이모티콘
export const emoticonContainerStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  padding: 20px 0;
  position: relative;

  ${media.tablet} {
    padding: 16px 0;
  }

  ${media.mobileBig} {
    padding: 12px 0;
  }
`

// 추가된 이모티콘 슬라이드 스타일
export const emoticonSlideStyle = (
  _isActive: boolean,
  _index: number,
  _currentIndex: number,
  slideOffset: number,
  isDragging: boolean
) => css`
  transform: translateX(${slideOffset}%);
  transition: ${isDragging ? 'none' : 'transform 0.5s ease'};
`

// 프로그레스바 스타일
export const progressBarContainerStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
  margin-top: 20px;

  ${media.tablet} {
    margin-bottom: 16px;
    margin-top: 16px;
  }

  ${media.mobileBig} {
    margin-bottom: 12px;
    margin-top: 12px;
  }
`

export const progressBarDotsContainerStyle = css`
  display: flex;
  gap: 8px;
  justify-content: center;

  ${media.mobileBig} {
    gap: 6px;
  }
`

export const progressDotStyle = (isActive: boolean) => css`
  width: ${isActive ? '35px' : '8px'};
  height: 12px;
  border-radius: 8px;
  background-color: ${isActive ? '#392111' : '#D9D9D9'};
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;

  ${media.tablet} {
    width: ${isActive ? '30px' : '7px'};
    height: 10px;
    border-radius: 7px;
  }

  ${media.mobileBig} {
    width: ${isActive ? '25px' : '6px'};
    height: 8px;
    border-radius: 6px;
  }
`

// 버튼 스타일
export const buttonContainerStyle = css`
  // padding: 0 0 70px;
  width: 100%;
  // margin: 0 24px;
  justify-content: center;
  position: absolute;
  bottom: 50px;
  ${media.tablet} {
    // padding: 0 0 70px;
    // margin: 0 24px;
  }

  ${media.mobileBig} {
    // padding: 0 0 100px;
  }
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

  ${media.tablet} {
    height: 40px;
    font-size: 13px;
  }

  ${media.mobileBig} {
    height: 36px;
    font-size: 12px;
  }
`

export const iconStyle = css`
  margin-right: 8px;
  width: 18px;
  height: 18px;

  ${media.tablet} {
    width: 16px;
    height: 16px;
  }

  ${media.mobileBig} {
    width: 14px;
    height: 14px;
  }
`
