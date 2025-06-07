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

const containerStyle = css`
  position: relative;
  width: 100%;
  height: 330px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-bottom: 20px;
`

const wrapperStyle = css`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const frameStyle = css`
  position: absolute;
  width: 280px;
  height: 370px;
  background: #f0f0f0;
  background-image: linear-gradient(
    90deg,
    #f0f0f0 0px,
    #e0e0e0 40px,
    #f0f0f0 80px
  );
  background-size: 200px;
  animation: ${shimmer} 2s infinite;
  border-radius: 16px;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
`

const prevFrameStyle = css`
  ${frameStyle};
  transform: translateX(-80%) scale(0.7);
  opacity: 0.6;
  z-index: 1;
`

const currentFrameStyle = css`
  ${frameStyle};
  transform: translateX(0) scale(0.8);
  opacity: 1;
  z-index: 3;
`

const nextFrameStyle = css`
  ${frameStyle};
  transform: translateX(80%) scale(0.7);
  opacity: 0.6;
  z-index: 1;
`

const contentStyle = css`
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const titleStyle = css`
  width: 80%;
  height: 24px;
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

const subtitleStyle = css`
  width: 60%;
  height: 16px;
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

const imageStyle = css`
  width: 100%;
  height: 250px;
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

const pageIndicatorStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const SkeletonFrameSlider: React.FC = () => {
  return (
    <div css={containerStyle}>
      <div css={wrapperStyle}>
        {/* 이전 프레임 */}
        <div css={prevFrameStyle}>
          <div css={contentStyle}>
            <div>
              <div css={titleStyle} />
              <div css={subtitleStyle} />
            </div>
            <div css={imageStyle} />
            <div css={pageIndicatorStyle}></div>
          </div>
        </div>

        {/* 현재 프레임 */}
        <div css={currentFrameStyle}>
          <div css={contentStyle}>
            <div>
              <div css={titleStyle} />
              <div css={subtitleStyle} />
            </div>
            <div css={imageStyle} />
            <div css={pageIndicatorStyle}></div>
          </div>
        </div>

        {/* 다음 프레임 */}
        <div css={nextFrameStyle}>
          <div css={contentStyle}>
            <div>
              <div css={titleStyle} />
              <div css={subtitleStyle} />
            </div>
            <div css={imageStyle} />
            <div css={pageIndicatorStyle}></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkeletonFrameSlider
