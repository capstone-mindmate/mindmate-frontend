/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  RootContainer,
  EmoticonsContainer,
  TopItemContainer,
  EventCoinWrapper,
  EventCoinTextWrapper,
  EventCointText,
  EventTermText,
  PurchaseCoinWrapper,
  PurchaseCoinTextWrapper,
  PurchaseCoinText,
  PurchaseCoinList,
} from './style'

import TopBar from '../../components/topbar/Topbar'
import CoinBox from '../../components/coin/CoinBox'
import EventCoinPurchase from '../../components/coin/EventCoinPurchase'
import CoinPurchase from '../../components/coin/CoinPurchase'

const PointPurchase = () => {
  const navigate = useNavigate()

  return (
    <RootContainer>
      <TopBar title="코인 구매" showBackButton={true} />
      <EmoticonsContainer>
        <TopItemContainer>
          <CoinBox coinCount={500} />
        </TopItemContainer>

        <EventCoinWrapper>
          <EventCoinTextWrapper>
            <EventCointText>런칭 기념, 한정 이벤트!</EventCointText>
            <EventTermText>4/30 ~ 6/30</EventTermText>
          </EventCoinTextWrapper>
          <EventCoinPurchase coinCount={40} coinPrice={3000} />
        </EventCoinWrapper>

        <PurchaseCoinWrapper>
          <PurchaseCoinTextWrapper>
            <PurchaseCoinText>코인 구매</PurchaseCoinText>
          </PurchaseCoinTextWrapper>

          <PurchaseCoinList>
            <CoinPurchase coinCount={10} coinPrice={1000} />
            <CoinPurchase coinCount={30} coinPrice={2500} />
            <CoinPurchase coinCount={50} coinPrice={4000} />
            <CoinPurchase coinCount={100} coinPrice={7500} />
            <CoinPurchase coinCount={200} coinPrice={10000} />
          </PurchaseCoinList>
        </PurchaseCoinWrapper>
      </EmoticonsContainer>
    </RootContainer>
  )
}

export default PointPurchase
