/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  SearchIcon,
  ListIcon,
  PlusIcon,
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
  },
  {
    id: 2,
    department: '미디어학과',
    title: '미디어학과 관련 질문',
    description: '미디어학과에 관한 궁금한 점이 있습니다.',
    matchType: '스피커',
    category: '경제',
    borderSet: true,
  },
  {
    id: 3,
    department: '소프트웨어학과',
    title: '취업 준비 방법',
    description: '소프트웨어 분야 취업 준비는 어떻게 하면 좋을까요?',
    matchType: '리스너',
    category: '취업',
    borderSet: true,
  },
  {
    id: 4,
    department: '미디어학과',
    title: '미디어학과 진로',
    description: '미디어학과를 졸업하면 어떤 진로를 선택할 수 있나요?',
    matchType: '스피커',
    category: '진로',
    borderSet: true,
  },
  {
    id: 5,
    department: '소프트웨어학과',
    title: '학업 고민',
    description: '소프트웨어학과 공부가 너무 어려워요. 어떻게 해야 할까요?',
    matchType: '리스너',
    category: '학업',
    borderSet: true,
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
  },
  {
    id: 7,
    department: '미디어학과',
    title: '미디어학과 장비',
    description: '미디어학과에서 사용하는 장비는 어떤 것들이 있나요?',
    matchType: '리스너',
    category: '학업',
    borderSet: true,
  },
  {
    id: 8,
    department: '소프트웨어학과',
    title: '학자금 대출',
    description: '학자금 대출은 어떻게 신청하나요?',
    matchType: '스피커',
    category: '경제',
    borderSet: true,
  },
  {
    id: 9,
    department: '소프트웨어학과',
    title: '인턴십 지원',
    description: '소프트웨어 관련 인턴십은 어디에서 찾을 수 있나요?',
    matchType: '리스너',
    category: '취업',
    borderSet: false,
  },
]

const Matching = () => {
  const location = useLocation()

  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  )
  const [isListenerActive, setIsListenerActive] = useState(false)
  const [isSpeakerActive, setIsSpeakerActive] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [filteredItems, setFilteredItems] = useState(matchItemsData)

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

    setFilteredItems(filtered)
  }, [selectedDepartment, isListenerActive, isSpeakerActive, selectedCategory])

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

  return (
    <RootContainer>
      <MatchingContainer>
        <TopFixedContent>
          <MatchingTopBar>
            <TopBarTitle>매칭하기</TopBarTitle>
            <IconList>
              <SearchIcon color="#392111" />
              <ListIcon color="#392111" />
              <PlusIcon color="#392111" />
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

        <MatchItemsContainer>
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
              조건에 맞는 매칭 항목이 없습니다.
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
    </RootContainer>
  )
}

export default Matching
