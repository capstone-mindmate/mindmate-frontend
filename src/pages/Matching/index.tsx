/** @jsxImportSource @emotion/react */
import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  SearchIcon,
  ListIcon,
  PlusIcon,
  CloseIcon,
} from '../../components/icon/iconComponents'
import {
  RootContainer,
  MatchingContainer,
  MatchingTopBar,
  IconList,
  TopBarTitle,
  CategoryContainer,
  CategoryItem,
  TopFixedContent,
  CategoryItemText,
  CategoryDetailContainer,
  MatchItemsContainer,
  FloatingButtonContainer,
} from './style'
import NavigationComponent from '../../components/navigation/navigationComponent'
import BrownRoundButton from '../../components/buttons/brownRoundButton'
import YellowRoundButton from '../../components/buttons/yellowRoundButton'
import NormalSelectButton from '../../components/buttons/normalSelectButton'
import MatchItem from '../../components/matching/matchItem'
import RandomMatchingSelector from '../../components/matching/floating'
import ModalComponent from '../../components/modal/modalComponent'
import { css } from '@emotion/react'
import { fetchWithRefresh, getTokenCookie } from '../../utils/fetchWithRefresh'
import { useToast } from '../../components/toast/ToastProvider'
import { MatchingListSkeleton, hotCategoryEmoji } from './SkeletonComponents'
import { useAuthStore } from '../../stores/userStore'

// 카테고리 배열 정의
const categories = ['전체', '진로', '취업', '학업', '인간관계', '경제', '기타']

// 카테고리 스와이프 컨테이너 스타일
const categorySwipeStyles = css`
  position: relative;
  width: 100%;
  overflow: hidden;
`

const categoryListStyles = css`
  display: flex;
  flex-direction: row;
  transition: transform 0.3s ease;
  width: 100%;
`

// 매칭방 아이템 타입 정의 (API 응답 구조 기반)
interface MatchItemType {
  id: number
  department: string
  title: string
  description: string
  creatorRole: string
  category?: string
  matchType?: string
  borderSet?: boolean
  username?: string
  profileImage?: string
  makeDate?: string
  userId: number
  creatorId?: number
  anonymous?: boolean
}

const departmentOptions = [
  '기계공학과',
  '산업공학과',
  '화학공학과',
  '환경안전공학과',
  '건설시스템공학과',
  '교통시스템공학과',
  '건축학과',
  'AI모빌리티학과',
  '첨단신소재공학과',
  '응용화학생명공학과',
  '전자공학과',
  '지능형반도체공학과',
  '소프트웨어학과',
  '사이버보안학과',
  '소프트웨어융합학과',
  '국방디지털융합학과',
  '디지털미디어학과',
  '수학과',
  '물리학과',
  '화학과',
  '생명과학과',
  '국어국문학과',
  '영어영문학과',
  '불어불문학과',
  '사학과',
  '문화콘텐츠학과',
  '경제학과',
  '심리학과',
  '사회학과',
  '정치외교학과',
  '행정학과',
  '경영학과',
  'e-비즈니스학과',
  '금융공학과',
  '법학과',
  '의학과',
  '간호학과',
  '약학과',
  '바이오헬스규제과학과',
  '프런티어과학학부',
  '경제정치사회융합학부',
  '다산학부대학',
  '자유전공학부',
  '국제학부',
]

const categoryMap: Record<string, string> = {
  ACADEMIC: '학업',
  CAREER: '진로',
  RELATIONSHIP: '인간관계',
  MENTAL_HEALTH: '건강',
  CAMPUS_LIFE: '학교생활',
  PERSONAL_GROWTH: '자기계발',
  FINANCIAL: '경제',
  EMPLOYMENT: '취업',
  OTHER: '기타',
}

// 한글 → 영문 카테고리 맵
const categoryEngMap: Record<string, string> = {
  학업: 'ACADEMIC',
  진로: 'CAREER',
  인간관계: 'RELATIONSHIP',
  건강: 'MENTAL_HEALTH',
  학교생활: 'CAMPUS_LIFE',
  자기계발: 'PERSONAL_GROWTH',
  경제: 'FINANCIAL',
  취업: 'EMPLOYMENT',
  기타: 'OTHER',
}

