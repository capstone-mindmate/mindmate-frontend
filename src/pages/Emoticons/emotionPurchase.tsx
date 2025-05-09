/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { RootContainer, EmoticonsContainer } from './style'

const EmotionPurchase = () => {
  const navigate = useNavigate()

  return (
    <RootContainer>
      <EmoticonsContainer></EmoticonsContainer>
    </RootContainer>
  )
}

export default EmotionPurchase
