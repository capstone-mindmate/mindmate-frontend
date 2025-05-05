import styled from '@emotion/styled'
import { media } from '../../../styles/breakpoints'

export const ChatBarWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 100;
  box-sizing: border-box;
`

export const EmoticonWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 5px;
`

export const LoadingText = styled.div`
  text-align: center;
  color: #888;
  padding: 20px;
`
