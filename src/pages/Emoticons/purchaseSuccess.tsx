/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { css } from '@emotion/react'

import {
  RootContainer,
  PurchaseResultContainer,
  PurchaseResultHeaderText,
} from './style'
import Emoticon from '../../components/emoticon/Emoticon'

const PurchaseSuccess = () => {
  const navigate = useNavigate()
  const [leaveCount, setLeaveCount] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setLeaveCount((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timer)
          navigate(-1)
          return 0
        }
        return prevCount - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [navigate])

  const handleExit = () => {
    navigate(-1)
  }

  return (
    <RootContainer>
      <PurchaseResultContainer>
        <PurchaseResultHeaderText>
          결제가 완료되었습니다.
        </PurchaseResultHeaderText>

        <Emoticon type="love" size="xlarge" />

        <p
          css={css`
            margin: 0;
            font-size: 16px;
            color: #666;
            text-align: center;
          `}
        >
          {leaveCount}초 뒤에 이전 페이지로 이동합니다.
        </p>

        <button
          onClick={handleExit}
          css={css`
            padding: 12px 24px;
            background-color: #392111;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s;

            &:hover {
              background-color: #503018;
            }

            &:active {
              background-color: #2a180d;
            }
          `}
        >
          나가기
        </button>
      </PurchaseResultContainer>
    </RootContainer>
  )
}

export default PurchaseSuccess
