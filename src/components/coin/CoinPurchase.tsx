import { useEffect, useRef, useState } from 'react'
import { CoinIcon, CloseIcon } from '../../components/icon/iconComponents'
import PurchaseButton from '../buttons/purchaseButton'
import { useQuery } from '@tanstack/react-query'
import {
  loadPaymentWidget,
  PaymentWidgetInstance,
  ANONYMOUS,
} from '@tosspayments/payment-widget-sdk'
import { nanoid } from 'nanoid'
import { createOrder } from '../../services/api'

import { CoinBoxContainer, PriceInfo } from '../../styles/CoinBoxStyles'

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

interface User {
  nickname: string
  email: string
}

interface CoinPurchaseProps {
  coinCount: number
  coinPrice: number
  user: User
  productId: number
}

const clientKey = 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm'

function usePaymentWidget(clientKey: string, customerKey: string) {
  return useQuery({
    queryKey: ['payment-widget', clientKey, customerKey],
    queryFn: () => {
      return loadPaymentWidget(clientKey, customerKey)
    },
  })
}

const CoinPurchase = ({
  coinCount,
  coinPrice,
  productId,
  user,
}: CoinPurchaseProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [customerKey] = useState(() => nanoid())
  const { data: paymentWidget } = usePaymentWidget(clientKey, customerKey)
  const paymentMethodsWidgetRef = useRef<any>(null)
  const [paymentMethodsWidgetReady, setPaymentMethodsWidgetReady] =
    useState(false)

  const elementId = `coin-purchase-${coinCount}`

  useEffect(() => {
    if (!paymentWidget || !isModalOpen) {
      return
    }

    const selector = `#payment-widget-${elementId}`

    try {
      const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
        selector,
        { value: coinPrice }
      )

      paymentWidget.renderAgreement(`#agreement-${elementId}`)

      paymentMethodsWidget.on('ready', () => {
        paymentMethodsWidgetRef.current = paymentMethodsWidget
        setPaymentMethodsWidgetReady(true)
      })
    } catch (error) {
      console.error('결제 위젯 렌더링 오류:', error)
    }

    return () => {
      paymentMethodsWidgetRef.current = null
      setPaymentMethodsWidgetReady(false)
    }
  }, [paymentWidget, isModalOpen, coinPrice, elementId])

  useEffect(() => {
    const paymentMethodsWidget = paymentMethodsWidgetRef.current
    if (paymentMethodsWidget && isModalOpen) {
      paymentMethodsWidget.updateAmount(coinPrice)
    }
  }, [coinPrice, isModalOpen])

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handlePayment = async () => {
    if (!paymentWidget || !paymentMethodsWidgetReady) {
      return
    }

    try {
      // 1. 결제 주문 생성
      const orderRes = await createOrder(productId)
      const { orderId } = orderRes

      // 2. toss 결제창 실행

      await paymentWidget.requestPayment({
        orderId,
        orderName: `코인 ${coinCount}개`,
        customerName: user?.nickname,
        customerEmail: user?.email,
        successUrl: `${window.location.origin}/coin/success`,
        failUrl: `${window.location.origin}/coin/fail`,
      })
    } catch (error) {
      console.error('결제 오류:', error)
    }
  }

  return (
    <>
      <CoinBoxContainer onClick={handleOpenModal}>
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
      </CoinBoxContainer>

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

              <div id={`payment-widget-${elementId}`}></div>

              <div id={`agreement-${elementId}`}></div>

              <Button
                disabled={!paymentMethodsWidgetReady}
                onClick={handlePayment}
              >
                {coinPrice.toLocaleString()}원 결제하기
              </Button>
            </BoxSection>
          </Wrapper>
        </PaymentModalOverlay>
      )}
    </>
  )
}

export default CoinPurchase
