/** @jsxImportSource @emotion/react */
import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { RootContainer, EmoticonsContainer } from './style'
import { fetchWithRefresh } from '../../utils/fetchWithRefresh'

const EmotionPurchase = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [isProcessing, setIsProcessing] = useState(false)
  const hasCalledAPI = useRef(false)

  useEffect(() => {
    // 이미 API를 호출했거나 현재 처리 중이면 중복 호출 방지
    if (hasCalledAPI.current || isProcessing || !id) {
      return
    }

    const fetchEmoticon = async () => {
      try {
        setIsProcessing(true)
        console.log(hasCalledAPI.current)
        hasCalledAPI.current = true // API 호출 시작 표시

        const res = await fetchWithRefresh(
          `http://localhost/api/emoticons/purchase/${id}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: id,
            }),
          }
        )

        if (res.ok) {
          navigate('/emoticons', { replace: true }) // replace를 사용해 히스토리 스택에서 현재 페이지 제거
        } else {
          navigate('/emoticons/purchase/fail', { replace: true })
        }
      } catch (error) {
        console.error('이모티콘 구매 중 오류 발생:', error)
        navigate('/emoticons/purchase/fail', { replace: true })
      } finally {
        setIsProcessing(false)
      }
    }

    fetchEmoticon()
  }, [id, navigate])

  // 컴포넌트가 언마운트될 때 정리
  useEffect(() => {
    return () => {
      hasCalledAPI.current = false
    }
  }, [])

  return (
    <RootContainer>
      <EmoticonsContainer></EmoticonsContainer>
    </RootContainer>
  )
}

export default EmotionPurchase
