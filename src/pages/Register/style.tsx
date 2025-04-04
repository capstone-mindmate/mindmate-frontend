import styled from '@emotion/styled'
import { css } from '@emotion/react'

export const RegisterContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

export const RegisterStepContainer = styled.div`
  width: 767px;
  height: 100vh;
  overflow-y: scroll;
  box-sizing: border-box;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 884px) {
    width: 100%;
  }
`
