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
  margin-top: 20px;
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

export const TopItemContainer = styled.div`
  width: 100%;
  margin-top: 28px;
  margin-bottom: 25px;
`

export const PointHistoryContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`

export const EventCoinWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`

export const EventCoinTextWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 7px;
  margin-bottom: 12px;
`

export const EventCointText = styled.p`
  color: #000000;
  font-size: 18px;
  font-weight: bold;
  line-height: 1.55;
  margin: 0;
`

export const EventTermText = styled.p`
  color: #727272;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.3;
  margin: 0;
`

export const PurchaseCoinWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 24px;
`

export const PurchaseCoinTextWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 7px;
`

export const PurchaseCoinText = styled.p`
  color: #000000;
  font-size: 18px;
  font-weight: bold;
  line-height: 1.55;
  margin: 0;
`

export const PurchaseCoinList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
  margin-bottom: 30px;
`

export const PurchaseResultContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 0;
  box-sizing: border-box;
  justify-content: center;
  gap: 20px;
`

export const PurchaseResultHeaderText = styled.p`
  color: #000000;
  font-size: 24px;
  font-weight: bold;
  line-height: 1.5;
  margin: 0;
`
