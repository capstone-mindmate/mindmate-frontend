/** @jsxImportSource @emotion/react */
import React, { useState, useRef, useEffect, useCallback } from 'react'
import Magazine from '../../components/magazine/Magazine'
import { useNavigate } from 'react-router-dom'
import {
  SearchIcon,
  ListIcon,
  PlusIcon,
  CloseIcon,
} from '../../components/icon/iconComponents'
import NormalSelectButton from '../../components/buttons/normalSelectButton'
import {
  MagazineListContainer,
  MatchingTopBar,
  TopBarTitle,
  IconList,
  SortOptionsContainer,
  MagazineContent,
  LoadingContainer,
  EmptyMessage,
  TopFixedContent,
  NavigationWrapper,
  ContentWrapper,
} from './styles/MagazineListStyles'
import {
  searchBarStyle,
  searchInputStyle,
  closeButtonStyle,
  searchIconStyle,
  optionsContainerStyle,
  infiniteScrollLoaderStyle,
} from './styles/MagazineListSearchStyles'
import NavigationComponent from '../../components/navigation/navigationComponent'
import {
  CategoryOption,
  SortOption,
  categoryOptions,
  categoryNames,
  categoryMap,
  sortMap,
  sortDisplayMap,
  MagazineItem,
  MagazineApiResponse,
} from './magazineData'
import { getTokenCookie } from '../../utils/fetchWithRefresh'

