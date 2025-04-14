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
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 0 24px;
  box-sizing: border-box;
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
`
