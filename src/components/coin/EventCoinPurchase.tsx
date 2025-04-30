import { CoinIcon } from '../../components/icon/iconComponents'
import PurchaseButton from '../buttons/purchaseButton'
import {
  loadPaymentWidget,
  PaymentWidgetInstance,
} from '@tosspayments/payment-widget-sdk'

import { EventCoinBoxContainer, PriceInfo } from '../../styles/CoinBoxStyles'

interface EventCoinPurchaseProps {
  coinCount: number
  coinPrice: number
}

const clientKey = 'test_ck_GePWvyJnrK4jZNLyZlOO8gLzN97E'
const customerKey = 'YbX2HuSlsC9uVJW6NMRMj'

const EventCoinPurchase = ({
  coinCount,
  coinPrice,
}: EventCoinPurchaseProps) => {
  return (
    <EventCoinBoxContainer>
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
  )
}

export default EventCoinPurchase
