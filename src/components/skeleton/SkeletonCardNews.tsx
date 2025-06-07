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

const scrollContainerStyle = css`
  display: flex;
  gap: 16px;
  padding: 0 20px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`

const cardStyle = css`
  flex: 0 0 180px;
  height: 240px;
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
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const imageStyle = css`
  width: 100%;
  height: 180px;
  background: #e0e0e0;
  background-image: linear-gradient(
    90deg,
    #e0e0e0 0px,
    #d0d0d0 40px,
    #e0e0e0 80px
  );
  background-size: 200px;
  animation: ${shimmer} 2s infinite;
  border-radius: 8px;
  margin-bottom: 12px;
`

const titleStyle = css`
  width: 90%;
  height: 18px;
  background: #e0e0e0;
  background-image: linear-gradient(
    90deg,
    #e0e0e0 0px,
    #d0d0d0 40px,
    #e0e0e0 80px
  );
  background-size: 200px;
  animation: ${shimmer} 2s infinite;
  border-radius: 4px;
  margin-bottom: 8px;
`

const organizationStyle = css`
  width: 60%;
  height: 14px;
  background: #e0e0e0;
  background-image: linear-gradient(
    90deg,
    #e0e0e0 0px,
    #d0d0d0 40px,
    #e0e0e0 80px
  );
  background-size: 200px;
  animation: ${shimmer} 2s infinite;
  border-radius: 4px;
  margin-bottom: 4px;
`

const dateStyle = css`
  width: 40%;
  height: 12px;
  background: #e0e0e0;
  background-image: linear-gradient(
    90deg,
    #e0e0e0 0px,
    #d0d0d0 40px,
    #e0e0e0 80px
  );
  background-size: 200px;
  animation: ${shimmer} 2s infinite;
  border-radius: 4px;
`

const SkeletonCardNews: React.FC = () => {
  return (
    <div css={scrollContainerStyle}>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} css={cardStyle}>
          <div css={imageStyle} />
          <div>
            <div css={titleStyle} />
            <div css={organizationStyle} />
            <div css={dateStyle} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default SkeletonCardNews
