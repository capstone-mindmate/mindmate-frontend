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

const EventCoinPurchase = ({
  coinCount,
  coinPrice,
}: EventCoinPurchaseProps) => {
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
      await paymentWidget.requestPayment({
        orderId: nanoid(),
        orderName: `코인 ${coinCount}개`,
        customerName: '유저닉네임',
        customerEmail: '유저이메일',
        successUrl: `${window.location.origin}/coin/success`,
        failUrl: `${window.location.origin}/coin/fail`,
      })
    } catch (error) {
      console.error('결제 오류:', error)
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

export default EventCoinPurchase
