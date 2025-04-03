import { css } from '@emotion/react'

// 이모티콘 컨테이너 스타일
export const emoticonContainerStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`

// 이모티콘 이미지 스타일
export const emoticonImageStyles = css`
  width: 100%;
  height: 100%;
  object-fit: contain;
  user-select: none;
`

// 이모티콘 목록 컨테이너 스타일
export const emoticonListContainerStyles = css`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  padding: 15px;
  justify-content: center;
`

// 이모티콘 선택 시 강조 스타일
export const selectedEmoticonStyles = css`
  box-shadow: 0 0 0 3px #a67c52;
`

// 이모티콘 비활성화 스타일
export const disabledEmoticonStyles = css`
  opacity: 0.5;
  cursor: not-allowed;

  &:hover {
    transform: none;
  }
`

// 채팅에서 사용될 때의 이모티콘 크기 스타일
export const chatEmoticonContainerStyles = css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 8px;
`
