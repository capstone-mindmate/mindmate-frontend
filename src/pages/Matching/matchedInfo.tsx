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
import { fetchWithRefresh } from '../../utils/fetchWithRefresh'
import { useToast } from '../../components/toast/ToastProvider'

// 영문 -> 한글 카테고리 매핑
const categoryMap: Record<string, string> = {
  ACADEMIC: '학업',
  CAREER: '진로',
  RELATIONSHIP: '대인관계',
  MENTAL_HEALTH: '건강',
  CAMPUS_LIFE: '학교생활',
  PERSONAL_GROWTH: '자기계발',
  FINANCIAL: '경제',
  EMPLOYMENT: '취업',
  OTHER: '기타',
}

// 한글 -> 영문 카테고리 매핑
const categoryEngMap: Record<string, string> = {
  학업: 'ACADEMIC',
  진로: 'CAREER',
  대인관계: 'RELATIONSHIP',
  건강: 'MENTAL_HEALTH',
  학교생활: 'CAMPUS_LIFE',
  자기계발: 'PERSONAL_GROWTH',
  경제: 'FINANCIAL',
  취업: 'EMPLOYMENT',
  기타: 'OTHER',
}

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

// 매칭 상세 정보 인터페이스
interface MatchingDetail {
  id: number
  title: string
  description: string
  category: string
  status: string
  createdAt: string
  waitingCount: number
  anonymous: boolean
  showDepartment: boolean
  creatorRole: string
  creatorId: number
  creatorNickname: string
  creatorProfileImage: string
  creatorDepartment: string
  creatorCounselingCount: number
  creatorAvgRating: number
}

// 프로필 상세 정보 인터페이스
interface ProfileDetail {
  id: number
  userId: number
  nickname: string
  profileImage: string
  department: string
  entranceTime: number
  graduation: boolean
  totalCounselingCount: number
  avgResponseTime: number
  averageRating: number
  createdAt: string
}

interface MatchedInfoProps {}

