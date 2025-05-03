/** @jsxImportSource @emotion/react */
import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import {
  RedirectBoxContainer,
  RedirectBoxText,
  IconWrapper,
} from './styles/redirectBoxStyles'

import { BackIcon } from '../icon/iconComponents'

interface RedirectBoxProps {
  text: string
  onClick: () => void
}

const RedirectBox = ({ text, onClick }: RedirectBoxProps) => {
  return (
    <RedirectBoxContainer onClick={onClick}>
      <RedirectBoxText>{text}</RedirectBoxText>
      <IconWrapper>
        <BackIcon color="#150C06" strokeWidth={1.5} />
      </IconWrapper>
    </RedirectBoxContainer>
  )
}

export default RedirectBox
