import React, { useState, useRef, useEffect, useCallback } from 'react'
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
import { getTokenCookie } from '../../utils/fetchWithRefresh'
import { MagazineItem, MagazineApiResponse } from './magazinedata'

const MyList: React.FC = () => {
  const navigate = useNavigate()
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<
    '관심 목록' | '작성 목록'
  >('관심 목록')
  const [magazineItems, setMagazineItems] = useState<MagazineItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize] = useState(10)
  const [hasMore, setHasMore] = useState(true)

  // 매거진 데이터 조회 함수
  const fetchMagazines = async (page = currentPage, isInitialLoad = false) => {
    if (isLoading || (!hasMore && !isInitialLoad)) return

    setIsLoading(true)
    setError(null)

    try {
      // 인증 토큰 가져오기
      const accessToken = getTokenCookie('accessToken')
      if (!accessToken) {
        console.warn('인증 토큰이 없습니다.')
        setError('로그인이 필요합니다.')
        setIsLoading(false)
        return
      }

      // API 엔드포인트 선택 (선택된 카테고리에 따라)
      const endpoint =
        selectedCategory === '관심 목록'
          ? 'https://mindmate.shop/api/magazines/liked'
          : 'https://mindmate.shop/api/magazines/my'

      // 쿼리 파라미터 생성
      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('size', pageSize.toString())

      // API URL
      const apiUrl = `${endpoint}?${params.toString()}`

      // API 호출
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error(
          `API 호출 실패: ${response.status} ${response.statusText}`
        )
      }

      const data: MagazineApiResponse = await response.json()
      //console.log('API 응답:', data)

      // 더 불러올 데이터가 있는지 확인
      const newHasMore = !data.last
      setHasMore(newHasMore)

      // 데이터 매핑 - API 응답 구조에 맞게 매거진 아이템으로 변환
      const fetchedItems: MagazineItem[] = data.content.map((item) => {
        // 이미지 URL 추출 및 처리
        let thumbnailUrl = ''
        const imageContents = item.contents.filter(
          (content) => content.type === 'IMAGE' && content.imageUrl
        )

        // id 기준으로 정렬하여 가장 작은 id의 이미지 선택
        if (imageContents.length > 0) {
          // id 기준 오름차순 정렬
          const sortedImageContents = [...imageContents].sort(
            (a, b) => a.id - b.id
          )
          const smallestIdImage = sortedImageContents[0]

          if (smallestIdImage && smallestIdImage.imageUrl) {
            // 이미지 URL이 상대 경로인 경우 기본 URL 추가
            thumbnailUrl = smallestIdImage.imageUrl.startsWith('http')
              ? smallestIdImage.imageUrl
              : `https://mindmate.shop/api${smallestIdImage.imageUrl}`
          }
        }

        // 텍스트 콘텐츠 추출
        const textContent = item.contents.find(
          (content) => content.type === 'TEXT' && content.text
        )

        const description = textContent?.text || ''

        // 매거진 아이템 생성
        return {
          id: item.id.toString(),
          title: item.title,
          detail: item.subtitle || '',
          thumbnailUrl: thumbnailUrl,
          category: item.category,
          likeCount: item.likeCount,
          authorName: item.authorName,
          authorId: item.authorId,
          updatedAt: new Date(item.updatedAt),
          description,
        }
      })

      // 데이터 업데이트 (초기 로드면 대체, 아니면 추가)
      if (isInitialLoad) {
        setMagazineItems(fetchedItems)
      } else {
        setMagazineItems((prev) => [...prev, ...fetchedItems])
      }
    } catch (error) {
      console.error('매거진 목록 조회 오류:', error)
      setError(
        error instanceof Error
          ? error.message
          : '매거진 목록을 불러오는 중 오류가 발생했습니다'
      )
      setHasMore(false)
    } finally {
      setIsLoading(false)
    }
  }

  // 무한 스크롤 Observer 설정
  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return

      if (observerRef.current) observerRef.current.disconnect()

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setCurrentPage((prevPage) => prevPage + 1)
          }
        },
        { threshold: 0.5 }
      )

      if (node) observerRef.current.observe(node)
    },
    [isLoading, hasMore]
  )

  // 선택된 카테고리에 따라 데이터 다시 로드
  useEffect(() => {
    setMagazineItems([]) // 카테고리 변경 시 목록 초기화
    setCurrentPage(0) // 페이지 초기화
    setHasMore(true) // 더 불러올 데이터 있음으로 초기화
    fetchMagazines(0, true) // 초기 데이터 로드
  }, [selectedCategory])

  // 페이지 변경 시 추가 데이터 로드
  useEffect(() => {
    // 첫 페이지가 아닐 때만 추가 데이터 로드
    if (currentPage > 0) {
      fetchMagazines(currentPage, false)
    }
  }, [currentPage])

  const handleCategorySelect = (category: '관심 목록' | '작성 목록') => {
    setSelectedCategory(category)
  }

  const handlePostClick = (item: MagazineItem) => {
    //console.log('게시글 클릭:', item)
    navigate(`/magazine/${item.id}`)
  }

  const handleBackClick = () => {
    navigate(-1) // 이전 페이지로 이동
  }

  return (
    <RootContainer>
      <ContentWrapper>
        <TopBar
          title="내 매거진"
          showBackButton
          onBackClick={handleBackClick}
          actionText=""
        />

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
          {error && <EmptyMessage>{error}</EmptyMessage>}

          {!error && magazineItems.length > 0 ? (
            <Magazine
              items={magazineItems}
              onItemClick={handlePostClick}
              onBackClick={handleBackClick}
            />
          ) : !isLoading && !error ? (
            <EmptyMessage>
              {selectedCategory === '관심 목록'
                ? '좋아요를 누른 매거진이 없습니다.'
                : '작성한 매거진이 없습니다.'}
            </EmptyMessage>
          ) : null}

          {/* 로딩 인디케이터 (무한 스크롤용) */}
          <div
            ref={lastElementRef}
            style={{ height: '20px', margin: '20px 0' }}
          >
            {isLoading && <EmptyMessage>로딩 중...</EmptyMessage>}
          </div>
        </MagazineContent>
      </ContentWrapper>

      <NavigationWrapper>
        <NavigationComponent />
      </NavigationWrapper>
    </RootContainer>
  )
}

export default MyList
