/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { css } from '@emotion/react'

import {
  RootContainer,
  PerchaseResultContainer,
  PerchaseResultHeaderText,
} from './style'
import Emoticon from '../../components/emoticon/Emoticon'

const PurchaseFail = () => {
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
      <PerchaseResultContainer>
        <PerchaseResultHeaderText>
          결제에 실패했습니다.
        </PerchaseResultHeaderText>

        <Emoticon type="sad" size="xlarge" />

        <p
          css={css`
            margin-top: 24px;
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
            margin-top: 20px;
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
      </PerchaseResultContainer>
    </RootContainer>
  )
}

export default PurchaseFail
