import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'

// 애니메이션 효과를 위한 키프레임
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

// 매거진 전체 컨테이너
export const MagazineGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  box-sizing: border-box;
  width: 100%;
  margin: 0 auto; // 좌우 마진을 auto로 변경
  justify-content: flex-start; // 중앙 정렬 추가
  max-width: 1200px; // 최대 너비 설정 (필요에 따라 조정)
`

// 매거진 아이템 컨테이너
export const MagazineItemContainer = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background-color: #ffffff;
  cursor: pointer;
  /* 기본: 5개 컬럼 (아래에서 계산 수정) */
  width: calc((100% - 32px) / 5); /* 8px gap × 4 = 32px 제외 */
  aspect-ratio: 3/4;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 8px;
  flex-shrink: 0;
  max-width: 180px;

  /* 기본 트랜지션 */
  transition: all 0.3s ease;

  /* 미디어 쿼리 수정 - 4개 컬럼 */
  @media all and (max-width: 884px) {
    width: calc((100% - 24px) / 4); /* 8px gap × 3 = 24px 제외 */
  }

  /* 미디어 쿼리 수정 - 3개 컬럼 */
  @media all and (max-width: 600px) {
    width: calc((100% - 16px) / 3); /* 8px gap × 2 = 16px 제외 */
    max-width: none; /* 최대 너비 제한 해제 */
  }

  /* 미디어 쿼리 수정 - 2개 컬럼 */
  @media all and (max-width: 478px) {
    width: calc((100% - 8px) / 2); /* 8px gap × 1 = 8px 제외 */
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`

// 이미지 컨테이너
export const ImageContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`

// 이미지 요소
export const MagazineImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

// 텍스트 오버레이 컨테이너
export const TextOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 12px 10px 16px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

// 제목 텍스트
export const TitleText = styled.h3`
  font-size: 11.5px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  line-height: 1.3;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: keep-all;
  max-width: 60%;
  padding-right: 10px;
`

// 세부 내용 텍스트
export const DetailText = styled.p`
  font-size: 8px;
  color: #ffffff;
  margin: 2px 0 11px 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 90%;
`

// 이미지 위에 오버레이되는 그라데이션
export const ImageGradient = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.4) 30%,
    rgba(0, 0, 0, 0) 60%
  );
  z-index: 1;
`

// 매거진 컨테이너에 애니메이션 효과 추가
export const MagazineContainer = styled.div`
  .magazine-transition-container {
    animation: fadeIn 0.3s ease;
  }

  /* 정렬 변경 시 애니메이션용 컨테이너 */
  .magazine-container {
    transition: all 0.3s ease;
  }
`

// 매거진 리스트 페이지에 추가할 스타일
export const MagazineTransitionContainer = styled.div`
  transition: opacity 0.3s ease;

  &.transitioning {
    opacity: 0.7;
  }

  /* 애니메이션 전환 효과를 위한 스타일 */
  .magazine-item {
    transition:
      transform 0.5s ease,
      opacity 0.5s ease;
    will-change: transform, opacity;
  }
`

// 포맷팅 지원
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

  /* 크기 스타일 */
  .ql-size-small {
    font-size: 0.75em;
  }

  .ql-size-large {
    font-size: 1.5em;
  }

  .ql-size-huge {
    font-size: 2em;
  }

  /* 색상과 배경색 스타일은 인라인으로 적용됨 */

  /* 이모티콘 스타일 */
  .magazine-emoticon {
    display: inline-block;
    width: 70px;
    height: 70px;
    vertical-align: middle;
    margin: 0 5px;
  }
`
