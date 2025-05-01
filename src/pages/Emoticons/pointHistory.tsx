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

const PointHistoryPage = () => {
  const navigate = useNavigate()

  return (
    <RootContainer>
      <TopBar title="코인 사용내역" showBackButton={true} />
      <EmoticonsContainer>
        <TopItemContainer>
          <CoinBox coinCount={500} />
        </TopItemContainer>

        <PointHistoryContainer>
          <PointHistory
            historyName="이모티콘 구매"
            historyDate="2025-01-17"
            historyPoint={1000}
            historyBalance={1000}
            historyType="earn"
            borderTop={false}
            borderBottom={true}
          />

          <PointHistory
            historyName="이모티콘 구매"
            historyDate="2025-01-17"
            historyPoint={1000}
            historyBalance={1000}
            historyType="earn"
            borderTop={false}
            borderBottom={true}
          />

          <PointHistory
            historyName="이모티콘 구매"
            historyDate="2025-01-17"
            historyPoint={1000}
            historyBalance={1000}
            historyType="earn"
            borderTop={false}
            borderBottom={true}
          />

          <PointHistory
            historyName="이모티콘 구매"
            historyDate="2025-01-17"
            historyPoint={1000}
            historyBalance={1000}
            historyType="earn"
            borderTop={false}
            borderBottom={true}
          />

          <PointHistory
            historyName="이모티콘 구매"
            historyDate="2025-01-17"
            historyPoint={1000}
            historyBalance={1000}
            historyType="earn"
            borderTop={false}
            borderBottom={true}
          />

          <PointHistory
            historyName="이모티콘 구매"
            historyDate="2025-01-17"
            historyPoint={1000}
            historyBalance={1000}
            historyType="earn"
            borderTop={false}
            borderBottom={true}
          />

          <PointHistory
            historyName="이모티콘 구매"
            historyDate="2025-01-17"
            historyPoint={1000}
            historyBalance={1000}
            historyType="earn"
            borderTop={false}
            borderBottom={true}
          />

          <PointHistory
            historyName="이모티콘 구매"
            historyDate="2025-01-17"
            historyPoint={1000}
            historyBalance={1000}
            historyType="earn"
            borderTop={false}
            borderBottom={true}
          />

          <PointHistory
            historyName="이모티콘 구매"
            historyDate="2025-01-17"
            historyPoint={1000}
            historyBalance={1000}
            historyType="earn"
            borderTop={false}
            borderBottom={false}
          />
        </PointHistoryContainer>
      </EmoticonsContainer>
    </RootContainer>
  )
}

export default PointHistoryPage
