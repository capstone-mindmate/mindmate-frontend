/** @jsxImportSource @emotion/react */
import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { LogoutContainer, LogoutText } from './styles/logoutStyles'

interface LogoutProps {
  text: string
  onClick: () => void
}

const Logout = ({ text, onClick }: LogoutProps) => {
  return (
    <LogoutContainer>
      <LogoutText onClick={onClick}>{text}</LogoutText>
    </LogoutContainer>
  )
}

export default Logout
