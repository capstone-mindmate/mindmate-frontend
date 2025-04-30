import { CoinIcon } from '../../components/icon/iconComponents'
import { CoinBoxCotainer, PriceInfo } from '../../styles/CoinBoxStyles'
import PurchaseButton from '../buttons/purchaseButton'

interface CoinBoxProps {
  coinCount: number
  coinPrice: number
}

const CoinBox = ({ coinCount, coinPrice }: CoinBoxProps) => {
  return (
    <CoinBoxCotainer>
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
    </CoinBoxCotainer>
  )
}

export default CoinBox
