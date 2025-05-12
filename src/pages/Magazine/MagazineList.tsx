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
  dummyMagazineItems,
  MagazineItem,
  MagazineApiResponse,
} from './magazinedata'

const MagazineList: React.FC = () => {
  const navigate = useNavigate()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // 상태 관리
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState<CategoryOption>('')
  const [sortBy, setSortBy] = useState<SortOption>('POPULARITY') // 기본값을 인기순으로 설정
  const [magazineItems, setMagazineItems] = useState<MagazineItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  // 무한 스크롤 페이지네이션 상태 관리
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize] = useState(10)

  // API 호출로 데이터 가져오기
  const fetchMagazines = async (page = currentPage, isInitialLoad = false) => {
    if (isLoading || (!hasMore && !isInitialLoad)) return

    setIsLoading(true)
    try {
      // 쿼리 파라미터 생성
      const params = new URLSearchParams()
      if (category) params.append('category', category)
      if (searchQuery) params.append('keyword', searchQuery)
      params.append('sortBy', sortBy)
      params.append('page', page.toString())
      params.append('size', pageSize.toString())

      // API URL
      const apiUrl = `/api/magazines?${params.toString()}`

      // 실제 API 호출 (개발 중에는 주석 처리하고 아래 더미 데이터 사용)
      // const response = await fetch(apiUrl)
      // const data: MagazineApiResponse = await response.json()

      // 개발을 위한 더미 데이터 생성
      // 무한 스크롤 및 필터링/정렬 시뮬레이션
      let filteredItems = [...dummyMagazineItems]

      // 카테고리 필터링
      if (category) {
        filteredItems = filteredItems.filter(
          (item) => (item.category as CategoryOption) === category
        )
      }

      // 검색어 필터링
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        filteredItems = filteredItems.filter(
          (item) =>
            item.title.toLowerCase().includes(query) ||
            item.detail.toLowerCase().includes(query)
        )
      }

      // 정렬 적용
      if (sortBy === 'LATEST') {
        // 최신순 정렬 (id 기준 내림차순으로 가정)
        filteredItems.sort((a, b) => Number(b.id) - Number(a.id))
      } else if (sortBy === 'OLDEST') {
        // 오래된순 정렬 (id 기준 오름차순으로 가정)
        filteredItems.sort((a, b) => Number(a.id) - Number(b.id))
      } else {
        // 인기순 정렬 (likeCount 기준으로 가정)
        filteredItems.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
      }

      // 페이지네이션 적용
      const total = filteredItems.length
      const start = page * pageSize
      const end = start + pageSize
      const paginatedItems = filteredItems.slice(start, end)

      // 실제 API 응답 구조에 맞추어 더미 데이터 구성
      const mockApiResponse: MagazineApiResponse = {
        content: paginatedItems,
        totalPages: Math.ceil(total / pageSize),
        totalElements: total,
        size: pageSize,
        number: page,
        first: page === 0,
        last: page === Math.ceil(total / pageSize) - 1,
        numberOfElements: paginatedItems.length,
        empty: paginatedItems.length === 0,
        pageable: {
          offset: page * pageSize,
          pageNumber: page,
          pageSize: pageSize,
          paged: true,
          unpaged: false,
        },
      }

      // 더 불러올 데이터가 있는지 확인
      const newHasMore = page < mockApiResponse.totalPages - 1
      setHasMore(newHasMore)

      // 데이터 업데이트 (초기 로드면 대체, 아니면 추가)
      if (isInitialLoad) {
        setMagazineItems(paginatedItems)
      } else {
        setMagazineItems((prev) => [...prev, ...paginatedItems])
      }

      // 개발 환경에서 콘솔에 정보 출력
      console.log('API 호출 파라미터:', {
        category,
        searchQuery,
        sortBy,
        page,
        pageSize,
        isInitialLoad,
      })
      console.log('API 응답 (모의):', mockApiResponse)
    } catch (error) {
      console.error('매거진 목록 조회 오류:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 필터 변경 시 데이터 다시 불러오기 (페이지 초기화)
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(0) // 필터 변경 시 첫 페이지로 리셋
      setMagazineItems([]) // 기존 아이템 초기화
      fetchMagazines(0, true) // 초기 데이터 로드
    }, 300)

    return () => clearTimeout(timer)
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
    fetchMagazines(0, true)
  }, [])

  // 뒤로가기 버튼 핸들러
  const handleBackClick = () => {
    navigate('/home')
  }

  // 매거진 아이템 클릭 핸들러
  const handleMagazineItemClick = (item: MagazineItem) => {
    console.log('클릭된 매거진 아이템:', item)
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
          {magazineItems.length > 0 ? (
            <Magazine
              items={magazineItems}
              onItemClick={handleMagazineItemClick}
              onBackClick={handleBackClick}
            />
          ) : !isLoading ? (
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
