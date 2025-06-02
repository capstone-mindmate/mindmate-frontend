import styled from '@emotion/styled'
import { media } from '../../../styles/breakpoints'

export const CategoryFilterContainer = styled.div`
  position: fixed;
  width: 884px;
  display: flex;
  padding: 5px 24px;
  box-sizing: border-box;
  gap: 6px;
  top: 56px;
  z-index: 100;
  background-color: white;

  ${media.tablet} {
    width: 100%;
  }
`
