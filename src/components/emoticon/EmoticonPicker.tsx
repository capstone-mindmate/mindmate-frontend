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
  onSelectEmoticon: (emoticon: {
    id: string
    imageUrl: string
    type?: string
  }) => void // 전체 객체를 전달하도록 수정
  onShopClick: () => void
  onClose: () => void
}

interface EmoticonData {
  id: string
  name: string // 이모티콘 타입명
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

        // API 응답을 EmoticonData 형태로 변환
        const emoticons = Array.isArray(data)
          ? data.map((item) => ({
              id: item.id.toString(), // ID를 문자열로 변환
              name: item.name, // 이모티콘 타입명
              imageUrl: item.imageUrl,
            }))
          : []

        //console.log('가져온 이모티콘 목록:', emoticons)
        setAvailableEmoticons(emoticons)
      } catch (e: any) {
        console.error('이모티콘 목록 조회 실패:', e)
        setError(e.message || '이모티콘 목록을 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }
    fetchAvailableEmoticons()
  }, [])

  // 이모티콘 클릭 핸들러 - 전체 객체를 전달하도록 수정
  const handleEmoticonClick = (emoticon: EmoticonData) => {
    //console.log('이모티콘 선택됨:', emoticon)

    // 전체 이모티콘 객체를 전달
    onSelectEmoticon({
      id: emoticon.id,
      imageUrl: emoticon.imageUrl, // 이미 완전한 URL
      type: emoticon.name,
    })
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
                onClick={() => handleEmoticonClick(emoticon)} // 전체 객체 전달
              >
                <Emoticon
                  emoticonURL={'https://mindmate.shop/api' + emoticon.imageUrl}
                  type={emoticon.name as EmoticonType} // 타입 변환
                  size="medium"
                  alt={`${emoticon.name} 이모티콘`}
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
