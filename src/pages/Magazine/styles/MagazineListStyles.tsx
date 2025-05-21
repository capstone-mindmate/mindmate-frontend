// MagazineListStyles.tsx - 애니메이션 스타일 추가

import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { media } from '../../../styles/breakpoints'

// 기본 컨테이너 스타일
export const MagazineListContainer = styled.div`
  width: 100%;
  max-width: 884px;
  margin: 20px auto 0 auto;
  position: relative;

  .magazine-content {
    margin: 0 24px;
    padding-top: 20px;
  }

  @media (max-width: 768px) {
    .magazine-content {
      margin: 0 16px;
    }
  }
`

// 컨텐츠 래퍼 - 매거진 컨텐츠를 감싸는 컨테이너
export const ContentWrapper = styled.div`
  width: 100%;
  position: relative;
  z-index: 1; // 네비게이션보다 낮은 z-index 값을 갖습니다
  padding-bottom: 0px; // 네비게이션 바 높이만큼 여백 추가
`

// 네비게이션 래퍼 - 네비게이션 컴포넌트를 감싸는 컨테이너
export const NavigationWrapper = styled.div`
  width: 100%;
  position: relative;
  z-index: 1001; // 컨텐츠보다 높은 z-index 값을 갖습니다
`

// TopFixedContent 스타일
export const TopFixedContent = styled.div<{ fixedType: 'normal' | 'matched' }>`
  width: 884px;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  margin: auto;
  ${({ fixedType }) => (fixedType === 'normal' ? 'top: 0;' : 'top: 57px;')}
  z-index: 100;
  background-color: #ffffff;

  ${media.tablet} {
    width: 100%;
  }
`

// MatchingTopBar
export const MatchingTopBar = styled.div`
  width: 100%;
  height: 56px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-sizing: border-box;
`

// TopBarTitle
export const TopBarTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  line-height: 1.5;
  margin: 0 4px;
  user-select: none;
`

// IconList
export const IconList = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  align-items: center;
  justify-content: center;
  margin-left: auto;
`

// 카테고리 컨테이너
export const CategoryContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  justify-content: flex-start;
  padding: 8px 24px 0;
  overflow-x: auto;
  white-space: nowrap;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`

// 정렬 옵션 스타일
export const SortOptionsContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  padding: 8px 24px;
  box-sizing: border-box;
`

// 매거진 콘텐츠 스타일
export const MagazineContent = styled.div`
  margin: 0 24px;
  padding-top: 104px;
  transition: opacity 0.3s ease;
`

export const LoadingContainer = styled.div`
  text-align: center;
  padding: 20px;
`

export const EmptyMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #888;
`

// 무한 스크롤 로딩 컨테이너
export const InfiniteScrollLoader = styled.div`
  display: flex;
  justify-content: center;
  padding: 16px 0;
  margin-top: 8px;
`

// 공통 스타일
export const backButtonStyle = css`
  cursor: pointer;
`

export const iconStyle = css`
  cursor: pointer;
`

// 애니메이션 컨테이너 추가
export const AnimatedMagazineContainer = styled.div`
  .magazine-container {
    transition: opacity 0.3s ease;
  }

  /* 매거진 아이템 애니메이션 스타일 */
  .magazine-item {
    transition: all 0.5s ease;
    will-change: transform, opacity;

    &:hover {
      transform: translateY(-5px) !important;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }

    &.reorder-animation {
      animation: reorderPulse 0.6s ease forwards;
    }
  }

  /* 정렬 변경 시 사용할 애니메이션 */
  @keyframes reorderPulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
    100% {
      transform: scale(1);
    }
  }
`

// 정렬 애니메이션을 위한 오버레이
export const SortingOverlay = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 90;
  pointer-events: ${(props) => (props.visible ? 'auto' : 'none')};
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transition: opacity 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;

  .sorting-message {
    background-color: #fff;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    font-weight: 500;
    color: #392111;
  }
`

// 하위 호환성을 위한 deprecated 스타일 (기존 코드가 참조할 수 있음)
export const CategorySelect = styled.select`
  border: none;
  color: #392111;
  background: transparent;
  font-size: 16px;
  font-weight: 400;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;
  text-align: center;
  padding: 0 20px 0 0;
  display: inline-block;

  &:focus {
    outline: none;
  }

  /* 화살표 스타일링 */
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='https://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath fill='none' stroke='%23392111' stroke-width='1.5' d='M1 1l4 4 4-4'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right center;

  option {
    font-size: 14px;
    background: #ffffff;
    padding: 8px;
  }
`

// 기존에 사용하던 스타일들 (제거하지 않음)
export const MagazineTopBar = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 24px;
  box-sizing: border-box;
  background-color: #ffffff;
  position: relative;
  z-index: 900;
`

export const TopBarWrapper = styled.div`
  position: relative;
  z-index: 900;
`
