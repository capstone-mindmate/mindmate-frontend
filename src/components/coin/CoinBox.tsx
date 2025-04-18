import { CoinIcon } from '../../components/icon/iconComponents'
import {
  CoinBoxContainer,
  CoinBoxText,
  CoinBoxValue,
} from '../../styles/CoinBoxStyles'

interface CoinBoxProps {
  coinCount: number
}

const CoinBox = ({ coinCount }: CoinBoxProps) => {
  return (
    <CoinBoxContainer>
      <CoinBoxText>현재 보유한 코인</CoinBoxText>
      <CoinBoxValue>
        <CoinIcon color="#392111" />
        {coinCount}개
      </CoinBoxValue>
    </CoinBoxContainer>
  )
}

export default CoinBox
