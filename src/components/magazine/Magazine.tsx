import {
  MagazineGrid,
  MagazineItemContainer,
  ImageContainer,
  MagazineImage,
  TextOverlay,
  TitleText,
  DetailText,
  ImageGradient,
} from '../../styles/MagazineStyles'

// 매거진 아이템 인터페이스
interface MagazineItem {
  id: string | number
  title: string
  detail: string
  imageSrc: string
}

// MagazineItem 컴포넌트 Props
interface MagazineItemProps {
  item: MagazineItem
  onClick?: () => void
}

// 매거진 아이템 컴포넌트
const MagazineItem = ({ item, onClick }: MagazineItemProps) => {
  return (
    <MagazineItemContainer onClick={onClick}>
      <ImageContainer>
        <MagazineImage src={item.imageSrc} alt={item.title} />
        <ImageGradient />
        <TextOverlay>
          <TitleText>{item.title}</TitleText>
          <DetailText>{item.detail}</DetailText>
        </TextOverlay>
      </ImageContainer>
    </MagazineItemContainer>
  )
}

// Magazine 컴포넌트 Props 인터페이스
interface MagazineProps {
  title?: string
  items: MagazineItem[]
  onItemClick?: (item: MagazineItem) => void
  onBackClick?: () => void
}

// Magazine 메인 컴포넌트
const Magazine = ({ items, onItemClick }: MagazineProps) => {
  return (
    <div>
      <MagazineGrid>
        {items.map((item) => (
          <MagazineItem
            key={item.id}
            item={item}
            onClick={() => onItemClick && onItemClick(item)}
          />
        ))}
      </MagazineGrid>
    </div>
  )
}

export default Magazine
