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
  waitingUserProfileId: number
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedApplication, setSelectedApplication] =
    useState<WaitingUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
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
          `http://localhost/api/matchings/${matchedRoom.id}/waiting-users?page=0&size=30`,
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

  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true)
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false)
  }

  const handleMatchApplicationClick = (application: WaitingUser) => {
    handleOpenModal(application)
  }

  const handleProfileClick = (userId: number, waitingUserNickname: string) => {
    if (waitingUserNickname !== '익명') {
      navigate(`/mypage/${userId}`)
    } else {
      showToast('익명 사용자는 프로필 정보를 확인할 수 없습니다.', 'error')
    }
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

      const chatRoomId = await res.json() // 응답이 바로 채팅방 ID (예: 8)

      // 성공 시 모달 닫기
      handleCloseModal()

      // 상대방 정보 안전하게 추출
      const partnerNickname =
        selectedApplication.waitingUserNickname || '상대방'
      const partnerProfileImage =
        selectedApplication.waitingUserProfileImage ||
        '/default-profile-image.png'
      const partnerId = selectedApplication.waitingUserId

      // 바로 채팅방으로 이동 (ChatHome과 동일한 방식으로 state 전달)
      navigate(`/chat/${chatRoomId}`, {
        state: {
          profileImage: partnerProfileImage,
          userName: partnerNickname,
          matchingId: matchedRoom.id,
          oppositeId: partnerId,
        },
      })

      showToast('매칭이 성사되었습니다! 채팅을 시작해보세요.', 'success')
    } catch (error: any) {
      showToast(error.message, 'error')
    }
  }

  const handleDeleteMatchingRoom = async () => {
    if (!matchedRoom) return

    setIsDeleting(true)
    try {
      const res = await fetchWithRefresh(
        `http://localhost/api/matchings/${matchedRoom.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
        }
      )

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || '매칭방 삭제에 실패했습니다.')
      }

      showToast('매칭방이 삭제되었습니다.', 'success')
      navigate('/matching/matched')
    } catch (error: any) {
      showToast(error.message, 'error')
    } finally {
      setIsDeleting(false)
      setIsDeleteModalOpen(false)
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
          userId: selectedApplication.waitingUserProfileId,
        }}
        matchingInfoProps={{
          title: matchedRoom?.title || '',
          description: matchedRoom?.description || '',
        }}
        messageProps={{
          onMessageChange: () => {},
          messageValue: selectedApplication.message,
        }}
        onProfileClick={() => {
          if (selectedApplication.waitingUserNickname !== '익명') {
            handleProfileClick(
              selectedApplication.waitingUserProfileId,
              selectedApplication.waitingUserNickname
            )
          } else {
            showToast(
              '익명 사용자는 프로필 정보를 확인할 수 없습니다.',
              'error'
            )
          }
        }}
      />
    )
  }

  const renderDeleteModal = () => {
    if (!isDeleteModalOpen) return null

    return (
      <ModalComponent
        modalType="매칭방삭제"
        buttonText={isDeleting ? '삭제 중...' : '삭제하기'}
        buttonClick={handleDeleteMatchingRoom}
        onClose={handleCloseDeleteModal}
        isOpen={isDeleteModalOpen}
        onReject={handleCloseDeleteModal}
        userProfileProps={{
          profileImage: '',
          name: '',
          department: '',
          makeDate: '',
        }}
        matchingInfoProps={{
          title: '매칭방 삭제',
          description: '이 매칭방을 삭제하시겠습니까?',
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
      <TopBar
        title="매칭 신청 정보"
        showBackButton
        actionText="삭제"
        onBackClick={() => navigate('/matching/matched')}
        onActionClick={handleOpenDeleteModal}
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
                onProfileClick={() =>
                  handleProfileClick(
                    application.waitingUserProfileId,
                    application.waitingUserNickname
                  )
                }
              />
            ))
          ) : (
            <div style={{ padding: '20px', textAlign: 'left', color: '#888' }}>
              신청자가 없습니다.
            </div>
          )}
        </ApplicationList>
      </MatchingContainer>

      {renderModal()}
      {renderDeleteModal()}
    </RootContainer>
  )
}

export default MatchedApplication
