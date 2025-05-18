import styled from '@emotion/styled'

// 프레임 메인 컨테이너 - 기존 사이즈 유지
export const FrameContainer = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  background-color: #ffffff;
  cursor: pointer;
  width: 100%;
  max-width: 300px;
  height: 100%;
`

// 이미지 컨테이너 - 비율 고정
export const ImageContainer = styled.div`
  width: 100%;
  height: 0;
  padding-bottom: 133.33%; /* 3:4 비율로 고정 (75%는 4:3 비율) */
  position: relative;
  overflow: hidden;
`

// 이미지 요소 - 컨테이너에 맞게 absolute 포지셔닝하여 비율 유지
export const FrameImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center; /* 이미지가 중앙에 위치하도록 설정 */
`

// 텍스트 오버레이 컨테이너
export const TextOverlay = styled.div`
  position: absolute;
  bottom: 45px; // 페이지 인디케이터를 위한 공간 확보
  left: 0;
  width: calc(100% - 20px); /* 양쪽에 여백 제공 */
  padding: 20px 0 0 15px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

// 제목 텍스트
export const TitleText = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  line-height: 1.3;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: keep-all; /* 단어 유지 */
  max-width: 70%; /* 컨테이너 너비의 70%까지만 사용 */
  padding-right: 10px;
`

// 세부 내용 텍스트
export const DetailText = styled.p`
  font-size: 13px;
  color: #ffffff;
  margin: 3px 0 0 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis; /* 넘치는 텍스트는 ... 처리 */
  white-space: nowrap;
  max-width: 95%; /* 컨테이너 너비의 95%까지만 사용 */
`

// 페이지 번호 표시
export const PageIndicator = styled.div`
  position: absolute;
  bottom: 12px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 10.5px;
  font-weight: 400;
  z-index: 3;
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
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0) 60%
  );
  z-index: 1;
`
