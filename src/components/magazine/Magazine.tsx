import React, { useState, useEffect } from 'react'
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
export interface MagazineItem {
  id: string | number
  title: string
  detail: string
  thumbnailUrl: string // imageUrl에서 thumbnailUrl로 변경
  category?: string
  description?: string
  likeCount?: number
  authorName?: string
  authorId?: number
  updatedAt?: Date
}

// MagazineItem 컴포넌트 Props
interface MagazineItemProps {
  item: MagazineItem
  onClick?: () => void
  index: number
}

// 이미지 URL이 유효한지 확인하는 함수
const isValidImageUrl = (url: string): boolean => {
  return (
    url &&
    url.trim() !== '' &&
    (url.startsWith('http://') ||
      url.startsWith('http://') ||
      url.startsWith('/'))
  )
}

// 이미지 오류 처리 함수
const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  console.warn('이미지 로드 실패:', e.currentTarget.src)
  // CSS 클래스 추가
  e.currentTarget.classList.add('image-load-error')
}

// 매거진 아이템 컴포넌트
const MagazineItem = ({ item, onClick, index }: MagazineItemProps) => {
  // 이미지 URL 확인 및 처리
  const imageUrl = item.thumbnailUrl || ''
  const [isVisible, setIsVisible] = useState(false)

  // 애니메이션 효과를 위한 스타일
  const style = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    transition: 'opacity 0.4s ease, transform 0.4s ease',
    transitionDelay: `${index * 50}ms`,
    willChange: 'transform, opacity',
  }

  // 컴포넌트가 마운트되면 애니메이션 시작
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 50)

    return () => clearTimeout(timer)
  }, [])

  return (
    <MagazineItemContainer
      onClick={onClick}
      className="magazine-item"
      style={style}
      data-id={item.id.toString()}
    >
      <ImageContainer>
        {isValidImageUrl(imageUrl) ? (
          <MagazineImage
            src={imageUrl}
            alt={item.title}
            onError={handleImageError}
            loading="lazy" // 이미지 지연 로딩
          />
        ) : (
          <div
            className="magazine-thumbnail-placeholder"
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666',
            }}
          >
            <span>이미지 없음</span>
          </div>
        )}
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
  // 아이템이 없는 경우
  if (!items || items.length === 0) {
    return <div>표시할 매거진이 없습니다.</div>
  }

  return (
    <div className="magazine-container">
      <MagazineGrid>
        {items.map((item, index) => (
          <MagazineItem
            key={item.id}
            item={item}
            index={index}
            onClick={() => onItemClick && onItemClick(item)}
          />
        ))}
      </MagazineGrid>
    </div>
  )
}

export default Magazine
