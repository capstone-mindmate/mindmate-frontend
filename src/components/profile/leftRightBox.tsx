/** @jsxImportSource @emotion/react */
import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import {
  LeftRightBoxContainer,
  LeftText,
  RightText,
} from './styles/leftRightBoxStyles'

interface LeftRightBoxProps {
  leftText: string
  rightText: string
}

const LeftRightBox = ({ leftText, rightText }: LeftRightBoxProps) => {
  return (
    <LeftRightBoxContainer>
      <LeftText>{leftText}</LeftText>
      <RightText>{rightText}</RightText>
    </LeftRightBoxContainer>
  )
}

export default LeftRightBox
