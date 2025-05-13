/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

// 검색 바 스타일
export const searchBarStyle = (isSearchActive: boolean) => css`
  position: absolute;
  top: 0;
  left: 0;
  width: ${isSearchActive ? '100%' : '0'};
  height: 48px;
  background-color: white;
  z-index: 1000;
  display: flex;
  align-items: center;
  padding: ${isSearchActive ? '0 24px' : '0'};
  margin: ${isSearchActive ? '7px 0' : '0'};
  transition: all 0.3s ease;
  overflow: hidden;
  box-sizing: border-box;
  opacity: ${isSearchActive ? 1 : 0};
`

// 검색 입력 필드 스타일
export const searchInputStyle = (isSearchActive: boolean) => css`
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  padding: 8px 20px;
  color: #392111;
  opacity: ${isSearchActive ? 1 : 0};
  transition: opacity 0.2s ease 0.2s;
  &::placeholder {
    color: #aaa;
  }
  background-color: whitesmoke;
  box-sizing: border-box;
  border-radius: 20px;
`

// 검색 닫기 버튼 스타일
export const closeButtonStyle = (isSearchActive: boolean) => css`
  cursor: pointer;
  margin-left: 12px;
  opacity: ${isSearchActive ? 1 : 0};
  transition: opacity 0.2s ease 0.2s;
`

// 검색 아이콘 스타일
export const searchIconStyle = css`
  cursor: pointer;
`

// 정렬 옵션 컨테이너 스타일
export const optionsContainerStyle = css`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`

// 무한 스크롤 로딩 인디케이터 스타일
export const infiniteScrollLoaderStyle = css`
  padding: 20px;
  text-align: center;
  height: 60px;
`