const Matching = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const categoryContainerRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  )
  const [isListenerActive, setIsListenerActive] = useState(false)
  const [isSpeakerActive, setIsSpeakerActive] = useState(false)
  const initialCategory = location.state?.category || '전체'
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [matchItems, setMatchItems] = useState<MatchItemType[]>([])
  const [filteredItems, setFilteredItems] = useState<MatchItemType[]>([])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<MatchItemType | null>(null)
  const [messageToSend, setMessageToSend] = useState('')

  const [isMatchFailure, setIsMatchFailure] = useState(false)

  const [isSearchActive, setIsSearchActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { showToast } = useToast()

  // 상세 정보 로딩 상태
  const [isDetailLoading, setIsDetailLoading] = useState(false)

  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)

  const loaderRef = useRef<HTMLDivElement | null>(null)

  // 스와이프 관련 상태
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isSwipeInProgress, setIsSwipeInProgress] = useState(false) // 스와이프 진행 중 상태

  // 핫 카테고리 관련 상태
  const [hotCategories, setHotCategories] = useState<string[]>([])

  // 스와이프 감지를 위한 최소 거리 (더 작게 조정)
  const minSwipeDistance = 30

  const fetchMatchings = async (pageNum = 0, append = false) => {
    setLoading(true)
    const params = new URLSearchParams()
    params.append('pageable', pageNum.toString())
    if (selectedCategory !== '전체')
      params.append('category', categoryEngMap[selectedCategory])
    if (selectedDepartment) params.append('department', selectedDepartment)
    if (isListenerActive && !isSpeakerActive)
      params.append('requiredRole', 'SPEAKER')
    if (!isListenerActive && isSpeakerActive)
      params.append('requiredRole', 'LISTENER')
    if (searchQuery.trim() !== '') params.append('keyword', searchQuery.trim())

    const endpoint =
      searchQuery.trim() !== ''
        ? `http://localhost/api/matchings/search?${params.toString()}`
        : `http://localhost/api/matchings?${params.toString()}`
    try {
      const res = await fetchWithRefresh(endpoint, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) throw new Error('매칭방 목록을 불러오지 못했습니다.')
      const data = await res.json()
      if (Array.isArray(data.content)) {
        const mapped = data.content.map((item: any) => ({
          ...item,
          userId: item.userId ?? item.creatorId,
          category: categoryMap[item.category?.trim()] || item.category,
        }))
        setMatchItems((prev: MatchItemType[]) => {
          const all: MatchItemType[] = append ? [...prev, ...mapped] : mapped

          const unique = Array.from(
            new Map<number, MatchItemType>(
              all.map((item: MatchItemType) => [item.id, item])
            ).values()
          )
          return unique
        })
        setHasMore(!data.last && mapped.length > 0)
      } else {
        if (!append) setMatchItems([])
        setHasMore(false)
      }
    } catch (e) {
      if (!append) setMatchItems([])
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }

  const fetchHotCategories = async (token: string) => {
    try {
      const res = await fetchWithRefresh(
        'http://localhost/api/matchings/popular',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        }
      )

      if (res.ok) {
        const data = await res.json()
        console.log('인기 카테고리 API 응답:', data)

        // 🔥 PopularMatchingCategoryResponse 구조에 맞게 수정
        let topCategories: string[] = []

        if (data.matchingCategory) {
          // 단일 카테고리를 한글로 변환
          const categoryName =
            categoryMap[data.matchingCategory] || data.matchingCategory
          if (categoryName && categoryName !== '전체') {
            topCategories = [categoryName]
          }
        }

        setHotCategories(topCategories)
        console.log('설정된 핫 카테고리:', topCategories)
      } else {
        throw new Error(`API 호출 실패: ${res.status} ${res.statusText}`)
      }
    } catch (error) {
      console.error('핫 카테고리 로딩 실패:', error)
    }
  }

  useEffect(() => {
    const cookieToken = getTokenCookie('accessToken')
    const tokenToUse = user?.accessToken || cookieToken

    if (!tokenToUse) {
      return
    }

    fetchHotCategories(tokenToUse)
  }, [])

  // 카테고리가 핫 카테고리인지 확인
  const isHotCategory = (category: string) => {
    return hotCategories.includes(category)
  }

  // 필터 변경 시 page, matchItems, hasMore 리셋 + 첫 페이지 로드
  useEffect(() => {
    setPage(0)
    setHasMore(true)
    fetchMatchings(0, false)
  }, [
    selectedCategory,
    selectedDepartment,
    isListenerActive,
    isSpeakerActive,
    searchQuery,
  ])

  // page가 0이 아닐 때만(무한스크롤) fetchMatchings 호출
  useEffect(() => {
    if (page !== 0) {
      fetchMatchings(page, true)
    }
  }, [page])

  // IntersectionObserver로 무한 스크롤
  useEffect(() => {
    if (!hasMore || loading) return
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((p) => p + 1)
        }
      },
      { threshold: 1 }
    )
    if (loaderRef.current) observer.observe(loaderRef.current)
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current)
    }
  }, [hasMore, loading])

  useEffect(() => {
    let filtered = matchItems

    if (selectedDepartment) {
      filtered = filtered.filter(
        (item: MatchItemType) => item.department === selectedDepartment
      )
    }

    if (isListenerActive && !isSpeakerActive) {
      filtered = filtered.filter(
        (item: MatchItemType) => item.creatorRole === 'LISTENER'
      )
    } else if (!isListenerActive && isSpeakerActive) {
      filtered = filtered.filter(
        (item: MatchItemType) => item.creatorRole === 'SPEAKER'
      )
    }

    if (selectedCategory !== '전체') {
      filtered = filtered.filter(
        (item: MatchItemType) => item.category === selectedCategory
      )
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item: MatchItemType) =>
          (item.title ?? '').toLowerCase().includes(query) ||
          (item.description ?? '').toLowerCase().includes(query) ||
          (item.department ?? '').toLowerCase().includes(query) ||
          (item.category ?? '').toLowerCase().includes(query)
      )
    }

    setFilteredItems(filtered)
  }, [
    matchItems,
    selectedDepartment,
    isListenerActive,
    isSpeakerActive,
    selectedCategory,
    searchQuery,
  ])

  // location.state 기반 자동 카테고리 필터링
  useEffect(() => {
    if (location.state && location.state.category) {
      setSelectedCategory(location.state.category)
      setPage(0)
      fetchMatchings(0, false)
    }
    // eslint-disable-next-line
  }, [location.state])

  // 전역 키보드 이벤트 리스너만 사용 (React 이벤트 핸들러 제거)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // 검색이 활성화되어 있거나 모달이 열려있거나 스와이프 진행 중이면 비활성화
      if (isSearchActive || isModalOpen || isSwipeInProgress) return

      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        // preventDefault 제거
        if (e.key === 'ArrowLeft') {
          handleCategorySwipe('right')
        } else {
          handleCategorySwipe('left')
        }
      }
    }

    // 휠 이벤트도 전역으로 처리
    const handleGlobalWheel = (e: WheelEvent) => {
      if (isSearchActive || isModalOpen || isSwipeInProgress) return

      if (Math.abs(e.deltaX) > 10) {
        if (e.deltaX > 0) {
          handleCategorySwipe('left')
        } else {
          handleCategorySwipe('right')
        }
      }
    }

    document.addEventListener('keydown', handleGlobalKeyDown)
    document.addEventListener('wheel', handleGlobalWheel, { passive: true })

    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown)
      document.removeEventListener('wheel', handleGlobalWheel)
    }
  }, [selectedCategory, isSearchActive, isModalOpen, isSwipeInProgress])

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
  }

  // 스와이프로 카테고리 전환하는 함수
  const handleCategorySwipe = (direction: 'left' | 'right') => {
    // 이미 스와이프가 진행 중이면 무시
    if (isSwipeInProgress) return

    const currentIndex = categories.indexOf(selectedCategory)
    let newIndex = currentIndex

    // 무조건 한 카테고리씩만 이동
    if (direction === 'left' && currentIndex < categories.length - 1) {
      newIndex = currentIndex + 1
    } else if (direction === 'right' && currentIndex > 0) {
      newIndex = currentIndex - 1
    }

    if (newIndex !== currentIndex) {
      setIsSwipeInProgress(true) // 스와이프 진행 중으로 설정
      setSelectedCategory(categories[newIndex])

      // 더 긴 쿨다운 시간으로 변경 (연속 스와이프 방지)
      setTimeout(() => {
        setIsSwipeInProgress(false)
      }, 500) // 500ms 쿨다운으로 증가
    }
  }

  // 터치 이벤트 핸들러
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null) // 이전 터치 종료 지점 초기화
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      handleCategorySwipe('left')
    } else if (isRightSwipe) {
      handleCategorySwipe('right')
    }
  }

  // 카테고리 컨테이너가 포커스를 받을 수 있도록 하는 useEffect
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        if (categoryContainerRef.current) {
          e.preventDefault()
          if (e.key === 'ArrowLeft') {
            handleCategorySwipe('right')
          } else {
            handleCategorySwipe('left')
          }
        }
      }
    }

    document.addEventListener('keydown', handleGlobalKeyDown)
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown)
    }
  }, [selectedCategory])

  const handleDepartmentChange = (value: string, isActive: boolean) => {
    setSelectedDepartment(isActive ? value : null)
  }

  const handleListenerToggle = (isActive: boolean) => {
    setIsListenerActive(isActive)
  }

  const handleSpeakerToggle = (isActive: boolean) => {
    setIsSpeakerActive(isActive)
  }

  const handleListenerSelect = async () => {
    try {
      const res = await fetchWithRefresh(
        'http://localhost/api/matchings/auto',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userRole: 'LISTENER',
            anonymous: true,
            showDepartment: true,
          }),
        }
      )
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message)
      }
      showToast('랜덤 매칭이 완료되었습니다!', 'success')
    } catch (e: any) {
      showToast(e.message, 'error')
    }
  }

  const handleSpeakerSelect = async () => {
    try {
      const res = await fetchWithRefresh(
        'http://localhost/api/matchings/auto',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userRole: 'SPEAKER',
            anonymous: true,
            showDepartment: true,
          }),
        }
      )
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message)
      }
      showToast('랜덤 매칭이 완료되었습니다!', 'success')
    } catch (e: any) {
      showToast(e.message, 'error')
    }
  }

  const handleOpenModal = async (item: MatchItemType) => {
    setIsDetailLoading(true)
    setIsModalOpen(true)
    try {
      const res = await fetchWithRefresh(
        `http://localhost/api/matchings/${item.id}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      )
      if (!res.ok) throw new Error('매칭방 상세 정보를 불러오지 못했습니다.')
      const data = await res.json()
      setSelectedItem({
        id: data.id,
        department: data.creatorDepartment ?? '',
        title: data.title ?? '',
        description: data.description ?? '',
        creatorRole: data.creatorRole ?? '',
        category: data.category ?? '',
        anonymous: data.anonymous ?? false,
        matchType: data.creatorRole === 'SPEAKER' ? '스피커' : '리스너',
        borderSet: false,
        username: data.creatorNickname ?? '',
        profileImage: data.anonymous
          ? 'http://localhost/api/profileImages/default-profile-image.png'
          : `http://localhost/api${data.creatorProfileImage ?? ''}`,
        makeDate: data.createdAt
          ? new Date(data.createdAt).toLocaleString('ko-KR', {
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })
          : '',
        userId: data.creatorId,
        creatorId: data.creatorId,
      })
    } catch (e) {
      setSelectedItem(null)
      alert('매칭방 상세 정보를 불러오지 못했습니다.')
    } finally {
      setIsDetailLoading(false)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setMessageToSend('')
  }

  const handleOpenMatchFailureModal = () => {
    setIsMatchFailure(true)
  }

  const handleCloseMatchFailureModal = () => {
    setIsMatchFailure(false)
  }

  const handleMessageChange = (value: string) => {
    setMessageToSend(value)
  }

  const handleMatchingRequest = async () => {
    if (selectedItem) {
      try {
        const res = await fetchWithRefresh(
          `http://localhost/api/matchings/${selectedItem.id}/applications`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: messageToSend,
              anonymous: false,
            }),
          }
        )
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.message || res.statusText)
        }
        showToast('매칭 신청이 완료되었습니다!', 'success')
        setIsModalOpen(false)
        setMessageToSend('')
      } catch (e: any) {
        setIsModalOpen(false)
        showToast(e, 'error')
      }
    }
  }

  const handleMatchItemClick = (item: MatchItemType) => {
    handleOpenModal(item)
  }

  const renderSearchBar = () => {
    return (
      <div
        css={css`
          position: absolute;
          top: 0;
          left: 0;
          width: ${isSearchActive ? '100%' : '0'};
          height: 48px;
          background-color: white;
          z-index: 1000;
          display: flex;
          align-items: center;
          padding: ${isSearchActive ? '0 24px' : '0'};
          margin: ${isSearchActive ? '7px 0' : '0'};
          transition: all 0.3s ease;
          overflow: hidden;
          box-sizing: border-box;
          opacity: ${isSearchActive ? 1 : 0};
        `}
      >
        <input
          ref={searchInputRef}
          type="text"
          placeholder="검색어를 입력하세요"
          value={searchQuery}
          onChange={handleSearchChange}
          css={css`
            flex: 1;
            border: none;
            outline: none;
            font-size: 16px;
            padding: 8px 20px;
            color: #392111;
            opacity: ${isSearchActive ? 1 : 0};
            transition: opacity 0.2s ease 0.2s;
            &::placeholder {
              color: #aaa;
            }
            background-color: whitesmoke;
            box-sizing: border-box;
            border-radius: 20px;
          `}
        />
        <div
          onClick={toggleSearch}
          css={css`
            cursor: pointer;
            margin-left: 12px;
            opacity: ${isSearchActive ? 1 : 0};
            transition: opacity 0.2s ease 0.2s;
          `}
        >
          <CloseIcon color="#392111" />
        </div>
      </div>
    )
  }

  const renderModal = () => {
    if (!isModalOpen) return null
    if (isDetailLoading || !selectedItem) {
      return (
        <ModalComponent
          modalType="매칭신청"
          buttonText="매칭 신청하기"
          buttonClick={handleMatchingRequest}
          onClose={handleCloseModal}
          isOpen={isModalOpen}
          userProfileProps={{
            profileImage: '',
            name: '',
            department: '',
            makeDate: '',
            userId: undefined,
          }}
          matchingInfoProps={{
            title: '',
            description: '로딩 중...',
            creatorRole: '',
          }}
          messageProps={{
            onMessageChange: handleMessageChange,
            messageValue: '',
          }}
          onProfileClick={() => {}}
        />
      )
    }
    const handleProfileClick = () => {
      const userId = selectedItem?.userId ?? selectedItem?.creatorId
      if (userId && !selectedItem?.anonymous) {
        navigate(`/mypage/${userId}`)
      } else {
        showToast('상대방 프로필 정보를 찾을 수 없습니다.', 'error')
      }
    }
    return (
      <ModalComponent
        modalType="매칭신청"
        buttonText="매칭 신청하기"
        buttonClick={handleMatchingRequest}
        onClose={handleCloseModal}
        isOpen={isModalOpen}
        userProfileProps={{
          profileImage: selectedItem.profileImage ?? '',
          name: selectedItem.username ?? '',
          department: selectedItem.department ?? '',
          makeDate: selectedItem.makeDate ?? '',
          userId: selectedItem.userId || selectedItem.creatorId,
        }}
        matchingInfoProps={{
          title: selectedItem.title ?? '',
          description: selectedItem.description ?? '',
          creatorRole: selectedItem.creatorRole ?? '',
        }}
        messageProps={{
          onMessageChange: handleMessageChange,
          messageValue: messageToSend,
        }}
        onProfileClick={handleProfileClick}
      />
    )
  }

  const renderMatchFailure = () => {
    if (!isMatchFailure) return null

    return (
      <ModalComponent
        modalType="매칭실패"
        buttonText="닫기"
        buttonClick={handleCloseMatchFailureModal}
        onClose={handleCloseMatchFailureModal}
        isOpen={isMatchFailure}
        userProfileProps={{
          profileImage: '',
          name: '서버한테 전달 받기',
          department: '서버한테 전달 받기',
          makeDate: '서버한테 전달 받기',
        }}
        matchingInfoProps={{
          title: '서버한테 전달 받기',
          description: '서버한테 전달 받기',
        }}
        messageProps={{
          onMessageChange: handleMessageChange,
          messageValue: '서버한테 전달 받기',
        }}
      />
    )
  }

  // 카테고리 렌더링
  const renderCategoryContainer = () => {
    return (
      <CategoryContainer ref={categoryContainerRef}>
        {categories.map((category) => (
          <CategoryItem
            key={category}
            className={selectedCategory === category ? 'selected' : ''}
            onClick={() => handleCategorySelect(category)}
          >
            <CategoryItemText>
              {category}
              {isHotCategory(category) && ' 🔥'}
            </CategoryItemText>
          </CategoryItem>
        ))}
      </CategoryContainer>
    )
  }

  return (
    <RootContainer
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      tabIndex={0}
      style={{ outline: 'none', touchAction: 'pan-y' }}
    >
      <MatchingContainer>
        <TopFixedContent fixedType="normal">
          {renderSearchBar()}
          <MatchingTopBar>
            <TopBarTitle>매칭하기</TopBarTitle>
            <IconList>
              <div
                onClick={toggleSearch}
                css={css`
                  cursor: pointer;
                `}
              >
                <SearchIcon color="#392111" width={21.5} height={21.5} />
              </div>
              <ListIcon
                color="#392111"
                onClick={() => navigate('/matching/matched')}
              />
              <PlusIcon
                color="#392111"
                onClick={() => navigate('/matching/register')}
              />
            </IconList>
          </MatchingTopBar>

          {renderCategoryContainer()}

          <CategoryDetailContainer>
            <NormalSelectButton
              options={departmentOptions}
              onChange={handleDepartmentChange}
            />

            <BrownRoundButton
              buttonText="리스너"
              onActiveChange={handleListenerToggle}
            />

            <YellowRoundButton
              buttonText="스피커"
              onActiveChange={handleSpeakerToggle}
            />
          </CategoryDetailContainer>
        </TopFixedContent>

        <MatchItemsContainer pageType="normal">
          {loading ? (
            <MatchingListSkeleton count={6} />
          ) : matchItems.length > 0 ? (
            matchItems.map((item: MatchItemType, index: number) => (
              <MatchItem
                key={item.id}
                department={item.department ?? ''}
                title={item.title ?? ''}
                description={item.description ?? ''}
                matchType={item.creatorRole ?? ''}
                category={item.category ?? ''}
                borderSet={index < matchItems.length - 1}
                onClick={() => handleMatchItemClick(item)}
              />
            ))
          ) : (
            <div
              css={{
                padding: '40px 0',
                textAlign: 'center',
                width: '100%',
                color: '#888',
              }}
            >
              {searchQuery ? '검색 결과가 없습니다.' : '매칭방이 없습니다.'}
            </div>
          )}
          <div ref={loaderRef} style={{ height: 1 }} />
        </MatchItemsContainer>
      </MatchingContainer>

      <FloatingButtonContainer>
        <RandomMatchingSelector
          listenerHandler={handleListenerSelect}
          speakerHandler={handleSpeakerSelect}
        />
      </FloatingButtonContainer>

      <NavigationComponent />

      {renderModal()}
      {renderMatchFailure()}
    </RootContainer>
  )
}

export default Matching
