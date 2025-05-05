import styled from '@emotion/styled'
import { media } from '../../../styles/breakpoints'

export const RootContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
`

export const ChatContainer = styled.div`
  width: 884px;
  height: 100%;
  position: relative;
  padding: 57px 24px 0 24px;
  box-sizing: border-box;

  ${media.tablet} {
    width: 100%;
  }
`

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
