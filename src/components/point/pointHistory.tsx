/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

interface PointHistoryProps {
  historyName: string
  historyDate: string
  historyPoint: number
  historyBalance: number
  borderTop?: boolean
  borderBottom?: boolean
  historyType?: 'earn' | 'use'
}

const pointHistoryStyles = {
  container: (borderTop: boolean, borderBottom: boolean) => css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 24px 0;
    border-top: ${borderTop ? '1px solid #D9D9D9' : 'none'};
    border-bottom: ${borderBottom ? '1px solid #D9D9D9' : 'none'};
  `,
  left: css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 2px;
  `,
  right: css`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    gap: 2px;
  `,

  historyName: css`
    font-size: 16px;
    line-height: 1.5;
    color: #000000;
    margin: 0;
  `,
  historyDate: css`
    font-size: 14px;
    line-height: 1.4;
    color: #727272;
    margin: 0;
  `,
  historyPoint: (historyType: 'earn' | 'use') => css`
    font-size: 16px;
    font-weight: 700;
    color: ${historyType === 'earn' ? '#1B5BFE' : '#FB4F50'};
    margin: 0;
  `,
  historyBalance: css`
    font-size: 14px;
    line-height: 1.4;
    color: #727272;
    margin: 0;
  `,
}

const PointHistory = ({
  historyName,
  historyDate,
  historyPoint,
  historyBalance,
  historyType = 'earn',
  borderTop = true,
  borderBottom = true,
}: PointHistoryProps) => {
  return (
    <div
      className="container"
      css={pointHistoryStyles.container(borderTop, borderBottom)}
    >
      <div className="left" css={pointHistoryStyles.left}>
        <p css={pointHistoryStyles.historyName}>{historyName}</p>
        <p css={pointHistoryStyles.historyDate}>{historyDate}</p>
      </div>
      <div className="right" css={pointHistoryStyles.right}>
        <p css={pointHistoryStyles.historyPoint(historyType)}>
          {historyType === 'earn' ? '+' : '-'}
          {historyPoint}코인
        </p>
        <p css={pointHistoryStyles.historyBalance}>{historyBalance}코인</p>
      </div>
    </div>
  )
}

export default PointHistory
