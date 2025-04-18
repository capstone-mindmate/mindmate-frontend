import styled from '@emotion/styled'

// 로고 텍스트
export const LogoText = styled.span`
  font-family: 'pretendard';
  font-size: 20px;
  font-weight: 640;
  color: #392111;

  @media (max-width: 480px) {
    font-size: 18px;
  }

  @media (min-width: 1024px) {
    font-size: 22px;
  }
`

// 마이페이지 컨테이너
export const MypageContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  overflow: hidden;
  padding-bottom: 70px;
  min-height: 100vh;
`

// 컨텐츠 컨테이너
export const ContentContainer = styled.div`
  width: 100%;
  max-width: 884px;
  box-sizing: border-box;
  margin: 0 auto;

  @media (max-width: 480px) {
    max-width: 100%;
  }

  @media (min-width: 481px) and (max-width: 884px) {
    max-width: 100%;
    padding: 0;
  }

  @media (min-width: 885px) {
    max-width: 884px; /* 최대 너비 884px 유지 */
  }
`

// 컴포넌트 컨테이너
export const ComponentContainer = styled.div`
  width: calc(100% - 48px);
  max-width: 884px; /* 최대 너비를 884px로 설정 */
  margin: 0 24px 30px 24px;
  box-sizing: border-box;
  overflow: hidden;

  @media (max-width: 480px) {
    width: calc(100% - 48px);
    margin: 0 24px 20px 24px;
  }

  @media (min-width: 481px) and (max-width: 767px) {
    width: calc(100% - 48px);
    margin: 0 24px 30px 24px;
  }

  @media (min-width: 768px) {
    width: calc(100% - 48px);
    max-width: 884px; /* 최대 너비를 884px로 설정 */
    margin: 0 24px 40px 24px;
  }
`

export const InfoBoxContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 24px auto;
`

export const MatchingGraphContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 0px auto;
`
