import styled from '@emotion/styled'

// 스타일드 컴포넌트
export const RootContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  position: relative;
`

export const ContentWrapper = styled.div`
  width: 100%;
  max-width: 884px;
  position: relative;
  z-index: 1;
  padding-bottom: 60px;
`

export const NavigationWrapper = styled.div`
  width: 100%;
  position: relative;
  z-index: 1001;
`

export const TopFixedContent = styled.div`
  width: 100%;
  max-width: 884px;
  position: fixed;
  top: 57px;
  right: 0;
  left: 0;
  margin: auto;
  z-index: 100;
  background-color: #ffffff;

  @media (max-width: 884px) {
    width: 100%;
  }
`

export const CategoryContainer = styled.div`
  width: 100%;
  height: 44px;
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #f0f0f0;
`

export const CategoryItem = styled.div<{ isSelected?: boolean }>`
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${({ isSelected }) => (isSelected ? '#392111' : '#afafaf')};
  box-sizing: border-box;
  transition: all 0.2s ease;
  box-shadow: ${({ isSelected }) =>
    isSelected ? 'inset 0 -2px 0 #392111' : 'none'};
  cursor: ${({ isSelected }) => (isSelected ? 'default' : 'pointer')};
`

export const CategoryItemText = styled.p`
  font-size: 14px;
  font-weight: bold;
  line-height: 1.4;
  margin: 0;
`

export const MagazineContent = styled.div`
  margin: 0 24px;
  padding-top: 71px;
`

export const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px 24px;
  color: #888;
  font-size: 14px;
`
