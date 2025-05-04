/** @jsxImportSource @emotion/react */
import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { WithdrawContainer, WithdrawText } from './styles/withdrawStyles'

interface WithdrawProps {
  text: string
  onClick: () => void
}

const Withdraw = ({ text, onClick }: WithdrawProps) => {
  return (
    <WithdrawContainer>
      <WithdrawText onClick={onClick}>{text}</WithdrawText>
    </WithdrawContainer>
  )
}

export default Withdraw
