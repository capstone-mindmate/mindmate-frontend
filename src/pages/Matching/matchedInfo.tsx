/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import TopBar from '../../components/topbar/Topbar'
import { css } from '@emotion/react'

import {
  RootContainer,
  MatchingContainer,
  TopFixedContent,
  CategoryContainer,
  MatchedInfoCategoryContainer,
  CategoryItemText,
  MatchItemsContainer,
} from './style'
import MatchItem from '../../components/matching/matchItem'
import ModalComponent from '../../components/modal/modalComponent'

const myCreatedMatchingRooms = [
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
    applicationCount: 3,
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
    applicationCount: 1,
  },
]

const appliedMatchingRooms = [
  {
    id: 3,
    department: '소프트웨어학과',
    title: '취업 준비 방법',
    description: '소프트웨어 분야 취업 준비는 어떻게 하면 좋을까요?',
    matchType: '리스너',
    category: '취업',
    borderSet: true,
    username: '말하고 싶어라',
    profileImage: '/public/image.png',
    makeDate: '04월 18일 22:15',
    applicationCount: 0,
    applicationStatus: '대기중',
  },
  {
    id: 4,
    department: '컴퓨터공학과',
    title: '인턴 경험 공유',
    description: '인턴 경험에 대해 공유하고 싶습니다.',
    matchType: '스피커',
    category: '취업',
    borderSet: true,
    username: '코딩마스터',
    profileImage: '/public/image.png',
    makeDate: '04월 17일 18:45',
    applicationCount: 0,
    applicationStatus: '수락됨',
  },
]

interface MatchedInfoProps {}

const MatchedInfo = ({}: MatchedInfoProps) => {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('내가 만든 매칭방')
  const [matchingRooms, setMatchingRooms] = useState<any[]>([])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<
    (typeof appliedMatchingRooms)[0] | null
  >(null)

  useEffect(() => {
    if (selectedCategory === '내가 만든 매칭방') {
      setMatchingRooms(myCreatedMatchingRooms)
    } else {
      setMatchingRooms(appliedMatchingRooms)
    }
  }, [selectedCategory])

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
  }

  const handleMatchItemClick = (item: any) => {
    if (selectedCategory === '내가 만든 매칭방') {
      navigate('/matching/application', { state: { item } })
    } else {
      handleOpenModal(item)
    }
  }

  const handleOpenModal = (application: (typeof appliedMatchingRooms)[0]) => {
    setSelectedApplication(application)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleMatchApplicationClick = (
    application: (typeof appliedMatchingRooms)[0]
  ) => {
    handleOpenModal(application)
  }

  const handleMatchingCancelRequest = () => {
    // 여기서 매칭 취소 콜하기
  }

  const renderModal = () => {
    if (!isModalOpen || !selectedApplication) return null

    return (
      <ModalComponent
        modalType="매칭취소"
        buttonText="매칭취소"
        buttonClick={handleMatchingCancelRequest}
        onClose={handleCloseModal}
        isOpen={isModalOpen}
        userProfileProps={{
          profileImage: selectedApplication.profileImage,
          name: selectedApplication.username,
          department: selectedApplication.department,
          makeDate: selectedApplication.makeDate,
        }}
        matchingInfoProps={{
          title: 'asdf',
          description: 'asdf',
        }}
        messageProps={{
          onMessageChange: () => {},
          messageValue: 'asdf',
        }}
      />
    )
  }

  return (
    <RootContainer>
      <TopBar title="매칭방 목록" showBackButton actionText="" />
      <MatchingContainer>
        <TopFixedContent fixedType="matched">
          <CategoryContainer>
            <MatchedInfoCategoryContainer
              className={
                selectedCategory === '내가 만든 매칭방' ? 'selected' : ''
              }
              onClick={() => handleCategorySelect('내가 만든 매칭방')}
            >
              <CategoryItemText>내가 만든 매칭방</CategoryItemText>
            </MatchedInfoCategoryContainer>

            <MatchedInfoCategoryContainer
              className={
                selectedCategory === '신청보낸 매칭방' ? 'selected' : ''
              }
              onClick={() => handleCategorySelect('신청보낸 매칭방')}
            >
              <CategoryItemText>신청보낸 매칭방</CategoryItemText>
            </MatchedInfoCategoryContainer>
          </CategoryContainer>
        </TopFixedContent>

        <MatchItemsContainer pageType="matched">
          {matchingRooms.length > 0 ? (
            matchingRooms.map((item, index) => (
              <div key={item.id} style={{ width: '100%' }}>
                <MatchItem
                  department={item.department}
                  title={item.title}
                  description={item.description}
                  matchType={item.matchType}
                  category={item.category}
                  borderSet={index < matchingRooms.length - 1}
                  onClick={() => handleMatchItemClick(item)}
                />
              </div>
            ))
          ) : (
            <></>
          )}
        </MatchItemsContainer>
      </MatchingContainer>

      {renderModal()}
    </RootContainer>
  )
}

export default MatchedInfo
