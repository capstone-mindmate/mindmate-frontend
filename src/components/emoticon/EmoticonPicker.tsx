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

interface EmoticonPickerProps {
  onSelectEmoticon: (type: EmoticonType) => void
  onShopClick: () => void
  onClose: () => void
}

function EmoticonPicker({
  onSelectEmoticon,
  onShopClick,
  onClose,
}: EmoticonPickerProps) {
  // 모든 이모티콘 타입 배열
  const allEmoticonTypes: EmoticonType[] = [
    'normal',
    'love',
    'music',
    'sad',
    'angry',
    'couple',
    'default',
    'talking',
    'thumbsUp',
    'student',
    'graduate',
    'hoodie',
    'study',
    'thanks',
  ]

  // 이모티콘 피커 렌더링 최적화를 위한 함수
  const handleEmoticonClick = (type: EmoticonType) => {
    onSelectEmoticon(type)
  }

  return (
    <PickerContainer>
      <ShopButton onClick={onShopClick}>
        <ShopText>이모티콘샵</ShopText>
        <ShopArrow>→</ShopArrow>
      </ShopButton>
      <ScrollableContainer>
        <EmoticonGrid>
          {allEmoticonTypes.map((type) => (
            <EmoticonItem key={type} onClick={() => handleEmoticonClick(type)}>
              <Emoticon type={type} size="medium" alt={`${type} 이모티콘`} />
            </EmoticonItem>
          ))}
        </EmoticonGrid>
      </ScrollableContainer>
    </PickerContainer>
  )
}

export default EmoticonPicker
