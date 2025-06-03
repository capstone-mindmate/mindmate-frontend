import { useState } from 'react'
import { CoinIcon, CloseIcon } from '../../components/icon/iconComponents'
import PurchaseButton from '../buttons/purchaseButton'
import { createOrder } from '../../services/api'
import { nanoid } from 'nanoid'
import { fetchWithRefresh } from '../../utils/fetchWithRefresh'

import { EventCoinBoxContainer, PriceInfo } from '../../styles/CoinBoxStyles'
import {
  PaymentModalOverlay,
  Wrapper,
  BoxSection,
  Button,
  PriceContainer,
  PriceInfoContainer,
  HeaderContainer,
  Title,
} from './paymentWidgetStyle'

interface EventCoinPurchaseProps {
  coinCount: number
  coinPrice: number
  productId: number
}

// 결제 설정 정보를 받아오는 함수 (이 파일 내에 직접 구현)
async function getPaymentConfig() {
  const res = await fetchWithRefresh(
    'https://mindmate.shop/api/payments/config',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
  if (!res.ok) throw new Error('결제 설정 정보 조회 실패')
  return res.json()
}

const EventCoinPurchase = ({
  productId,
  coinCount,
  coinPrice,
}: EventCoinPurchaseProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [customerKey] = useState(() => nanoid())

  const handleOpenModal = () => {
    setIsModalOpen(true)
    setError(null)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setError(null)
  }

  const handlePayment = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // 1. 결제 설정 정보 받아오기 (clientKey, success/fail URL)
      const config = await getPaymentConfig()
      const { clientKey } = config

      // 2. 결제 주문 생성
      const orderRes = await createOrder(productId)
      const { orderId, amount } = orderRes

      // 3. TossPayments 인스턴스 생성 및 결제창 호출
      // @ts-ignore
      const tossPayments = window.TossPayments(clientKey)
      await tossPayments.requestPayment('카드', {
        amount,
        orderId,
        orderName: `코인 ${coinCount}개`,
        customerName: '이벤트유저',
        customerEmail: 'event@user.com',
        successUrl: `${window.location.origin}/coin/success`,
        failUrl: `${window.location.origin}/coin/fail`,
      })
    } catch (e: any) {
      setError(e?.message || '결제 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <EventCoinBoxContainer onClick={handleOpenModal}>
        <PriceInfo>
          <CoinIcon color="#392111" />
          <p
            style={{
              fontSize: '16px',
              fontWeight: 'regular',
              color: '#000000',
              margin: '0',
            }}
          >
            코인 {coinCount}개
          </p>
        </PriceInfo>
        <PurchaseButton priceText={coinPrice} />
      </EventCoinBoxContainer>

      {isModalOpen && (
        <PaymentModalOverlay>
          <Wrapper>
            <BoxSection>
              <HeaderContainer>
                <Title>코인 {coinCount}개 구매</Title>
                <div style={{ cursor: 'pointer' }} onClick={handleCloseModal}>
                  <CloseIcon />
                </div>
              </HeaderContainer>
              <PriceContainer>
                <PriceInfoContainer>
                  <span>총 결제금액</span>
                  <span>{coinPrice.toLocaleString()}원</span>
                </PriceInfoContainer>
              </PriceContainer>
              {error && (
                <div style={{ color: 'red', margin: '10px 0' }}>{error}</div>
              )}
              <Button disabled={isLoading} onClick={handlePayment}>
                {isLoading
                  ? '결제 요청 중...'
                  : `${coinPrice.toLocaleString()}원 결제하기`}
              </Button>
            </BoxSection>
          </Wrapper>
        </PaymentModalOverlay>
      )}
    </>
  )
}

export default EventCoinPurchase
