import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../../components/topbar/Topbar'
import Magazine from '../../components/magazine/Magazine'
import NavigationComponent from '../../components/navigation/navigationComponent'
import {
  RootContainer,
  ContentWrapper,
  NavigationWrapper,
  TopFixedContent,
  CategoryContainer,
  CategoryItem,
  CategoryItemText,
  MagazineContent,
  EmptyMessage,
} from './styles/MyListStyles'

// 매거진 아이템 인터페이스
interface MagazineItem {
  id: string | number
  title: string
  detail: string
  imageSrc: string
  category?: string
  likeCount?: number
}

// 더미 데이터 - 관심 목록 (좋아요 누른 게시글)
const likedPosts: MagazineItem[] = [
  {
    id: 8,
    title: '진로 고민, 어떻게 해결할까?',
    detail: '진로 결정에 도움이 되는 팁',
    imageSrc: '/public/image.png',
    category: 'CAREER',
    likeCount: 89,
  },
  {
    id: 9,
    title: '대학생 재테크의 시작',
    detail: '작은 돈으로 시작하는 투자법',
    imageSrc: '/public/image.png',
    category: 'FINANCIAL',
    likeCount: 115,
  },
  {
    id: 10,
    title: '효과적인 팀 프로젝트 협업 방법',
    detail: '팀플 스트레스 줄이는 꿀팁',
    imageSrc: '/public/image.png',
    category: 'ACADEMIC',
    likeCount: 73,
  },
  {
    id: 11,
    title: '연애와 학업, 균형 잡는 법',
    detail: '대학 생활 속 연애 조언',
    imageSrc: '/public/image.png',
    category: 'RELATIONSHIP',
    likeCount: 128,
  },
]

// 더미 데이터 - 작성 목록 (내가 작성한 게시글)
const writtenPosts: MagazineItem[] = [
  {
    id: 5,
    title: '대학생 취업 준비 가이드',
    detail: '취업 준비, 언제부터 시작해야 할까?',
    imageSrc: '/public/image.png',
    category: 'EMPLOYMENT',
    likeCount: 135,
  },
  {
    id: 6,
    title: '학업 스트레스 이겨내는 법',
    detail: '시험기간 스트레스 관리 방법',
    imageSrc: '/public/image.png',
    category: 'ACADEMIC',
    likeCount: 67,
  },
  {
    id: 7,
    title: '건강한 대학생활을 위한 습관',
    detail: '대학생활에 꼭 필요한 건강 루틴',
    imageSrc: '/public/image.png',
    category: 'CAMPUS_LIFE',
    likeCount: 102,
  },
]

const MyList: React.FC = () => {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState<
    '관심 목록' | '작성 목록'
  >('관심 목록')
  const [displayPosts, setDisplayPosts] = useState<MagazineItem[]>(likedPosts)
  const [loading, setLoading] = useState(false)

  // 선택된 카테고리에 따라 표시할 게시글 목록 변경
  useEffect(() => {
    setLoading(true)

    // 약간의 딜레이를 줘서 로딩 상태 확인 가능
    setTimeout(() => {
      if (selectedCategory === '관심 목록') {
        setDisplayPosts(likedPosts)
      } else {
        setDisplayPosts(writtenPosts)
      }
      setLoading(false)
    }, 300)
  }, [selectedCategory])

  const handleCategorySelect = (category: '관심 목록' | '작성 목록') => {
    setSelectedCategory(category)
  }

  const handlePostClick = (item: MagazineItem) => {
    console.log('게시글 클릭:', item)
    navigate(`/magazine/${item.id}`)
  }

  const handleBackClick = () => {
    navigate(-1) // 이전 페이지로 이동
  }

  return (
    <RootContainer>
      <ContentWrapper>
        <TopBar title="내 매거진" showBackButton actionText="" />

        <TopFixedContent>
          <CategoryContainer>
            <CategoryItem
              isSelected={selectedCategory === '관심 목록'}
              onClick={() => handleCategorySelect('관심 목록')}
            >
              <CategoryItemText>관심 목록</CategoryItemText>
            </CategoryItem>

            <CategoryItem
              isSelected={selectedCategory === '작성 목록'}
              onClick={() => handleCategorySelect('작성 목록')}
            >
              <CategoryItemText>작성 목록</CategoryItemText>
            </CategoryItem>
          </CategoryContainer>
        </TopFixedContent>

        <MagazineContent>
          {loading ? (
            <EmptyMessage>로딩 중...</EmptyMessage>
          ) : displayPosts.length > 0 ? (
            <Magazine
              items={displayPosts}
              onItemClick={handlePostClick}
              onBackClick={handleBackClick}
            />
          ) : (
            <EmptyMessage>게시글이 없습니다.</EmptyMessage>
          )}
        </MagazineContent>
      </ContentWrapper>

      <NavigationWrapper>
        <NavigationComponent />
      </NavigationWrapper>
    </RootContainer>
  )
}

export default MyList
