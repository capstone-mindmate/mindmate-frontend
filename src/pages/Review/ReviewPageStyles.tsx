import styled from '@emotion/styled'

// 라뷰페이지 컨테이너
export const ReviewPageContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  overflow: hidden;
  min-height: 100vh;
`

// 컨텐츠 컨테이너
export const ContentContainer = styled.div`
  width: 100%;
  max-width: 884px;
  box-sizing: border-box;
  margin: 0 auto;
  padding: 0 34px; // 모든 화면 크기에 공통으로 적용되는 패딩

  @media (max-width: 884px) {
    max-width: 100%;
  }
`

// 제목 텍스트 스타일
export const TitleText = styled.div`
  font-family: 'Pretendard', sans-serif;
  font-weight: bold;
  font-size: 20px;
  padding: 20px 0px;
  line-height: 1.4;
  color: #333333;
`

// 설명 텍스트 스타일
export const ExplainText = styled.div`
  font-family: 'Pretendard', sans-serif;
  font-weight: bold;
  font-size: 15px;
  padding: 20px 0px;
  line-height: 1.4;
  color: #333333;
`

// 리뷰 버튼 컨테이너
export const ReviewButtonsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 20px 0;
  width: 100%; // 너비 명시
`

// 텍스트 입력 영역 컨테이너
export const TextAreaContainer = styled.div`
  position: relative;
  margin-bottom: 30px;
  width: 100%; // 너비 수정
`

// 리뷰 텍스트 입력 영역
export const ReviewTextArea = styled.textarea`
  width: 100%;
  min-height: 150px;
  background-color: #f5f5f5;
  border: none;
  border-radius: 8px;
  padding: 16px;
  padding-bottom: 40px; // 텍스트 영역 하단에 여백 추가
  box-sizing: border-box;
  font-family: 'Pretendard', sans-serif;
  font-size: 14px;
  line-height: 1.6;
  resize: none;
  color: #333333; // 텍스트 색상 명시적으로 설정

  &:focus {
    outline: 1px solid #d9d9d9;
  }

  &::placeholder {
    color: #999;
  }
`

// 글자 수 카운터
export const CharCounter = styled.div`
  position: absolute;
  bottom: -25px; // 텍스트 영역 바깥쪽 아래에 위치
  right: 5px;
  font-family: 'Pretendard', sans-serif;
  font-size: 12px;
  color: #666;
  background-color: transparent; // 배경색 투명으로 설정
  padding: 3px 5px;
`

// 제출 버튼 (ConfirmButton 스타일 기반)
export const SubmitButton = styled.button<{ active: boolean }>`
  width: 100%; // 너비 수정
  height: 50px;
  background-color: ${(props) => (props.active ? '#392111' : '#D9D9D9')};
  color: ${(props) => (props.active ? '#FFFFFF' : '#A3A3A3')};
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  line-height: 1.5;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${(props) => (props.active ? 'pointer' : 'default')};
  transition: all 0.3s ease;
  font-family: 'Pretendard', sans-serif;
  margin: 50px 0;
`
