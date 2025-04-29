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

export const EmoticonsContainer = styled.div`
  width: 478px;
  height: 100%;
  position: relative;
  box-sizing: border-box;
  padding: 0 24px;

  ${media.mobileBig} {
    width: 100%;
  }
`

export const ProfileContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 70px;
`

export const PurchaseAbleEmoticonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`

export const PurchaseHeadT = styled.p`
  color: #000000;
  font-size: 18px;
  font-weight: bold;
  line-height: 1.55;
  margin: 0;
`
export const PurchaseSubT = styled.p`
  color: #000000;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;
  margin: 0;
  margin-top: 4px;
`

export const PurchaseEmoticonList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 17px;
`

export const OwnedEmoticonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 24px;
`

export const OwnedEmoticonHeadT = styled.p`
  color: #000000;
  font-size: 18px;
  font-weight: bold;
  line-height: 1.55;
  margin: 0;
`

export const OwnedEmoticonList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 17px;
  margin-bottom: 24px;
`

export const EmotionWrapper = styled.div`
  width: 33.3333%;
  display: flex;
  justify-content: center;
  align-items: center;
`