const MagazineList: React.FC = () => {
  const navigate = useNavigate()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const lastLoadedPageRef = useRef<number>(0) // 마지막으로 로드한 페이지 추적

  // 상태 관리
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState<CategoryOption>('')
  const [sortBy, setSortBy] = useState<SortOption>('POPULARITY') // 기본값을 인기순으로 설정
  const [magazineItems, setMagazineItems] = useState<MagazineItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 애니메이션 관련 상태
  const [animationKey, setAnimationKey] = useState(0)

  // 무한 스크롤 페이지네이션 상태 관리
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize] = useState(10)

  // 로컬 데이터 캐싱
  const [allMagazineItems, setAllMagazineItems] = useState<MagazineItem[]>([])

  // 정렬 및 필터 적용하는 함수
  const applySortAndFilter = () => {
    if (allMagazineItems.length === 0) return

    // 정렬 기능 구현
    const sortedItems = [...allMagazineItems].sort((a, b) => {
      if (sortBy === 'POPULARITY') {
        return (b.likeCount || 0) - (a.likeCount || 0)
      } else if (sortBy === 'LATEST') {
        return (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0)
      } else {
        return (a.updatedAt?.getTime() || 0) - (b.updatedAt?.getTime() || 0)
      }
    })

    // 카테고리 필터링
    const filteredItems = category
      ? sortedItems.filter((item) => item.category === category)
      : sortedItems

    // 검색어 필터링
    const searchedItems = searchQuery
      ? filteredItems.filter(
          (item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.description || '')
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
        )
      : filteredItems

    // 매거진 아이템 업데이트
    setMagazineItems(searchedItems)

    // 애니메이션을 위한 키 업데이트
    setAnimationKey((prev) => prev + 1)
  }

  const fetchMagazines = async (page = currentPage, isInitialLoad = false) => {
    if (isLoading || (!hasMore && !isInitialLoad)) return

    // 같은 페이지를 다시 요청하는 것 방지 (중복 요청 방지)
    if (!isInitialLoad && page === lastLoadedPageRef.current) {
      //console.log(`페이지 ${page} 이미 로드됨, 건너뜀`);
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // 쿼리 파라미터 생성
      const params = new URLSearchParams()
      // 초기 로딩에는 필터 없이 모든 데이터 로드
      if (!isInitialLoad) {
        if (category) params.append('category', category)
        if (searchQuery) params.append('keyword', searchQuery)
        params.append('sortBy', sortBy)
      }
      params.append('page', page.toString())
      params.append('size', pageSize.toString())

      // API URL
      const apiUrl = `httpss://mindmate.shop/api/magazines?${params.toString()}`

      // 인증 토큰 가져오기
      const accessToken = getTokenCookie('accessToken')
      if (!accessToken) {
        console.warn('인증 토큰이 없습니다.')
      }

      // API 호출
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
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

      // 마지막으로 로드한 페이지 업데이트
      lastLoadedPageRef.current = page

      // 더 불러올 데이터가 있는지 확인
      const newHasMore = !data.last
      setHasMore(newHasMore)

      // 데이터 매핑 - API 응답 구조에 맞게 매거진 아이템으로 변환
      const fetchedItems: MagazineItem[] = data.content.map((item) => {
        // 이미지 URL 추출 및 처리: IMAGE 타입 중 가장 작은 id를 가진 항목의 imageUrl 사용
        let thumbnailUrl = ''

        // IMAGE 타입 콘텐츠만 필터링
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
            thumbnailUrl = smallestIdImage.imageUrl.startsWith('https')
              ? smallestIdImage.imageUrl
              : `httpss://mindmate.shop/api${smallestIdImage.imageUrl}`
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
          category: item.category as CategoryOption,
          likeCount: item.likeCount,
          authorName: item.authorName,
          authorId: item.authorId,
          updatedAt: new Date(item.updatedAt),
          description,
        }
      })

      // 데이터 업데이트
      if (isInitialLoad) {
        // 초기 로드 시 모든 아이템을 캐시에 저장하고 정렬/필터 적용
        setAllMagazineItems(fetchedItems)

        // 정렬 및 필터 적용
        const sortedFilteredItems = applySortAndFilterItems(fetchedItems)
        setMagazineItems(sortedFilteredItems)
      } else {
        // 추가 페이지 로드 시 중복 제거 후 추가
        setAllMagazineItems((prev) => {
          // 기존 아이템 ID 목록
          const existingIds = new Set(prev.map((item) => item.id))

          // 중복되지 않는 새 아이템만 필터링
          const newItems = fetchedItems.filter(
            (item) => !existingIds.has(item.id)
          )

          // 로그로 확인
          if (fetchedItems.length !== newItems.length) {
            //console.log(`중복 아이템 ${fetchedItems.length - newItems.length}개 제거됨`);
          }

          return [...prev, ...newItems]
        })

        setMagazineItems((prev) => {
          // 기존 아이템 ID 목록
          const existingIds = new Set(prev.map((item) => item.id))

          // 중복되지 않는 새 아이템만 필터링
          const newItems = fetchedItems.filter(
            (item) => !existingIds.has(item.id)
          )

          return [...prev, ...newItems]
        })
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

  // 정렬 및 필터를 아이템에 적용하는 함수
  const applySortAndFilterItems = (items: MagazineItem[]) => {
    // 정렬 기능 구현
    const sortedItems = [...items].sort((a, b) => {
      if (sortBy === 'POPULARITY') {
        return (b.likeCount || 0) - (a.likeCount || 0)
      } else if (sortBy === 'LATEST') {
        return (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0)
      } else {
        return (a.updatedAt?.getTime() || 0) - (b.updatedAt?.getTime() || 0)
      }
    })

    // 카테고리 필터링
    const filteredItems = category
      ? sortedItems.filter((item) => item.category === category)
      : sortedItems

    // 검색어 필터링
    const searchedItems = searchQuery
      ? filteredItems.filter(
          (item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.description || '')
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
        )
      : filteredItems

    return searchedItems
  }

  // 필터 변경 시 정렬 및 필터 다시 적용
  useEffect(() => {
    if (allMagazineItems.length > 0) {
      // 클라이언트 측에서 정렬 및 필터링 처리
      const filteredSortedItems = applySortAndFilterItems(allMagazineItems)
      setMagazineItems(filteredSortedItems)

      // 애니메이션을 위한 키 업데이트
      setAnimationKey((prev) => prev + 1)
    }
  }, [category, sortBy, searchQuery])

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

  // 페이지 변경 시 추가 데이터 로드
  useEffect(() => {
    // 첫 페이지가 아닐 때만 추가 데이터 로드
    if (currentPage > 0) {
      fetchMagazines(currentPage, false)
    }
  }, [currentPage])

  // 키 이벤트 핸들러
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSearchActive && e.key === 'Escape') {
        toggleSearch()
      }
    }

    // 이벤트 리스너 등록
    window.addEventListener('keydown', handleKeyDown)

    // 클린업 함수
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isSearchActive])

  // 초기 데이터 로드
  useEffect(() => {
    // 컴포넌트 마운트 시 초기화
    setCurrentPage(0)
    lastLoadedPageRef.current = 0
    fetchMagazines(0, true)
  }, [])

  // 뒤로가기 버튼 핸들러
  const handleBackClick = () => {
    navigate('/home')
  }

  // 매거진 아이템 클릭 핸들러
  const handleMagazineItemClick = (item: MagazineItem) => {
    //console.log('클릭된 매거진 아이템:', item)
    navigate(`/magazine/${item.id}`)
  }

  // 검색 토글 핸들러
  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive)
    if (!isSearchActive) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 300)
    } else {
      setSearchQuery('')
    }
  }

  // 검색어 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  // 카테고리 선택 변경 핸들러
  const handleCategoryChange = (value: string, isActive: boolean) => {
    if (isActive) {
      if (categoryMap[value]) {
        setCategory(categoryMap[value])
      }
    } else {
      setCategory('')
    }
  }

  // 정렬 옵션 변경 핸들러
  const handleSortChange = (value: string, isActive: boolean) => {
    if (isActive) {
      if (sortMap[value]) {
        setSortBy(sortMap[value])
      }
    }
  }

  // 플러스 아이콘 클릭 핸들러 (매거진 작성 페이지로 이동)
  const handlePlusClick = () => {
    navigate('/magazine/write')
  }

  // 리스트 아이콘 클릭 핸들러 (내 매거진 목록 페이지로 이동)
  const handleListClick = () => {
    navigate('/magazine/mylist')
  }

  // 검색 바 렌더링
  const renderSearchBar = () => {
    return (
      <div css={searchBarStyle(isSearchActive)}>
        <input
          ref={searchInputRef}
          type="text"
          placeholder="검색어를 입력하세요"
          value={searchQuery}
          onChange={handleSearchChange}
          css={searchInputStyle(isSearchActive)}
        />
        <div onClick={toggleSearch} css={closeButtonStyle(isSearchActive)}>
          <CloseIcon color="#392111" />
        </div>
      </div>
    )
  }

  // 현재 선택된 정렬 옵션의 한글 표시
  const getSortLabel = () => {
    return sortDisplayMap[sortBy]
  }

  // 현재 선택된 카테고리의 한글 표시
  const getCategoryLabel = () => {
    return categoryNames[category]
  }

  return (
    <MagazineListContainer>
      {/* 컨텐츠 래퍼 - 매거진 컨텐츠를 포함합니다 */}
      <ContentWrapper>
        <TopFixedContent fixedType="normal">
          {renderSearchBar()}

          <MatchingTopBar>
            <TopBarTitle>매거진 전체보기</TopBarTitle>
            <IconList>
              <div css={searchIconStyle} onClick={toggleSearch}>
                <SearchIcon color="#392111" width={21.5} height={21.5} />
              </div>
              <ListIcon color="#392111" onClick={handleListClick} />
              <PlusIcon color="#392111" onClick={handlePlusClick} />
            </IconList>
          </MatchingTopBar>

          <SortOptionsContainer>
            <div css={optionsContainerStyle}>
              <NormalSelectButton
                options={categoryOptions}
                onChange={handleCategoryChange}
                initialValue={getCategoryLabel() || ''}
              />
              <NormalSelectButton
                options={['인기순', '최신순', '오래된순']}
                onChange={handleSortChange}
                initialValue={getSortLabel()}
              />
            </div>
          </SortOptionsContainer>
        </TopFixedContent>

        <MagazineContent>
          {error && <EmptyMessage>{error}</EmptyMessage>}

          {!error && magazineItems.length > 0 ? (
            <div key={animationKey} className="magazine-transition-container">
              <Magazine
                items={magazineItems}
                onItemClick={handleMagazineItemClick}
                onBackClick={handleBackClick}
              />
            </div>
          ) : !isLoading && !error ? (
            <EmptyMessage>
              {searchQuery || category
                ? '검색 결과가 없습니다.'
                : '매거진이 없습니다.'}
            </EmptyMessage>
          ) : null}

          {/* 로딩 인디케이터 (무한 스크롤용) */}
          <div ref={lastElementRef} css={infiniteScrollLoaderStyle}>
            {isLoading && <LoadingContainer>로딩 중...</LoadingContainer>}
          </div>
        </MagazineContent>
      </ContentWrapper>

      {/* 네비게이션 래퍼 - 네비게이션 컴포넌트를 포함합니다 */}
      <NavigationWrapper>
        <NavigationComponent />
      </NavigationWrapper>
    </MagazineListContainer>
  )
}

export default MagazineList
