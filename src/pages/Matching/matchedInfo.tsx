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
  RELATIONSHIP: '인간관계',
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
  인간관계: 'RELATIONSHIP',
  건강: 'MENTAL_HEALTH',
  학교생활: 'CAMPUS_LIFE',
  자기계발: 'PERSONAL_GROWTH',
  경제: 'FINANCIAL',
  취업: 'EMPLOYMENT',
  기타: 'OTHER',
}

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
  waitingUserId: number
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
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
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
            'https://mindmate.shop/api/matchings/creator?page=0&size=20',
            {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
            }
          )
          if (!res.ok)
            throw new Error('내가 만든 매칭방을 불러오지 못했습니다.')
          const data = await res.json()
          if (Array.isArray(data.content)) {
            // 카테고리 한글로 변환 및 matchType 변환
            const mappedData = data.content.map((item: any) => ({
              ...item,
              category: categoryMap[item.category] || item.category,
              matchType: item.creatorRole === 'SPEAKER' ? '스피커' : '리스너',
              // 내가 만든 매칭방에는 메시지 없음
              message: '',
              username: '', // 필요시 추가 정보
              profileImage: '', // 필요시 추가 정보
              makeDate: '', // 필요시 추가 정보
              borderSet: true, // 필요시 추가 정보
              applicationStatus: '', // 필요시 추가 정보
            }))
            setMatchingRooms(mappedData)
          } else {
            setMatchingRooms([])
          }
        } catch (e) {
          //setMatchingRooms(myCreatedMatchingRooms)
        }
      }
      fetchMyCreatedRooms()
    } else {
      // 신청보낸 매칭방 API 호출
      const fetchAppliedRooms = async () => {
        try {
          const res = await fetchWithRefresh(
            'https://mindmate.shop/api/matchings/applications?page=0&size=20',
            {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
            }
          )
          if (!res.ok) throw new Error('신청보낸 매칭방을 불러오지 못했습니다.')
          const data = await res.json()
          if (Array.isArray(data.content)) {
            // 매칭 정보와 메시지 분리, 카테고리 한글로 변환 및 matchType 변환
            // 추가 정보가 필요하면 https://mindmate.shop/api/matchings/{id}로 상세 조회
            const fetchDetails = async (item: any) => {
              try {
                const detailRes = await fetchWithRefresh(
                  `https://mindmate.shop/api/matchings/${item.matching.id}`,
                  {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                  }
                )
                if (!detailRes.ok) throw new Error()
                const detail = await detailRes.json()
                return {
                  ...item.matching,
                  ...detail,
                  category:
                    categoryMap[item.matching.category] ||
                    item.matching.category,
                  matchType:
                    item.matching.creatorRole === 'SPEAKER'
                      ? '스피커'
                      : '리스너',
                  message: item.applicationMessage || '',
                  username: detail.creatorNickname, // 필요시 추가 정보
                  profileImage:
                    'https://mindmate.shop/api' +
                    (detail.creatorProfileImage
                      ? detail.creatorProfileImage
                      : '/profileImages/default-profile-image.png'), // 필요시 추가 정보
                  makeDate: formatDate(detail.createdAt), // 필요시 추가 정보
                  borderSet: true, // 필요시 추가 정보
                  applicationStatus: detail.status, // 필요시 추가 정보
                  waitingUserId: item.waitingUserId, // 필요시 추가 정보
                }
              } catch {
                // 상세 조회 실패 시 기본 정보만 사용
                return {
                  ...item.matching,
                  category:
                    categoryMap[item.matching.category] ||
                    item.matching.category,
                  matchType:
                    item.matching.creatorRole === 'SPEAKER'
                      ? '스피커'
                      : '리스너',
                  message: item.applicationMessage || '',
                  username: '',
                  profileImage: '',
                  makeDate: '',
                  borderSet: true,
                  applicationStatus: '',
                }
              }
            }
            // 상세 정보 병합 (병렬 처리)
            const mappedData = await Promise.all(data.content.map(fetchDetails))
            setMatchingRooms(mappedData)
          } else {
            setMatchingRooms([])
          }
        } catch (e) {
          //setMatchingRooms(appliedMatchingRooms)
        }
      }
      fetchAppliedRooms()
    }
  }

  // 매칭 상세 정보 로드
  // const fetchMatchingDetail = async (matchingId: number) => {
  //   setIsDetailLoading(true)
  //   try {
  //     const res = await fetchWithRefresh(
  //       `https://mindmate.shop/api/matchings/${matchingId}`,
  //       {
  //         method: 'GET',
  //         headers: { 'Content-Type': 'application/json' },
  //       }
  //     )

  //     if (!res.ok) throw new Error('매칭 상세 정보를 불러오지 못했습니다.')

  //     const data = await res.json()
  //     // 카테고리 한글로 변환
  //     const mappedData = {
  //       ...data,
  //       category: categoryMap[data.category] || data.category,
  //     }
  //     setMatchingDetail(mappedData)

  //     // 매칭 생성자 프로필 로드
  //     await fetchCreatorProfile(data.creatorId)
  //   } catch (e) {
  //     if (e instanceof Error) {
  //       showToast(e.message, 'error')
  //     } else {
  //       showToast('매칭 상세 정보를 불러오는 중 오류가 발생했습니다.', 'error')
  //     }
  //   } finally {
  //     setIsDetailLoading(false)
  //   }
  // }

  // 프로필 상세 정보 로드
  const fetchCreatorProfile = async (userId: number) => {
    try {
      const res = await fetchWithRefresh(
        `https://mindmate.shop/api/profiles/users/${userId}`,
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
      handleOpenModal(item)
    }
  }

  const handleOpenModal = (application: (typeof appliedMatchingRooms)[0]) => {
    console.log(application)
    setSelectedApplication(application)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setMatchingDetail(null)
    setCreatorProfile(null)
  }

  const handleProfileClick = (userId: number, isAnonymous: boolean = false) => {
    if (!isAnonymous && userId) {
      navigate(`/mypage/${userId}`)
    } else {
      showToast('익명 사용자의 프로필은 볼 수 없습니다.', 'error')
    }
  }

  const handleMatchingCancelRequest = async () => {
    if (!selectedApplication) return

    setIsLoading(true)
    try {
      // waitingUserId를 사용하여 매칭 신청 취소 API 호출
      // API 스웨거 문서에 따르면 /matchings/waiting-users/{waitingUserId} DELETE 메서드 사용
      const waitingUserId = selectedApplication.waitingUserId

      const res = await fetchWithRefresh(
        `https://mindmate.shop/api/matchings/waiting-users/${waitingUserId}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        }
      )

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || res.statusText)
      }

      showToast('매칭 신청이 취소되었습니다.', 'success')
      setIsModalOpen(false)
      setMatchingDetail(null)
      setCreatorProfile(null)

      // 목록 다시 불러오기
      fetchMatchingRooms()
    } catch (e: any) {
      showToast(e.message, 'error')
    } finally {
      setIsLoading(false)
      setIsModalOpen(false)
      setMatchingDetail(null)
      setCreatorProfile(null)
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
            profileImage: '/default-profile-image.png',
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
          onProfileClick={() => {}}
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
              'https://mindmate.shop/api' + creatorProfile.profileImage ||
              'https://mindmate.shop/api/profileImages/default-profile-image.png',
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
            messageValue: selectedApplication.message || '',
          }}
          onProfileClick={() =>
            handleProfileClick(creatorProfile.userId, matchingDetail.anonymous)
          }
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
          messageValue: selectedApplication.message || '',
        }}
        onProfileClick={() =>
          handleProfileClick(
            selectedApplication.creatorId,
            selectedApplication.anonymous
          )
        }
      />
    )
  }

  return (
    <RootContainer>
      <TopBar
        title="매칭방 목록"
        showBackButton
        actionText=""
        onBackClick={() => navigate('/matching')}
      />
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
