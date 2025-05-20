import styled from '@emotion/styled'

// 로고 텍스트
export const LogoText = styled.span`
  font-family: 'Poppins', sans-serif !important;
  font-size: 20px;
  font-weight: 500;
  color: #392111;
`

// 홈페이지 컨테이너
export const HomeContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  overflow: hidden;
  padding-bottom: 70px;
`

// 컨텐츠 컨테이너
export const ContentContainer = styled.div`
  width: 100%;
  max-width: 884px;
  box-sizing: border-box;
  margin: 0 auto;
`

// 카테고리 제목 스타일
export const CategoryTitle = styled.p`
  font-family: 'Pretender';
  font-size: 18px;
  font-weight: 900;
  margin: 30px 24px 0px 25px;
`

// 홈 카테고리 컨테이너
export const HomeCategoryContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin: 17px 24px;
`

// 섹션 구분선이 있는 컨테이너
export const SectionContainer = styled.div`
  margin: 10px 0;
  padding-top: 20px;
  border-top: 10px solid #f5f5f5;
`

// 섹션 타이틀 영역
export const SectionTitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 24px 16px 24px;
`

// 섹션 타이틀 텍스트
export const SectionTitle = styled.h3`
  font-family: 'Pretender';
  font-size: 18px;
  font-weight: 900;
  margin: 0;
`

// 더보기 버튼
export const SeeMoreButton = styled.button`
  font-family: 'Pretender';
  font-size: 12px;
  font-weight: 400;
  color: #666;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
`

// 이모티콘 그리드
export const EmoticonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  justify-items: center;
  margin: 0 24px;
`

// 카드 뉴스 스크롤 영역
export const CardNewsScrollContainer = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 15px;
  margin: 0 0 10px 24px;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`

// 클릭 가능한 카드 컨테이너
export const ClickableCard = styled.div`
  cursor: pointer;
`

// 학생지원 링크 컨테이너
export const StudentSupportContainer = styled.div`
  margin: 0 24px 24px 0;
`

// 일반 섹션 컨테이너 (추가 테두리나 패딩 없음)
export const PlainSectionContainer = styled.div`
  padding: 20px 0 5px 0;
`
