import styled from '@emotion/styled'
import { media } from '../../../styles/breakpoints'

export const CategoryFilterContainer = styled.div`
  position: fixed;
  width: 884px;
  display: flex;
  padding: 0 24px;
  box-sizing: border-box;
  gap: 6px;
  top: calc(56px + 16px);
  z-index: 100;

  ${media.tablet} {
    width: 100%;
  }
`
