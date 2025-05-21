/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import TopBar from '../../components/topbar/Topbar'
import ApplicationInfo from '../../components/matching/applicationInfo'
import ModalComponent from '../../components/modal/modalComponent'
import { fetchWithRefresh } from '../../utils/fetchWithRefresh'

import { css } from '@emotion/react'

import { RootContainer, MatchingContainer, ApplicationList } from './style'
import { useToast } from '../../components/toast/ToastProvider'

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
  const { showToast } = useToast()

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
          const errorData = await res.json()
          throw new Error(
            errorData.message || '매칭 신청자 목록을 불러오지 못했습니다.'
          )
        }

        const data = await res.json()
        if (Array.isArray(data.content)) {
          setApplications(data.content)
        } else {
          setApplications([])
        }
      } catch (error: any) {
        showToast(error.message, 'error')
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
        const errorData = await res.json()
        throw new Error(errorData.message || '매칭 수락에 실패했습니다.')
      }

      // 성공 시 모달 닫기 및 리스트 새로고침
      handleCloseModal()

      navigate('/matching')
    } catch (error: any) {
      showToast(error.message, 'error')
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
      <TopBar
        title="매칭 신청 정보"
        showBackButton
        actionText=""
        onBackClick={() => navigate('/matching/matched')}
      />
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
