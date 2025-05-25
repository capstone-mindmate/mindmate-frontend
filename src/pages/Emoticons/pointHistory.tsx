/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  RootContainer,
  EmoticonsContainer,
  TopItemContainer,
  PointHistoryContainer,
} from './style'
import TopBar from '../../components/topbar/Topbar'
import CoinBox from '../../components/coin/CoinBox'
import PointHistory from '../../components/point/pointHistory'
import { fetchWithRefresh } from '../../utils/fetchWithRefresh'

const reasonTypeMap: Record<string, string> = {
  COUNSELING_PROVIDED: '상담 제공',
  COUNSELING_RECEIVED: '상담 이용',
  EMOTICON_PURCHASE: '이모티콘 구매',
  COIN_CHARGE: '코인 충전',
  // 필요시 추가
}

const PointHistoryPage = () => {
  const navigate = useNavigate()
  const [histories, setHistories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [coin, setCoin] = useState<number>(0)

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true)
      try {
        // 코인 잔액은 /profiles에서 받아옴
        const profileRes = await fetchWithRefresh(
          'https://mindmate.shop/api/profiles',
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        )
        const profileData = await profileRes.json()
        setCoin(profileData.points ?? 0)

        // 코인 내역은 /porints/transactions에서 받아옴
        const res = await fetchWithRefresh(
          'https://mindmate.shop/api/points/transactions',
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        )
        const data = await res.json()
        setHistories(Array.isArray(data) ? data : [])
      } catch (e) {
        setHistories([])
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  return (
    <RootContainer>
      <TopBar title="코인 사용내역" showBackButton={true} />
      <EmoticonsContainer>
        <TopItemContainer>
          <CoinBox coinCount={coin} />
        </TopItemContainer>

        <PointHistoryContainer>
          {loading ? (
            <div></div>
          ) : (
            histories.map((h, idx) => (
              <PointHistory
                key={h.id}
                historyName={reasonTypeMap[h.reasonType] || h.reasonType}
                historyDate={h.createdAt.slice(0, 10)}
                historyPoint={h.amount}
                historyBalance={h.balance}
                historyType={h.transactionType === 'EARN' ? 'earn' : 'use'}
                borderTop={false}
                borderBottom={idx !== histories.length - 1}
              />
            ))
          )}
        </PointHistoryContainer>
      </EmoticonsContainer>
    </RootContainer>
  )
}

export default PointHistoryPage
