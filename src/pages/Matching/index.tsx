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
import { fetchWithRefresh } from '../../utils/fetchWithRefresh'
import { useToast } from '../../components/toast/ToastProvider'

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

const Matching = () => {
  const navigate = useNavigate()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const location = useLocation()

  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  )
  const [isListenerActive, setIsListenerActive] = useState(false)
  const [isSpeakerActive, setIsSpeakerActive] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('전체')
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

  useEffect(() => {
    // 매칭방 목록 API 호출
    const fetchMatchings = async () => {
      try {
        const res = await fetchWithRefresh('http://localhost/api/matchings', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        if (!res.ok) throw new Error('매칭방 목록을 불러오지 못했습니다.')
        const data = await res.json()
        if (Array.isArray(data.content)) {
          setMatchItems(
            data.content.map((item: any) => ({
              ...item,
              userId: item.userId ?? item.creatorId,
            }))
          )
        } else {
          setMatchItems([])
        }
      } catch (e) {
        setMatchItems([])
      }
    }
    fetchMatchings()
  }, [])

  useEffect(() => {
    let filtered = matchItems

    if (selectedDepartment) {
      filtered = filtered.filter(
        (item: MatchItemType) => item.department === selectedDepartment
      )
    }

    if (isListenerActive && !isSpeakerActive) {
      filtered = filtered.filter(
        (item: MatchItemType) => item.matchType === '리스너'
      )
    } else if (!isListenerActive && isSpeakerActive) {
      filtered = filtered.filter(
        (item: MatchItemType) => item.matchType === '스피커'
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
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.department.toLowerCase().includes(query) ||
          (item.category ? item.category.toLowerCase().includes(query) : false)
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

  // 검색어가 변경될 때마다 서버에 쿼리로 검색
  useEffect(() => {
    const fetchSearch = async () => {
      try {
        let url = 'http://localhost/api/matchings'
        if (searchQuery.trim() !== '') {
          url += `?keyword=${encodeURIComponent(searchQuery.trim())}`
        }
        const res = await fetchWithRefresh(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        if (!res.ok) throw new Error('매칭방 목록을 불러오지 못했습니다.')
        const data = await res.json()
        if (Array.isArray(data.content)) {
          setMatchItems(data.content)
        } else {
          setMatchItems([])
        }
      } catch (e) {
        setMatchItems([])
      }
    }
    fetchSearch()
  }, [searchQuery])

  // location.state 기반 자동 카테고리 필터링
  useEffect(() => {
    if (location.state && location.state.category) {
      setSelectedCategory(location.state.category)
    }
  }, [location.state])

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

  const handleDepartmentChange = (value: string, isActive: boolean) => {
    setSelectedDepartment(isActive ? value : null)
  }

  const handleListenerToggle = (isActive: boolean) => {
    setIsListenerActive(isActive)
  }

  const handleSpeakerToggle = (isActive: boolean) => {
    setIsSpeakerActive(isActive)
  }

  const handleListenerSelect = () => {
    // 리스너 랜덤 매칭 호출
  }

  const handleSpeakerSelect = () => {
    // 스피커 랜덤 매칭 호출
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
        matchType: data.creatorRole === 'SPEAKER' ? '스피커' : '리스너',
        borderSet: false,
        username: data.creatorNickname ?? '',
        profileImage: data.creatorProfileImage ?? '',
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
              anonymous: false, // 익명 신청 여부, 필요시 상태로 관리
            }),
          }
        )
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.message || '매칭 신청에 실패했습니다.')
        }
        showToast('매칭 신청이 완료되었습니다!', 'success')
        setIsModalOpen(false)
        setMessageToSend('')
      } catch (e: any) {
        setIsModalOpen(false)
        showToast(e.message, 'error')
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
          padding: ${isSearchActive ? '0 16px' : '0'};
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
      // userId 우선, 없으면 creatorId 사용
      const userId = selectedItem?.userId ?? selectedItem?.creatorId
      if (userId) {
        navigate(`/mypage/${userId}`)
      } else {
        alert('상대방 프로필 정보를 찾을 수 없습니다.')
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

  return (
    <RootContainer>
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
                <SearchIcon color="#392111" />
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

          <CategoryContainer>
            <CategoryItem
              className={selectedCategory === '전체' ? 'selected' : ''}
              onClick={() => handleCategorySelect('전체')}
            >
              <CategoryItemText>전체</CategoryItemText>
            </CategoryItem>
            <CategoryItem
              className={selectedCategory === '진로' ? 'selected' : ''}
              onClick={() => handleCategorySelect('진로')}
            >
              <CategoryItemText>진로</CategoryItemText>
            </CategoryItem>
            <CategoryItem
              className={selectedCategory === '취업' ? 'selected' : ''}
              onClick={() => handleCategorySelect('취업')}
            >
              <CategoryItemText>취업</CategoryItemText>
            </CategoryItem>
            <CategoryItem
              className={selectedCategory === '학업' ? 'selected' : ''}
              onClick={() => handleCategorySelect('학업')}
            >
              <CategoryItemText>학업</CategoryItemText>
            </CategoryItem>
            <CategoryItem
              className={selectedCategory === '인간관계' ? 'selected' : ''}
              onClick={() => handleCategorySelect('인간관계')}
            >
              <CategoryItemText>인간관계</CategoryItemText>
            </CategoryItem>
            <CategoryItem
              className={selectedCategory === '경제' ? 'selected' : ''}
              onClick={() => handleCategorySelect('경제')}
            >
              <CategoryItemText>경제</CategoryItemText>
            </CategoryItem>
            <CategoryItem
              className={selectedCategory === '기타' ? 'selected' : ''}
              onClick={() => handleCategorySelect('기타')}
            >
              <CategoryItemText>기타</CategoryItemText>
            </CategoryItem>
          </CategoryContainer>

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
          {filteredItems.length > 0 ? (
            filteredItems.map((item: MatchItemType, index: number) => (
              <MatchItem
                key={item.id}
                department={item.department ?? ''}
                title={item.title ?? ''}
                description={item.description ?? ''}
                matchType={item.matchType ?? ''}
                category={item.category ?? ''}
                borderSet={index < filteredItems.length - 1}
                onClick={() => handleMatchItemClick(item)}
              />
            ))
          ) : (
            <div
              css={{
                padding: '20px',
                textAlign: 'center',
                width: '100%',
                color: '#888',
              }}
            >
              {searchQuery ? '검색 결과가 없습니다.' : '매칭방이 없습니다.'}
            </div>
          )}
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
