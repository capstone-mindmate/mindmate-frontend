import styled from '@emotion/styled'
import { css, keyframes } from '@emotion/react'

// 좋아요 버튼 애니메이션 키프레임
const starAnimation = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
`

// 스타일 컴포넌트 정의
export const MagazineDetailContainer = styled.div`
  width: 100%;
  max-width: 884px;
  margin: 0 auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  overflow: hidden;
  overflow-y: auto;
`

export const CoverImage = styled.div<{ featuredImage: string | null }>`
  width: 100%;
  height: 40vh;
  min-height: 300px;
  background-image: ${({ featuredImage }) =>
    featuredImage ? `url(${featuredImage})` : 'url(/public/image.png)'};
  background-size: cover;
  background-position: center;
  position: relative;
`

export const TitleOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  color: white;
`

export const MagazineTitle = styled.h1`
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 700;
  word-break: keep-all; /* 단어 유지 */
  max-width: 70%; /* 컨테이너 너비의 70%까지만 사용 */
  color: #ffffff;
`

export const MagazineSubtitle = styled.h2`
  margin: 0;
  font-size: 16px;
  font-weight: 400;
  color: #ffffff;
  opacity: 0.9;
`

export const ContentContainer = styled.div`
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  padding-bottom: 100px;
`

export const MagazineContent = styled.div`
  color: #333;
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 30px;

  img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 15px 0;
    border-radius: 8px;
  }

  p {
    margin: 15px 0;
  }

  /* Quill 에디터 스타일 추가 */
  strong,
  b {
    font-weight: bold;
  }

  em,
  i {
    font-style: italic;
  }

  u {
    text-decoration: underline;
  }

  /* 글자 크기 스타일 - 여러 방식으로 강화 */
  /* 클래스 기반 */
  .ql-size-small {
    font-size: 0.75em !important;
  }

  .ql-size-large {
    font-size: 1.5em !important;
  }

  .ql-size-huge {
    font-size: 2em !important;
  }

  /* 스타일 속성 기반 */
  [style*='font-size: 0.75em'] {
    font-size: 0.75em !important;
  }

  [style*='font-size: 1.5em'] {
    font-size: 1.5em !important;
  }

  [style*='font-size: 2em'] {
    font-size: 2em !important;
  }

  /* span 태그 기반 */
  span.ql-size-small {
    font-size: 0.75em !important;
  }

  span.ql-size-large {
    font-size: 1.5em !importsssant;
  }

  span.ql-size-huge {
    font-size: 2em !important;
  }

  /* 정렬 스타일 */
  .ql-align-center {
    text-align: center;
  }

  .ql-align-right {
    text-align: right;
  }

  .ql-align-justify {
    text-align: justify;
  }

  /* 이모티콘 스타일 */
  .magazine-emoticon {
    display: inline-block;
    width: 70px;
    height: 70px;
    vertical-align: middle;
    margin: 0 5px;
  }
`

export const AuthorProfileContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #f8f8f8;
  border-radius: 12px;
  padding: 16px;
  margin-top: 20px;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
`

export const AuthorProfileImage = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 16px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

export const AuthorProfileInfo = styled.div`
  flex: 1;
`

export const NameRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
`

export const AuthorProfileName = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  margin: 0;
`

export const AuthorProfileDepartment = styled.p`
  font-size: 14px;
  color: #666666;
  margin: 0 0 0 8px;
`

export const AuthorDate = styled.p`
  font-size: 14px;
  color: #999999;
  margin: 0;
`

export const AuthorProfileArrow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const BottomToolbar = styled.div`
  display: flex;
  padding: 5px 16px;
  border-top: 1px solid #d9d9d9;
  bottom: 0;
  width: 100%;
  background-color: #ffffff;
  position: fixed;
`

// 애니메이션 버튼 래퍼
export const AnimatedButtonWrapper = styled.div`
  ${({ active }: { active: boolean }) =>
    active &&
    css`
      svg {
        animation: ${starAnimation} 0.3s ease;
      }
    `}
`

// 툴바 버튼
export const ToolbarButton = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 8px 15px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;

  ${({ active }) =>
    active &&
    css`
      svg {
        animation: ${starAnimation} 0.3s ease;
      }
    `}

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`

// 좋아요 수
export const LikeCount = styled.span`
  margin-left: 6px;
  color: #333;
  font-size: 16px;
  font-weight: 500;
`
