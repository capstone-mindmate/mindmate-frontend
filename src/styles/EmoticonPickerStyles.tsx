import styled from '@emotion/styled'

export const PickerContainer = styled.div`
  width: 100%;
  background-color: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 0px 0px 15px 0px;
  z-index: 1000;
  box-sizing: border-box;
  max-width: 100%;
  overflow: hidden;
`

export const ScrollableContainer = styled.div`
  max-height: 180px;
  overflow-y: auto;
  width: 100%;
  box-sizing: border-box;

  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #ccc;
  }
`

export const EmoticonGrid = styled.div`
  display: grid;
  gap: 15px;
  padding: 10px;
  box-sizing: border-box;

  /* 기본 설정 (모바일 우선) */
  grid-template-columns: repeat(3, 1fr);

  /* 브레이크포인트 */
  @media (min-width: 479px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (min-width: 601px) {
    grid-template-columns: repeat(5, 1fr);
  }
`

export const EmoticonItem = styled.div`
  text-align: center;
  cursor: pointer;
  box-sizing: border-box;
`

export const ShopButton = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #f8f8f8;
  border-radius: 10px;
  margin: 0 15px 10px 15px;
  cursor: pointer;
  box-sizing: border-box;
`

export const ShopText = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #392111;
`

export const ShopArrow = styled.span`
  font-size: 16px;
  color: #392111;
`
