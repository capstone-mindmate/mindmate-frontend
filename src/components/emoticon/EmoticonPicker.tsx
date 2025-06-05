import Emoticon, { EmoticonType } from './Emoticon'
import {
  PickerContainer,
  ScrollableContainer,
  EmoticonGrid,
  EmoticonItem,
  ShopButton,
  ShopText,
  ShopArrow,
} from '../../styles/EmoticonPickerStyles'
import { useEffect, useState } from 'react'
import { fetchWithRefresh } from '../../utils/fetchWithRefresh'

interface EmoticonPickerProps {
  onSelectEmoticon: (type: EmoticonType) => void
  onShopClick: () => void
  onClose: () => void
}

interface EmoticonData {
  id: string
  type: EmoticonType
  imageUrl: string
}

function EmoticonPicker({
  onSelectEmoticon,
  onShopClick,
  onClose,
}: EmoticonPickerProps) {
  // 보유 이모티콘 상태
  const [availableEmoticons, setAvailableEmoticons] = useState<EmoticonData[]>(
    []
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAvailableEmoticons = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetchWithRefresh(
          'https://mindmate.shop/api/emoticons/available',
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        )
        if (!res.ok) throw new Error('이모티콘 목록을 불러오지 못했습니다.')
        const data = await res.json()
        const emoticons = Array.isArray(data)
          ? data.map((item) => ({
              id: item.id,
              type: item.name,
              imageUrl: item.imageUrl,
            }))
          : []
        setAvailableEmoticons(emoticons)
      } catch (e: any) {
        setError(e.message || '이모티콘 목록을 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }
    fetchAvailableEmoticons()
  }, [])

  // 이모티콘 피커 렌더링 최적화를 위한 함수
  const handleEmoticonClick = (id: string) => {
    onSelectEmoticon(id as EmoticonType)
  }

  return (
    <PickerContainer>
      <ShopButton onClick={onShopClick}>
        <ShopText>이모티콘샵</ShopText>
        <ShopArrow>→</ShopArrow>
      </ShopButton>
      <ScrollableContainer>
        {loading ? (
          <div style={{ padding: '24px', textAlign: 'center' }}>로딩 중...</div>
        ) : error ? (
          <div style={{ padding: '24px', color: 'red', textAlign: 'center' }}>
            {error}
          </div>
        ) : availableEmoticons.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center' }}>
            보유한 이모티콘이 없습니다.
          </div>
        ) : (
          <EmoticonGrid>
            {availableEmoticons.map((emoticon) => (
              <EmoticonItem
                key={emoticon.id}
                onClick={() => handleEmoticonClick(emoticon.id)}
              >
                <Emoticon
                  emoticonURL={'https://mindmate.shop/api' + emoticon.imageUrl}
                  type={emoticon.type}
                  size="medium"
                  alt={`${emoticon.type} 이모티콘`}
                />
              </EmoticonItem>
            ))}
          </EmoticonGrid>
        )}
      </ScrollableContainer>
    </PickerContainer>
  )
}

export default EmoticonPicker
