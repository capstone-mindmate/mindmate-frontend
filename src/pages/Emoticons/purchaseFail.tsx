/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { css } from '@emotion/react'

import {
  RootContainer,
  PurchaseResultContainer,
  PurchaseResultHeaderText,
} from './style'
import Emoticon from '../../components/emoticon/Emoticon'

const PurchaseFail = () => {
  const navigate = useNavigate()
  const [leaveCount, setLeaveCount] = useState(5)
  const location = useLocation()

  useEffect(() => {
    const timer = setInterval(() => {
      setLeaveCount((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timer)
          if (location.pathname === '/emoticons/purchase/fail') {
            navigate('/emoticons')
          } else {
            navigate('/coin')
          }
          return 0
        }
        return prevCount - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [navigate])

  const handleExit = () => {
    if (location.pathname === '/emoticons/purchase/fail') {
      navigate('/emoticons')
    } else {
      navigate('/coin')
    }
  }

  return (
    <RootContainer>
      <PurchaseResultContainer>
        <PurchaseResultHeaderText>
          결제에 실패했습니다.
        </PurchaseResultHeaderText>

        <Emoticon type="sad" size="xlarge" />

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

export default PurchaseFail
