/** @jsxImportSource @emotion/react */
import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { RootContainer, MainContainer } from './WithdrawStyles'

import TopBar from '../../components/topbar/Topbar'

const WithdrawMindMate = () => {
  const navigate = useNavigate()
  return (
    <RootContainer>
      <TopBar
        title="회원 탈퇴"
        showBackButton={true}
        onBackClick={() => navigate('/')}
      />
      <MainContainer></MainContainer>
    </RootContainer>
  )
}

export default WithdrawMindMate
