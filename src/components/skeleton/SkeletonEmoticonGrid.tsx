/** @jsxImportSource @emotion/react */
import React from 'react'
import { css, keyframes } from '@emotion/react'

// 스켈레톤 애니메이션
const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`

const gridStyle = css`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding: 0 20px;
`

const skeletonEmoticonStyle = css`
  width: 64px;
  height: 64px;
  background: #f0f0f0;
  background-image: linear-gradient(
    90deg,
    #f0f0f0 0px,
    #e0e0e0 40px,
    #f0f0f0 80px
  );
  background-size: 200px;
  animation: ${shimmer} 2s infinite;
  border-radius: 12px;
  justify-self: center;
`

const SkeletonEmoticonGrid: React.FC = () => {
  return (
    <div css={gridStyle}>
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} css={skeletonEmoticonStyle} />
      ))}
    </div>
  )
}

export default SkeletonEmoticonGrid
