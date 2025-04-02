import styled from '@emotion/styled'

// 메인 컨테이너
export const MatchingGraphContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 350px;
  padding: 16px;
  background-color: #ffffff;
  border: 1px solid #eeeeee;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`

// 제목 스타일
export const Title = styled.h3`
  color: #392111;
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 8px 0;
`

// 설명 텍스트 스타일
export const Description = styled.p`
  color: #392111;
  font-size: 14px;
  margin: 0 0 24px 0;
  display: flex;
  align-items: center;
`

// 아이콘 래퍼
export const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  margin-right: 4px;
  color: #392111;
`

// 그래프 컨테이너
export const GraphContainer = styled.div<{ isEmpty: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: ${(props) => (props.isEmpty ? '40px' : '200px')};
  width: 100%;
  margin-top: 12px;
`

// 각 카테고리 아이템
export const CategoryItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
  height: 100%;
  position: relative;
  padding: 0 2px;
`

// 카테고리 바 그래프
export const CategoryBar = styled.div<{ height: string; isTop: boolean }>`
  width: 32px;
  height: ${(props) => props.height};
  background-color: ${(props) => (props.isTop ? '#392111' : '#D9D9D9')};
  border-radius: 6px 6px 0 0;
  transition: height 0.3s ease;
  position: absolute;
  bottom: 40px; /* 라벨 높이만큼 공간 확보 - 더 여유있게 */
  max-height: calc(100% - 40px); /* 라벨 높이를 제외한 최대 높이 */
`

// 카테고리 라벨
export const CategoryLabel = styled.span<{ isHidden: boolean }>`
  color: #392111;
  font-size: 12px;
  text-align: center;
  position: absolute;
  bottom: 0;
  width: 100%;
  white-space: nowrap;
  overflow: visible;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  visibility: ${(props) => (props.isHidden ? 'hidden' : 'visible')};
`
