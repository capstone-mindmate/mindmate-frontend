import styled from '@emotion/styled'

// 매거진 전체 컨테이너
export const MagazineGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  box-sizing: border-box;
  width: 100%;
  margin: 0 auto; // 좌우 마진을 auto로 변경
  justify-content: center; // 중앙 정렬 추가
  max-width: 1200px; // 최대 너비 설정 (필요에 따라 조정)
`

// 매거진 아이템 컨테이너
export const MagazineItemContainer = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  background-color: #ffffff;
  cursor: pointer;
  width: calc((100% - 32px) / 5);
  aspect-ratio: 3/4;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 8px;
  flex-shrink: 0;
  max-width: 180px;

  @media all and (max-width: 884px) {
    width: calc((100% - 24px) / 4);
  }

  @media all and (max-width: 600px) {
    width: calc((100% - 16px) / 3);
  }

  @media all and (max-width: 478px) {
    width: calc((100% - 8px) / 2);
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
