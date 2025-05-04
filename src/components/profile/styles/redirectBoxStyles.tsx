import styled from '@emotion/styled'
import { media } from '../../../styles/breakpoints'

export const RedirectBoxContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  cursor: pointer;
`

export const RedirectBoxText = styled.div`
  font-size: 16px;
  font-weight: 400;
  line-height: 1.55;
  color: #000000;
`

export const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  transform: rotate(180deg);
`
