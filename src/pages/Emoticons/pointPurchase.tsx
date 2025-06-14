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
import { fetchWithRefresh } from '../../utils/fetchWithRefresh'
import { useNavigationStore } from '../../stores/navigationStore'

import TopBar from '../../components/topbar/Topbar'
import CoinBox from '../../components/coin/CoinBox'
import EventCoinPurchase from '../../components/coin/EventCoinPurchase'
import CoinPurchase from '../../components/coin/CoinPurchase'

interface Coin {
  productId: number
  points: number
  amount: number
  isPromotion: boolean
  promotionPeriod: string
}

interface User {
  nickname: string
  email: string
}

const PointPurchase = () => {
  const navigate = useNavigate()
  const { setPreviousPath } = useNavigationStore()
  const [coinList, setCoinList] = useState<Coin[]>([])
  const [coin, setCoin] = useState<number>(0)
  const [user, setUser] = useState<User>({ nickname: '', email: '' })

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetchWithRefresh(
        'https://mindmate.shop/api/payments/products',
        {
          method: 'GET',
        }
      )
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error)
      }
      const productData = await res.json()
      setCoinList(productData)
    }

    const fetchCoin = async () => {
      const res = await fetchWithRefresh('https://mindmate.shop/api/profiles', {
        method: 'GET',
      })
      const profileData = await res.json()
      setUser(profileData)
      setCoin(profileData.points ?? 0)
    }
    fetchProfile()
    fetchCoin()
  }, [])

  const goToEmoticonHome = () => {
    // 현재 페이지를 이전 페이지로 설정
    setPreviousPath('/coin')
  }

  const handleBackClick = () => {
    goToEmoticonHome()
    navigate(-1)
  }

  return (
    <RootContainer>
      <TopBar
        title="코인 구매"
        showBackButton={true}
        onBackClick={handleBackClick} // 함수 호출로 수정
      />
      <EmoticonsContainer>
        <TopItemContainer>
          <CoinBox coinCount={coin} />
        </TopItemContainer>

        <EventCoinWrapper>
          <EventCoinTextWrapper>
            <EventCointText>런칭 기념, 한정 이벤트!</EventCointText>
            <EventTermText>4/30 ~ 6/30</EventTermText>
          </EventCoinTextWrapper>
          {coinList
            .filter((coin) => coin.isPromotion)
            .map((coin) => (
              <EventCoinPurchase
                key={coin.productId}
                productId={coin.productId}
                coinCount={coin.points}
                coinPrice={coin.amount}
              />
            ))}
        </EventCoinWrapper>

        <PurchaseCoinWrapper>
          <PurchaseCoinTextWrapper>
            <PurchaseCoinText>코인 구매</PurchaseCoinText>
          </PurchaseCoinTextWrapper>

          <PurchaseCoinList>
            {coinList
              .filter((coin) => !coin.isPromotion)
              .map((coin) => (
                <CoinPurchase
                  key={coin.productId}
                  productId={coin.productId}
                  coinCount={coin.points}
                  coinPrice={coin.amount}
                  user={user}
                />
              ))}
          </PurchaseCoinList>
        </PurchaseCoinWrapper>
      </EmoticonsContainer>
    </RootContainer>
  )
}

export default PointPurchase
