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

// 더미 데이터. API 연동 후 삭제 예정 - 2025-04-19 석지원
const matchItemsData = [
  {
    id: 1,
    department: '소프트웨어학과',
    title: '소프트웨어학과 소개',
    description: '소프트웨어학과는 소프트웨어 개발과 관련된 학과입니다.',
    matchType: '리스너',
    category: '진로',
    borderSet: true,
    username: '행복한 돌멩이',
    profileImage: '/public/image.png',
    makeDate: '04월 19일 15:30',
  },
  {
    id: 2,
    department: '미디어학과',
    title: '미디어학과 관련 질문',
    description: '미디어학과에 관한 궁금한 점이 있습니다.',
    matchType: '스피커',
    category: '경제',
    borderSet: true,
    username: '건들면 짖는댕',
    profileImage: '/public/image.png',
    makeDate: '04월 19일 14:20',
  },
  {
    id: 3,
    department: '소프트웨어학과',
    title: '취업 준비 방법',
    description: '소프트웨어 분야 취업 준비는 어떻게 하면 좋을까요?',
    matchType: '리스너',
    category: '취업',
    borderSet: true,
    username: '말하고 싶어라',
    profileImage: '/public/image copy.png',
    makeDate: '04월 18일 22:15',
  },
  {
    id: 4,
    department: '미디어학과',
    title: '미디어학과 진로',
    description: '미디어학과를 졸업하면 어떤 진로를 선택할 수 있나요?',
    matchType: '스피커',
    category: '진로',
    borderSet: true,
    username: '마인드메이트',
    profileImage: '/public/image copy 2.png',
    makeDate: '04월 18일 18:05',
  },
  {
    id: 5,
    department: '소프트웨어학과',
    title: '학업 고민',
    description: '소프트웨어학과 공부가 너무 어려워요. 어떻게 해야 할까요?',
    matchType: '리스너',
    category: '학업',
    borderSet: true,
    username: '소프트웨어천재',
    profileImage: '/public/image.png',
    makeDate: '04월 17일 13:40',
  },
  {
    id: 6,
    department: '소프트웨어학과',
    title: '프로젝트 협업',
    description:
      '소프트웨어학과는 소프트웨어 개발과 관련된 학과입니다. 소프트웨어학과는 소프트웨어 개발과 관련된 학과입니다. 소프트웨어학과는 소프트웨어 개발과 관련된 학과입니다. 소프트웨어학과는 소프트웨어 개발과 관련된 학과입니다. 소프트웨어학과는 소프트웨어 개발과 관련된 학과입니다. 소프트웨어학과는 소프트웨어 개발과 관련된 학과입니다.',
    matchType: '스피커',
    category: '인간관계',
    borderSet: true,
    username: '프론트엔드 개발자',
    profileImage: '/public/image copy.png',
    makeDate: '04월 17일 10:30',
  },
  {
    id: 7,
    department: '미디어학과',
    title: '미디어학과 장비',
    description: '미디어학과에서 사용하는 장비는 어떤 것들이 있나요?',
    matchType: '리스너',
    category: '학업',
    borderSet: true,
    username: '미디어 마니아',
    profileImage: '/public/image copy 2.png',
    makeDate: '04월 16일 21:45',
  },
  {
    id: 8,
    department: '소프트웨어학과',
    title: '학자금 대출',
    description: '학자금 대출은 어떻게 신청하나요?',
    matchType: '스피커',
    category: '경제',
    borderSet: true,
    username: '경제적 자유',
    profileImage: '/public/image.png',
    makeDate: '04월 16일 16:20',
  },
  {
    id: 9,
    department: '소프트웨어학과',
    title: '인턴십 지원',
    description: '소프트웨어 관련 인턴십은 어디에서 찾을 수 있나요?',
    matchType: '리스너',
    category: '취업',
    borderSet: false,
    username: '취업준비중',
    profileImage: '/public/image copy.png',
    makeDate: '04월 15일 14:10',
  },
]

const Matching = () => {
  const navigate = useNavigate()
  const searchInputRef = useRef<HTMLInputElement>(null)

  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  )
  const [isListenerActive, setIsListenerActive] = useState(false)
  const [isSpeakerActive, setIsSpeakerActive] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [filteredItems, setFilteredItems] = useState(matchItemsData)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<
    (typeof matchItemsData)[0] | null
  >(null)
  const [messageToSend, setMessageToSend] = useState('')

  const [isMatchFailure, setIsMatchFailure] = useState(false)

  const [isSearchActive, setIsSearchActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    let filtered = matchItemsData

    if (selectedDepartment) {
      filtered = filtered.filter(
        (item) => item.department === selectedDepartment
      )
    }

    if (isListenerActive && !isSpeakerActive) {
      filtered = filtered.filter((item) => item.matchType === '리스너')
    } else if (!isListenerActive && isSpeakerActive) {
      filtered = filtered.filter((item) => item.matchType === '스피커')
    }

    if (selectedCategory !== '전체') {
      filtered = filtered.filter((item) => item.category === selectedCategory)
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.department.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
      )
    }

    setFilteredItems(filtered)
  }, [
    selectedDepartment,
    isListenerActive,
    isSpeakerActive,
    selectedCategory,
    searchQuery,
  ])

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

  const handleOpenModal = (item: (typeof matchItemsData)[0]) => {
    setSelectedItem(item)
    setIsModalOpen(true)
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

  const handleMatchingRequest = () => {
    if (selectedItem) {
      console.log('매칭 신청:', {
        ...selectedItem,
        message: messageToSend,
      })
      setIsModalOpen(false)
      setMessageToSend('')
    }
  }

  const handleMatchItemClick = (item: (typeof matchItemsData)[0]) => {
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
    if (!isModalOpen || !selectedItem) return null

    return (
      <ModalComponent
        modalType="매칭신청"
        buttonText="매칭 신청하기"
        buttonClick={handleMatchingRequest}
        onClose={handleCloseModal}
        isOpen={isModalOpen}
        userProfileProps={{
          profileImage: selectedItem.profileImage,
          name: selectedItem.username,
          department: selectedItem.department,
          makeDate: selectedItem.makeDate,
        }}
        matchingInfoProps={{
          title: selectedItem.title,
          description: selectedItem.description,
        }}
        messageProps={{
          onMessageChange: handleMessageChange,
          messageValue: messageToSend,
        }}
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
              options={['소프트웨어학과', '미디어학과']}
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
            filteredItems.map((item, index) => (
              <MatchItem
                key={item.id}
                department={item.department}
                title={item.title}
                description={item.description}
                matchType={item.matchType}
                category={item.category}
                borderSet={index < filteredItems.length - 1}
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
