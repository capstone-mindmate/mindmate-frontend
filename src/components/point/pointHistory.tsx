/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

interface PointHistoryProps {
  historyName: string
  historyDate: string
  historyPoint: number
  historyBalance: number
}

const PointHistory = ({
  historyName,
  historyDate,
  historyPoint,
  historyBalance,
}: PointHistoryProps) => {
  return (
    <div className="container">
      <div className="left">
        <p>{historyName}</p>
        <p>{historyDate}</p>
      </div>
      <div className="right">
        <p>{historyPoint}</p>
        <p>{historyBalance}</p>
      </div>
    </div>
  )
}

export default PointHistory
