import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { media } from '../../styles/breakpoints'

export const RootContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const RegisterContainer = styled.div`
  width: 884px;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 0 24px;
  box-sizing: border-box;

  ${media.tablet} {
    width: 100%;
  }
`

export const RegisterStepContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;

  ${media.tablet} {
    width: 100%;
  }
`

export const RegisterNavBar = styled.div`
  position: relative;
  width: 100%;
  height: 56px;
  top: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: #ffffff;
  z-index: 100;
`

export const StepIndicatorContainer = styled.div`
  display: flex;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  justify-content: center;
  align-items: center;
  gap: 8px;
`

export const StepDot = styled.div<{ isActive: boolean }>`
  width: ${(props) => (props.isActive ? '35px' : '12px')};
  height: 12px;
  border-radius: ${(props) => (props.isActive ? '35px' : '50%')};
  background-color: ${(props) => (props.isActive ? '#392111' : '#D9D9D9')};
  transition: all 0.3s ease;
`
