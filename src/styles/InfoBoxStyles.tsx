import styled from '@emotion/styled'

// 인포박스 메인 컨테이너
export const InfoBoxContainer = styled.div`
  background-color: #fffcf5;
  border: 1px solid #f0daa9;
  border-radius: 10px;
  padding: 12px 22px;
  display: flex;
  justify-content: center;
  color: #392111;
  width: 100%;
  max-width: 350px;
  margin: 0 24px;
`

// 각 섹션 컨테이너
export const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex: 1;
`

// 라벨 텍스트 (평균 점수, 보유 코인, 매칭 횟수)
export const Label = styled.div`
  font-size: 14px;
  font-weight: normal;
  margin-bottom: 1px;
`

// 값 텍스트 (숫자)
export const Value = styled.div`
  font-size: 14px;
  font-weight: bold;
`

// 점수 값 컨테이너 (별 아이콘 + 점수)
export const ScoreValue = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  position: relative;
`

// 별 아이콘 래퍼 - 점수 왼쪽에 위치
export const StarIconWrapper = styled.div`
  position: absolute;
  right: calc(50% + 15px);
  display: flex;
  align-items: center;
`

// 점수 값만 따로 래핑하여 중앙 정렬
export const ScoreTextWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

// 구분선
export const Divider = styled.div`
  height: 18px;
  width: 1px;
  background-color: #c1bfbe;
  margin: 20px 10px;
`
