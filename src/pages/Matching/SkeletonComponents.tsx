/** @jsxImportSource @emotion/react */
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

// 스켈레톤 기본 스타일
const skeletonBase = css`
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
  border-radius: 4px;
`

// 매칭방 아이템 스켈레톤
const MatchItemSkeleton = () => {
  return (
    <div
      css={css`
        width: 100%;
        padding: 16px 24px;
        border-bottom: 1px solid #f5f5f5;
        box-sizing: border-box;
      `}
    >
      {/* 카테고리와 역할 */}
      <div
        css={css`
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
        `}
      >
        <div
          css={css`
            ${skeletonBase}
            width: 60px;
            height: 20px;
          `}
        />
        <div
          css={css`
            ${skeletonBase}
            width: 50px;
            height: 20px;
          `}
        />
      </div>

      {/* 제목 */}
      <div
        css={css`
          ${skeletonBase}
          width: 70%;
          height: 18px;
          margin-bottom: 8px;
        `}
      />

      {/* 설명 */}
      <div
        css={css`
          ${skeletonBase}
          width: 90%;
          height: 14px;
          margin-bottom: 4px;
        `}
      />
      <div
        css={css`
          ${skeletonBase}
          width: 60%;
          height: 14px;
        `}
      />
    </div>
  )
}

// 신청자 정보 스켈레톤
const ApplicationInfoSkeleton = () => {
  return (
    <div
      css={css`
        width: 100%;
        padding: 16px 24px;
        border-bottom: 1px solid #f5f5f5;
        display: flex;
        align-items: center;
        gap: 12px;
      `}
    >
      {/* 프로필 이미지 */}
      <div
        css={css`
          ${skeletonBase}
          width: 48px;
          height: 48px;
          border-radius: 50%;
          flex-shrink: 0;
        `}
      />

      {/* 사용자 정보 */}
      <div
        css={css`
          flex: 1;
        `}
      >
        <div
          css={css`
            ${skeletonBase}
            width: 120px;
            height: 16px;
            margin-bottom: 6px;
          `}
        />
        <div
          css={css`
            ${skeletonBase}
            width: 80px;
            height: 14px;
          `}
        />
      </div>
    </div>
  )
}

// 매칭방 목록 스켈레톤 컴포넌트
const MatchingListSkeleton = ({ count = 5 }: { count?: number }) => {
  return (
    <div>
      {Array.from({ length: count }, (_, index) => (
        <MatchItemSkeleton key={index} />
      ))}
    </div>
  )
}

// 신청자 목록 스켈레톤 컴포넌트
const ApplicationListSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div>
      {Array.from({ length: count }, (_, index) => (
        <ApplicationInfoSkeleton key={index} />
      ))}
    </div>
  )
}

export {
  MatchingListSkeleton,
  ApplicationListSkeleton,
  MatchItemSkeleton,
  ApplicationInfoSkeleton,
}
