import styled from '@emotion/styled'
import { media } from '../../styles/breakpoints'

export const RootContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

export const MainContainer = styled.div`
  width: 478px;
  height: 100%;
  position: relative;
  box-sizing: border-box;
  padding: 0 24px;

  ${media.mobileBig} {
    width: 100%;
  }
`

export const ProfileImageContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
`

export const ProfileInfoContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 12px;
  gap: 24px;
`
