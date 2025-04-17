import styled from '@emotion/styled'

// 메인 컨테이너
export const StudentSupportContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 30px 24px 40px 24px;
  background-color: #ffffff;
  box-sizing: border-box; /* 패딩을 너비에 포함 */
`

// 제목 스타일
export const Title = styled.h2`
  color: #000000;
  font-family: 'Pretendard', sans-serif;
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 16px 0;
`

// 링크 스크롤 컨테이너
export const LinksContainer = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 10px;
  width: 100%;

  // 스크롤바를 완전히 숨기는 CSS 추가
  &::-webkit-scrollbar {
    display: none;
  }

  // IE, Edge, Firefox에서도 스크롤바 숨기기
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`

// 개별 링크 카드
export const LinkCard = styled.a`
  display: flex;
  flex: 0 0 auto; /* 컨텐츠 크기에 맞게 너비 설정, 축소되지 않음 */
  height: 140px;
  background-color: #ffffff;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #eeeeee;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`

// 이미지
export const Image = styled.img`
  height: 100%;
  width: auto; /* 이미지 비율 유지 */
  object-fit: contain;
`
