/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import TopBar from '../../components/topbar/Topbar'
import ApplicationInfo from '../../components/matching/applicationInfo'
import ModalComponent from '../../components/modal/modalComponent'

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

const MatchedApplication = ({}: MatchedApplicationProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { item } = location.state || {}
  const [applications, setApplications] = useState(dummyApplicationsData)
  const [matchedRoom, setMatchedRoom] = useState(item || null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<
    (typeof dummyApplicationsData)[0] | null
  >(null)

  useEffect(() => {
    // API 호출 로직 추가하기
  }, [matchedRoom])

  const handleOpenModal = (application: (typeof dummyApplicationsData)[0]) => {
    setSelectedApplication(application)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleMatchApplicationClick = (
    application: (typeof dummyApplicationsData)[0]
  ) => {
    handleOpenModal(application)
  }

  const handleMatchingRequest = () => {
    // 여기서 매칭 신청 콜하기
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
          profileImage: selectedApplication.profileImage,
          name: selectedApplication.name,
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
      <TopBar title="매칭 신청 정보" showBackButton actionText="" />
      <MatchingContainer>
        <ApplicationList pageType="matched">
          {applications.length > 0 ? (
            applications.map((application, index) => (
              <ApplicationInfo
                key={application.id}
                profileImage={application.profileImage}
                name={application.name}
                department={application.department}
                makeDate={application.makeDate}
                onClick={() => handleMatchApplicationClick(application)}
                message={application.message}
                borderSet={index < applications.length - 1}
              />
            ))
          ) : (
            <div></div>
          )}
        </ApplicationList>
      </MatchingContainer>

      {renderModal()}
    </RootContainer>
  )
}

export default MatchedApplication
