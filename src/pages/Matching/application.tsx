/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import TopBar from '../../components/topbar/Topbar'
import ApplicationInfo from '../../components/matching/applicationInfo'
import ModalComponent from '../../components/modal/modalComponent'
import { fetchWithRefresh } from '../../utils/fetchWithRefresh'

import { css } from '@emotion/react'

import { RootContainer, MatchingContainer, ApplicationList } from './style'

// 더미 신청자 데이터
const dummyApplicationsData = [
  {
    id: 1,
    profileImage: '/public/image.png',
    name: '열정가득 대학생',
    department: '소프트웨어학과',
    makeDate: '2023-04-26',
    message:
      '안녕하세요! 해당 주제에 대해 관심이 많아 신청합니다. 함께 이야기 나누고 싶습니다.',
    isAccepted: false,
  },
  {
    id: 2,
    profileImage: '/public/image.png',
    name: '알고리즘 좋아요',
    department: '컴퓨터공학과',
    makeDate: '2023-04-25',
    message:
      '저도 같은 고민을 하고 있어서 함께 이야기 나누고 싶어요. 최근에 관련 분야 인턴을 했었는데 도움이 될 것 같습니다!',
    isAccepted: false,
  },
  {
    id: 3,
    profileImage: '/public/image.png',
    name: '미래의 개발자',
    department: '정보통신학과',
    makeDate: '2023-04-25',
    message:
      '해당 주제에 대해 의견을 나누고 싶습니다. 비슷한 경험이 있어서 서로 도움이 될 것 같아요.',
    isAccepted: false,
  },
  {
    id: 4,
    profileImage: '/public/image.png',
    name: '취업준비생',
    department: '소프트웨어학과',
    makeDate: '2023-04-24',
    message:
      '같은 고민을 하고 있어서 신청합니다. 함께 이야기하면 좋은 해결책을 찾을 수 있을 것 같아요!',
    isAccepted: false,
  },
]

interface MatchedApplicationProps {}

// API로부터 받아온 신청자 정보 타입
interface WaitingUser {
  id: number
  waitingUserId: number
  waitingUserNickname: string
  waitingUserDepartment: string
  waitingUserEntranceTime: number
  waitingUserGraduation: boolean
  waitingUserCounselingCount: number
  waitingUserProfileImage: string
  message: string
  status: string
  createdAt: string
}

const MatchedApplication = ({}: MatchedApplicationProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { item } = location.state || {}
  const [applications, setApplications] = useState<WaitingUser[]>([])
  const [matchedRoom, setMatchedRoom] = useState(item || null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedApplication, setSelectedApplication] =
    useState<WaitingUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // 매칭 신청자 목록 조회 API 호출
    const fetchWaitingUsers = async () => {
      if (!matchedRoom || !matchedRoom.id) {
        // 매칭방 정보가 없으면 더미 데이터 사용
        return
      }

      setIsLoading(true)
      try {
        const res = await fetchWithRefresh(
          `http://localhost/api/matchings/${matchedRoom.id}/waiting-users?page=0&size=20`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        )

        if (!res.ok) {
          throw new Error('매칭 신청자 목록을 불러오지 못했습니다.')
        }

        const data = await res.json()
        if (Array.isArray(data.content)) {
          setApplications(data.content)
        } else {
          setApplications([])
        }
      } catch (error) {
        console.error('매칭 신청자 목록 조회 실패:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWaitingUsers()
  }, [matchedRoom])

  const handleOpenModal = (application: WaitingUser) => {
    setSelectedApplication(application)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleMatchApplicationClick = (application: WaitingUser) => {
    handleOpenModal(application)
  }

  const handleMatchingRequest = async () => {
    if (!selectedApplication || !matchedRoom) return

    try {
      const res = await fetchWithRefresh(
        `http://localhost/api/matchings/${matchedRoom.id}/${selectedApplication.id}/acceptance`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      )

      if (!res.ok) {
        throw new Error('매칭 수락에 실패했습니다.')
      }

      // 성공 시 모달 닫기 및 리스트 새로고침
      handleCloseModal()

      // 성공 메시지 또는 알림 표시 (실제 구현 필요)
      navigate('/matching/matched')
    } catch (error) {
      console.error('매칭 수락 실패:', error)
      alert('매칭 수락에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const renderModal = () => {
    if (!isModalOpen || !selectedApplication) return null

    return (
      <ModalComponent
        modalType="매칭하기"
        buttonText="매칭하기"
        buttonClick={handleMatchingRequest}
        onClose={handleCloseModal}
        isOpen={isModalOpen}
        userProfileProps={{
          profileImage:
            'http://localhost/api' +
            selectedApplication.waitingUserProfileImage,
          name: selectedApplication.waitingUserNickname,
          department: selectedApplication.waitingUserDepartment,
          makeDate: new Date(
            selectedApplication.createdAt
          ).toLocaleDateString(),
          userId: selectedApplication.waitingUserId,
        }}
        matchingInfoProps={{
          title: matchedRoom?.title || '',
          description: matchedRoom?.description || '',
        }}
        messageProps={{
          onMessageChange: () => {},
          messageValue: selectedApplication.message,
        }}
      />
    )
  }

  return (
    <RootContainer>
      <TopBar title="매칭 신청 정보" showBackButton actionText="" />
      <MatchingContainer>
        <ApplicationList pageType="matched">
          {isLoading ? (
            <div>로딩 중...</div>
          ) : applications.length > 0 ? (
            applications.map((application, index) => (
              <ApplicationInfo
                key={application.id}
                profileImage={
                  'http://localhost/api' + application.waitingUserProfileImage
                }
                name={application.waitingUserNickname}
                department={application.waitingUserDepartment}
                makeDate={new Date(application.createdAt).toLocaleDateString()}
                onClick={() => handleMatchApplicationClick(application)}
                message={application.message}
                borderSet={index < applications.length - 1}
              />
            ))
          ) : (
            <div>신청자가 없습니다.</div>
          )}
        </ApplicationList>
      </MatchingContainer>

      {renderModal()}
    </RootContainer>
  )
}

export default MatchedApplication
