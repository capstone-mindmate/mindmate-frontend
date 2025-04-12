import styled from '@emotion/styled'
import { css } from '@emotion/react'

export const RegisterContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;

  @media (max-width: 479px) {
    width: 100%;
  }
`

export const RegisterTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 24px;
`

export const RegisterTitle = styled.p`
  font-size: 24px;
  line-height: 1.5;
  font-weight: bold;
  margin: 0;
  color: #150c06;
`

export const RegisterSubTitle = styled.p`
  font-size: 16px;
  line-height: 1.5;
  font-weight: regular;
  margin: 0;
  color: #393939;
`

export const RegisterInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  margin-top: 48px;
`

export const RegisterImageContainer = styled.div``

export const RegisterImage = css``

export const RegisterCategoryContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  gap: 10px;
`

export const RegisterConfirmButtonContainer = styled.div`
  position: absolute;
  bottom: 50px;
  width: 100%;
`

export const RegisterAgreementContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin: 0;
  padding: 0;
  position: absolute;
  bottom: 156px;
`

export const RegisterAgreement = styled.div`
  width: 100%;
`
