/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { RootContainer, EmoticonsContainer } from './style'
import { fetchWithRefresh } from '../../utils/fetchWithRefresh'

const EmotionPurchase = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    const fetchEmoticon = async () => {
      const res = await fetchWithRefresh(
        `http://lohttps://mindmate.shopcalhost/api/emoticons/purchase/${id}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: id,
          }),
        }
      )
      if (res.ok) {
        navigate('/emoticons')
      } else {
        navigate('/emoticons/purchase/fail')
      }
    }
    fetchEmoticon()
  }, [id])

  return (
    <RootContainer>
      <EmoticonsContainer></EmoticonsContainer>
    </RootContainer>
  )
}

export default EmotionPurchase
