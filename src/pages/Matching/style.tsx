import styled from '@emotion/styled'
import { media } from '../../styles/breakpoints'

export const RootContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const MatchingContainer = styled.div`
  width: 478px;
  height: 100%;
  position: relative;
  padding: 0 24px;
  box-sizing: border-box;
`

export const TopFixedContent = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
`

export const MatchingTopBar = styled.div`
  width: 100%;
  height: 48px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

export const IconList = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  align-items: center;
  justify-content: center;
`

export const TopBarTitle = styled.p`
  font-size: 20px;
  font-weight: 600;
  line-height: 1.5;
  margin: 0;
  user-select: none;
`

export const CategoryContainer = styled.div`
  width: 100%;
  height: 44px;
  display: flex;
  flex-wrap: no-wrap;
  flex-direction: row;
  overflow-x: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`

export const CategoryItem = styled.div`
  width: 65px;
  height: 100%;
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #afafaf;
  cursor: selecte;
  &.selected {
    box-shadow: inset 0 -2px 0 #392111;
    color: #392111;
    cursor: default;
  }
`
export const CategoryItemText = styled.p`
  font-size: 14px;
  font-weight: bold;
  line-height: 1.4;
  margin: 0;
`
