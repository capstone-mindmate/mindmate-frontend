import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'

/// 프레임 슬라이더 컨테이너
export const FrameSlider = styled.div`
  width: 100%;
  position: relative;
  overflow: hidden;
`

// 모든 프레임이 오른쪽에서 왼쪽으로 이동하는 애니메이션
const slideLeft = keyframes`
  0% {
    transform: translateX(80%) scale(0.70);
  }
  100% {
    transform: translateX(-80%) scale(0.70);
  }
`

// 왼쪽에서 오른쪽으로 이동하는 애니메이션 추가
const slideRight = keyframes`
  0% {
    transform: translateX(-80%) scale(0.70);
  }
  100% {
    transform: translateX(80%) scale(0.70);
  }
`

// 오른쪽 프레임이 중앙으로 이동하는 애니메이션
const slideToCenter = keyframes`
  0% {
    transform: translateX(80%) scale(0.70);
    opacity: 0.85;
    filter: brightness(0.9);
  }
  100% {
    transform: translateX(0) scale(0.80);
    opacity: 1;
    filter: brightness(1);
  }
`

// 왼쪽 프레임이 중앙으로 이동하는 애니메이션 추가
const slideToCenterFromLeft = keyframes`
  0% {
    transform: translateX(-80%) scale(0.70);
    opacity: 0.85;
    filter: brightness(0.9);
  }
  100% {
    transform: translateX(0) scale(0.80);
    opacity: 1;
    filter: brightness(1);
  }
`

// 중앙 프레임이 왼쪽으로 이동하는 애니메이션
const slideFromCenter = keyframes`
  0% {
    transform: translateX(0) scale(0.80);
    opacity: 1;
    filter: brightness(1);
  }
  100% {
    transform: translateX(-80%) scale(0.70);
    opacity: 0.85;
    filter: brightness(0.9);
  }
`

// 중앙 프레임이 오른쪽으로 이동하는 애니메이션 추가
const slideFromCenterToRight = keyframes`
  0% {
    transform: translateX(0) scale(0.80);
    opacity: 1;
    filter: brightness(1);
  }
  100% {
    transform: translateX(80%) scale(0.70);
    opacity: 0.85;
    filter: brightness(0.9);
  }
`

// 가장 왼쪽 프레임에 대한 애니메이션
const slideFarLeft = keyframes`
  0% {
    transform: translateX(-160%) scale(0.70);
    opacity: 0;
  }
  100% {
    transform: translateX(-80%) scale(0.70);
    opacity: 0.85;
  }
`

// 가장 오른쪽 프레임에 대한 애니메이션
const slideFarRight = keyframes`
  0% {
    transform: translateX(160%) scale(0.70);
    opacity: 0;
  }
  100% {
    transform: translateX(80%) scale(0.70);
    opacity: 0.85;
  }
`

// 가장 왼쪽 프레임이 더 왼쪽으로 이동하는 애니메이션
const slideFarLeftToFarther = keyframes`
  0% {
    transform: translateX(-160%) scale(0.70);
    opacity: 0;
  }
  100% {
    transform: translateX(-240%) scale(0.70);
    opacity: 0;
  }
`

// 가장 오른쪽 프레임이 더 오른쪽으로 이동하는 애니메이션
const slideFarRightToFarther = keyframes`
  0% {
    transform: translateX(160%) scale(0.70);
    opacity: 0;
  }
  100% {
    transform: translateX(240%) scale(0.70);
    opacity: 0;
  }
`

// 프레임 래퍼 (슬라이드 애니메이션용)
export const FrameWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  position: relative;
  height: 330px;
  width: 100%;
  overflow: hidden;

  .frame-item {
    position: absolute;
    transition: all 0.5s ease;
    will-change: transform, opacity, filter;
    cursor: pointer;
    backface-visibility: hidden;
    perspective: 1000px;
    transform-style: preserve-3d;
    width: 280px; /* 모든 프레임에 동일한 너비 적용 */
    height: 230px; /* 모든 프레임에 동일한 높이 적용 */

    &.far-prev {
      transform: translateX(-160%) scale(0);
      opacity: 0;
      z-index: 0;

      &.animating.to-left {
        animation: ${slideFarLeftToFarther} 0.5s ease forwards;
        opacity: 0;
      }

      &.animating.to-right {
        animation: ${slideFarLeft} 0.5s ease forwards;
        opacity: 0.85;
      }
    }

    &.prev {
      transform: translateX(-80%) scale(0.7);
      opacity: 0.85;
      filter: brightness(0.9);
      z-index: 1;

      &:hover {
        transform: translateX(-85%) scale(0.75);
      }

      &.animating.to-left {
        animation: ${slideLeft} 0.5s ease forwards;
      }

      &.animating.to-right {
        animation: ${slideToCenterFromLeft} 0.5s ease forwards;
        z-index: 2;
      }
    }

    &.current {
      transform: translateX(0) scale(0.8);
      opacity: 1;
      filter: brightness(1);
      z-index: 3;

      &.animating.to-left {
        animation: ${slideFromCenter} 0.5s ease forwards;
        z-index: 2;
      }

      &.animating.to-right {
        animation: ${slideFromCenterToRight} 0.5s ease forwards;
        z-index: 2;
      }
    }

    &.next {
      transform: translateX(80%) scale(0.7);
      opacity: 0.85;
      filter: brightness(0.9);
      z-index: 1;

      &:hover {
        transform: translateX(85%) scale(0.75);
      }

      &.animating.to-left {
        animation: ${slideToCenter} 0.5s ease forwards;
        z-index: 2;
      }

      &.animating.to-right {
        animation: ${slideRight} 0.5s ease forwards;
      }
    }

    &.far-next {
      transform: translateX(160%) scale(0);

      &.animating.to-left {
        animation: ${slideFarRight} 0.5s ease forwards;
        opacity: 0.85;
      }

      &.animating.to-right {
        animation: ${slideFarRightToFarther} 0.5s ease forwards;
        opacity: 0;
      }
    }
  }
`
