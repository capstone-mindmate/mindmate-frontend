import styled from '@emotion/styled'

// Page container
export const PageContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  min-height: 100vh;
  align-items: center;
  position: relative;
`

// Content container
export const ContentContainer = styled.div`
  width: 100%;
  max-width: 884px;
  box-sizing: border-box;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 480px) {
    max-width: 100%;
  }

  @media (min-width: 481px) and (max-width: 884px) {
    max-width: 100%;
  }

  @media (min-width: 885px) {
    max-width: 884px;
  }
`

// Component container
export const ComponentContainer = styled.div`
  width: calc(100% - 48px);
  max-width: 884px;
  margin: 0px 24px;
  box-sizing: border-box;

  @media (max-width: 480px) {
    width: calc(100% - 48px);
  }

  @media (min-width: 481px) and (max-width: 767px) {
    width: calc(100% - 48px);
  }

  @media (min-width: 768px) {
    width: calc(100% - 48px);
    max-width: 884px;
  }
`