const MatchedInfo = ({}: MatchedInfoProps) => {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [selectedCategory, setSelectedCategory] = useState('내가 만든 매칭방')
  const [matchingRooms, setMatchingRooms] = useState<any[]>([])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<
    (typeof appliedMatchingRooms)[0] | null
  >(null)
  const [matchingDetail, setMatchingDetail] = useState<MatchingDetail | null>(
    null
  )
  const [creatorProfile, setCreatorProfile] = useState<ProfileDetail | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(false)
  const [isDetailLoading, setIsDetailLoading] = useState(false)

  useEffect(() => {
    fetchMatchingRooms()
  }, [selectedCategory])

  const fetchMatchingRooms = async () => {
    if (selectedCategory === '내가 만든 매칭방') {
      // API 호출
      const fetchMyCreatedRooms = async () => {
        try {
          const res = await fetchWithRefresh(
            'http://localhost/api/matchings/creator?page=0&size=20',
            {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
            }
          )
          if (!res.ok)
            throw new Error('내가 만든 매칭방을 불러오지 못했습니다.')
          const data = await res.json()
          if (Array.isArray(data.content)) {
            // 카테고리 한글로 변환
            const mappedData = data.content.map((item: any) => ({
              ...item,
              category: categoryMap[item.category] || item.category,
              matchType: item.creatorRole === 'SPEAKER' ? '스피커' : '리스너',
            }))
            setMatchingRooms(mappedData)
          } else {
            setMatchingRooms([])
          }
        } catch (e) {
          setMatchingRooms(myCreatedMatchingRooms)
        }
      }
      fetchMyCreatedRooms()
    } else {
      // 신청보낸 매칭방 API 호출
      const fetchAppliedRooms = async () => {
        try {
          const res = await fetchWithRefresh(
            'http://localhost/api/matchings/applications?page=0&size=20',
            {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
            }
          )
          if (!res.ok) throw new Error('신청보낸 매칭방을 불러오지 못했습니다.')
          const data = await res.json()
          if (Array.isArray(data.content)) {
            // 카테고리 한글로 변환
            const mappedData = data.content.map((item: any) => ({
              ...item,
              category: categoryMap[item.category] || item.category,
              matchType: item.creatorRole === 'SPEAKER' ? '스피커' : '리스너',
            }))
            setMatchingRooms(mappedData)
          } else {
            setMatchingRooms([])
          }
        } catch (e) {
          setMatchingRooms(appliedMatchingRooms)
        }
      }
      fetchAppliedRooms()
    }
  }

  // 매칭 상세 정보 로드
  const fetchMatchingDetail = async (matchingId: number) => {
    setIsDetailLoading(true)
    try {
      const res = await fetchWithRefresh(
        `http://localhost/api/matchings/${matchingId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      )

      if (!res.ok) throw new Error('매칭 상세 정보를 불러오지 못했습니다.')

      const data = await res.json()
      // 카테고리 한글로 변환
      const mappedData = {
        ...data,
        category: categoryMap[data.category] || data.category,
      }
      setMatchingDetail(mappedData)

      // 매칭 생성자 프로필 로드
      await fetchCreatorProfile(data.creatorId)
    } catch (e) {
      if (e instanceof Error) {
        showToast(e.message, 'error')
      } else {
        showToast('매칭 상세 정보를 불러오는 중 오류가 발생했습니다.', 'error')
      }
    } finally {
      setIsDetailLoading(false)
    }
  }

  // 프로필 상세 정보 로드
  const fetchCreatorProfile = async (userId: number) => {
    try {
      const res = await fetchWithRefresh(
        `http://localhost/api/profiles/users/${userId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      )

      if (!res.ok) throw new Error('프로필 정보를 불러오지 못했습니다.')

      const data = await res.json()
      setCreatorProfile(data)
    } catch (e) {
      if (e instanceof Error) {
        showToast(e.message, 'error')
      } else {
        showToast('프로필 정보를 불러오는 중 오류가 발생했습니다.', 'error')
      }
    }
  }

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
  }

  const handleMatchItemClick = (item: any) => {
    if (selectedCategory === '내가 만든 매칭방') {
      navigate('/matching/application', { state: { item } })
    } else {
      // 상세정보 API 호출 후 모달 오픈
      fetchMatchingDetail(item.id)
      handleOpenModal(item)
    }
  }

  const handleOpenModal = (application: (typeof appliedMatchingRooms)[0]) => {
    setSelectedApplication(application)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setMatchingDetail(null)
    setCreatorProfile(null)
  }

  const handleMatchApplicationClick = (
    application: (typeof appliedMatchingRooms)[0]
  ) => {
    handleOpenModal(application)
  }

  const handleMatchingCancelRequest = async () => {
    if (!selectedApplication) return

    setIsLoading(true)
    try {
      // waitingUserId를 사용하여 매칭 신청 취소 API 호출
      // API 스웨거 문서에 따르면 /matchings/waiting-users/{waitingUserId} DELETE 메서드 사용
      const waitingUserId = selectedApplication.id

      const res = await fetchWithRefresh(
        `http://localhost/api/matchings/waiting-users/${waitingUserId}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        }
      )

      if (!res.ok) throw new Error('매칭 취소에 실패했습니다.')

      showToast('매칭 신청이 취소되었습니다.', 'success')
      setIsModalOpen(false)
      setMatchingDetail(null)
      setCreatorProfile(null)

      // 목록 다시 불러오기
      fetchMatchingRooms()
    } catch (e) {
      if (e instanceof Error) {
        showToast(e.message, 'error')
      } else {
        showToast('매칭 취소 중 오류가 발생했습니다.', 'error')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // ISO 8601 형식의 날짜 문자열을 'MM월 DD일 HH:MM' 형식으로 변환
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${month}월 ${day}일 ${hours}:${minutes}`
  }

  const renderModal = () => {
    if (!isModalOpen || !selectedApplication) return null

    // 상세 정보 로딩 중
    if (isDetailLoading) {
      return (
        <ModalComponent
          modalType="매칭취소"
          buttonText="매칭취소"
          buttonClick={handleMatchingCancelRequest}
          onClose={handleCloseModal}
          isOpen={isModalOpen}
          userProfileProps={{
            profileImage: '/public/image.png',
            name: '로딩 중...',
            department: '정보를 불러오는 중입니다',
            makeDate: '',
          }}
          matchingInfoProps={{
            title: '로딩 중...',
            description: '매칭 정보를 불러오는 중입니다.',
          }}
          messageProps={{
            onMessageChange: () => {},
            messageValue: '',
          }}
        />
      )
    }

    // 상세 정보와 프로필 정보가 모두 있는 경우
    if (matchingDetail && creatorProfile) {
      return (
        <ModalComponent
          modalType="매칭취소"
          buttonText={isLoading ? '취소 중...' : '매칭취소'}
          buttonClick={handleMatchingCancelRequest}
          onClose={handleCloseModal}
          isOpen={isModalOpen}
          userProfileProps={{
            profileImage:
              'http://localhost/api' + creatorProfile.profileImage ||
              'http://localhost/api/profileImages/default-profile-image.png',
            name: creatorProfile.nickname,
            department: creatorProfile.department,
            makeDate: formatDate(matchingDetail.createdAt),
          }}
          matchingInfoProps={{
            title: matchingDetail.title,
            description: matchingDetail.description,
          }}
          messageProps={{
            onMessageChange: () => {},
            messageValue: '',
          }}
        />
      )
    }

    // 폴백: API에서 데이터를 가져오지 못한 경우 Application 객체 사용
    return (
      <ModalComponent
        modalType="매칭취소"
        buttonText={isLoading ? '취소 중...' : '매칭취소'}
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
          title: selectedApplication.title,
          description: selectedApplication.description,
        }}
        messageProps={{
          onMessageChange: () => {},
          messageValue: '',
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
            <div
              style={{ padding: '20px', textAlign: 'center', color: '#888' }}
            >
              {selectedCategory === '내가 만든 매칭방'
                ? '생성한 매칭방이 없습니다.'
                : '신청한 매칭방이 없습니다.'}
            </div>
          )}
        </MatchItemsContainer>
      </MatchingContainer>

      {renderModal()}
    </RootContainer>
  )
}

export default MatchedInfo
