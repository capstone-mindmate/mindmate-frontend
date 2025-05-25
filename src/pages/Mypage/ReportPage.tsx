import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import TopBar from '../../components/topbar/Topbar'
import { ReportItem, ReportButton } from '../../components/buttons/reportButton'
import ModalComponent from '../../components/modal/modalComponent'
import { fetchWithRefresh } from '../../utils/fetchWithRefresh'
import {
  ContentContainer,
  ReportPageContainer,
  TitleText,
  ReportItemsContainer,
  TextAreaContainer,
  ReportTextArea,
  CharCounter,
  ReportButtonContainer,
} from './ReportPageStyles'

// 신고 사유 옵션 데이터
const REPORT_OPTIONS = [
  { id: 1, text: '욕설, 폭언, 비방 및 혐오표현을 사용해요' },
  { id: 2, text: '성적 수치심을 유발하거나 노출해요' },
  { id: 3, text: '도배 또는 반복적인 내용이에요' },
  { id: 4, text: '스팸 또는 악성 링크가 포함되어 있어요' },
  { id: 5, text: '상업적 목적의 과도한 홍보예요' },
  { id: 6, text: '개인정보를 불법으로 요구하거나 유출했어요' },
  { id: 7, text: '불법 정보 또는 행위를 조장해요' },
  { id: 8, text: '기타 문제가 있어 신고하고 싶어요' },
]

const MAX_CHARS = 1000

// 신고 사유 코드 매핑 (백엔드 ReportReason 열거형과 일치)
const REPORT_REASON_MAP: Record<string, string> = {
  '욕설, 폭언, 비방 및 혐오표현을 사용해요': 'ABUSIVE_LANGUAGE',
  '성적 수치심을 유발하거나 노출해요': 'SEXUAL_HARASSMENT',
  '도배 또는 반복적인 내용이에요': 'SPAM_OR_REPETITIVE',
  '스팸 또는 악성 링크가 포함되어 있어요': 'MALICIOUS_LINK',
  '상업적 목적의 과도한 홍보예요': 'EXCESSIVE_PROMOTION',
  '개인정보를 불법으로 요구하거나 유출했어요': 'PERSONAL_INFO_VIOLATION',
  '불법 정보 또는 행위를 조장해요': 'ILLEGAL_CONTENT',
  '기타 문제가 있어 신고하고 싶어요': 'OTHER',
}

// fromPage 값을 ReportTarget 열거형으로 변환하는 함수
const mapFromPageToReportTarget = (fromPage: string | undefined): string => {
  switch (fromPage?.toLowerCase()) {
    case 'matching':
      return 'MATCHING'
    case 'chatroom':
      return 'CHATROOM'
    case 'profile':
      return 'PROFILE'
    case 'magazine':
      return 'MAGAZINE'
    case 'review':
      return 'REVIEW'
    default:
      return 'PROFILE' // 기본값
  }
}

// reportTarget에 따라 적절한 targetId를 반환하는 함수
const getTargetId = (
  reportTarget: string,
  targetUserId: string | undefined,
  targetItemId: string | undefined
): string => {
  //console.log('getTargetId 호출:', { reportTarget, targetUserId, targetItemId })

  switch (reportTarget) {
    case 'MATCHING':
      // 매칭 신고의 경우 매칭 ID, 없으면 targetUserId 사용
      return targetItemId || targetUserId || '0'
    case 'CHATROOM':
      // 채팅방 신고의 경우 채팅방 ID, 없으면 targetUserId 사용
      return targetItemId || targetUserId || '0'
    case 'PROFILE':
      // 프로필 신고의 경우 프로필 ID (= 사용자 ID)
      return targetUserId || '0'
    case 'REVIEW':
      // 리뷰 신고의 경우 리뷰 ID, 없으면 targetUserId 사용
      return targetItemId || targetUserId || '0'
    case 'MAGAZINE':
      // 매거진 신고의 경우 매거진 ID, 없으면 targetUserId 사용
      return targetItemId || targetUserId || '0'
    default:
      // 기본값으로 targetUserId 사용
      return targetUserId || '0'
  }
}

const ReportPage = () => {
  const navigate = useNavigate()

  // URL 파라미터에서 값들을 가져옵니다
  const params = useParams<{
    reportedUserId?: string
    targetUserId?: string
    fromPage?: string
    targetItemId?: string
    chatId?: string // 채팅방 신고용
    profileId?: string // 프로필 신고용
  }>()

  // 채팅방 신고인지 확인 (URL에 chatId가 있으면 채팅방 신고)
  const isChatReport = !!params.chatId
  // 프로필 신고인지 확인 (URL에 profileId가 있으면 프로필 신고)
  const isProfileReport = !!params.profileId

  // 신고 유형에 따라 값들을 자동으로 설정
  const reportedUserId = params.reportedUserId
  const targetUserId = params.targetUserId
  const fromPage = isChatReport
    ? 'CHATROOM'
    : isProfileReport
      ? 'PROFILE'
      : params.fromPage
  const targetItemId = isChatReport
    ? params.chatId
    : isProfileReport
      ? params.profileId
      : params.targetItemId

  // 선택된 신고 사유들을 추적합니다
  const [selectedReports, setSelectedReports] = useState<string[]>([])

  // 텍스트 입력 상태
  const [reportText, setReportText] = useState('')

  // 신고 버튼 활성화 상태
  const [isButtonActivated, setIsButtonActivated] = useState(false)

  // 모달 표시 상태
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 신고 제출 중 상태 (중복 클릭 방지)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 선택된 신고 사유 변경시 버튼 활성화 상태 업데이트
  useEffect(() => {
    setIsButtonActivated(selectedReports.length > 0)
  }, [selectedReports])

  // 신고 사유 활성화 상태 변경 핸들러
  const handleReportActiveChange = (reportText: string, isActive: boolean) => {
    if (isActive) {
      // 활성화된 경우 목록에 추가
      setSelectedReports((prev) => [...prev, reportText])
    } else {
      // 비활성화된 경우 목록에서 제거
      setSelectedReports((prev) => prev.filter((text) => text !== reportText))
    }
  }

  // 텍스트 입력 핸들러
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (value.length <= MAX_CHARS) {
      setReportText(value)
    }
  }

  // 신고하기 버튼 클릭 핸들러
  const handleReportSubmit = async () => {
    // 이미 제출 중이거나 신고 사유가 선택되지 않은 경우 리턴
    if (isSubmitting || selectedReports.length === 0) {
      return
    }

    setIsSubmitting(true) // 제출 중 상태로 변경

    try {
      const reportReason = REPORT_REASON_MAP[selectedReports[0]] || 'OTHER'
      const reportTarget = mapFromPageToReportTarget(fromPage)
      const targetId = getTargetId(reportTarget, targetUserId, targetItemId)

      // 백엔드 ReportRequest DTO 형식에 맞게 요청 본문 구성
      const body = {
        reportedUserId: parseInt(targetUserId || '0'), // 신고받는 사용자 ID (숫자로 변환)
        reportReason: reportReason,
        additionalComment: reportText,
        reportTarget: reportTarget,
        targetId: parseInt(targetId), // 숫자로 변환
      }

      //console.log('최종 전송할 요청 본문:', body)

      const res = await fetchWithRefresh('https://mindmate.shop/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 인증 쿠키 전송
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error('서버 응답 에러:', errorText)

        try {
          const errorData = JSON.parse(errorText)
          // 중복 신고 에러 처리
          if (errorData.error === 'DUPLICATE_REPORT') {
            alert('이미 신고한 내용입니다.')
            navigate(-1) // 중복 신고 시 이전 페이지로 이동
            return
          }
          // 기타 에러의 경우 메시지가 있으면 표시
          if (errorData.message) {
            alert(errorData.message)
          } else {
            alert('신고 제출에 실패했습니다. 다시 시도해주세요.')
          }
        } catch (parseError) {
          // JSON 파싱 실패 시 기본 메시지
          alert('신고 제출에 실패했습니다. 다시 시도해주세요.')
        }
        return
      }

      // 성공 시 모달 표시
      setIsModalOpen(true)
    } catch (error) {
      console.error('신고 제출 실패:', error)
      // 네트워크 에러 등의 경우
      alert('신고 제출에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false) // 제출 완료 후 상태 리셋
    }
  }

  // 모달 확인 버튼 클릭 핸들러
  const handleModalConfirm = () => {
    // 모달 닫기
    setIsModalOpen(false)

    // 이전 페이지로 이동
    navigate(-1)
  }

  return (
    <ReportPageContainer>
      <TopBar
        title="신고하기"
        showBackButton
        showBorder={false}
        isFixed={true}
      />
      <ContentContainer>
        <TitleText>신고 사유를 선택해주세요</TitleText>

        <ReportItemsContainer>
          {REPORT_OPTIONS.map((option) => (
            <ReportItem
              key={option.id}
              reportText={option.text}
              onActiveChange={(isActive) =>
                handleReportActiveChange(option.text, isActive)
              }
            />
          ))}
        </ReportItemsContainer>

        <TextAreaContainer>
          <ReportTextArea
            placeholder="신고 내용을 상세히 작성해주세요. (최대 1000자)"
            value={reportText}
            onChange={handleTextChange}
            maxLength={MAX_CHARS}
          />
          <CharCounter>
            {reportText.length}/{MAX_CHARS}
          </CharCounter>
        </TextAreaContainer>

        <ReportButtonContainer>
          <ReportButton
            onActiveChange={handleReportSubmit}
            isActivated={isButtonActivated && !isSubmitting} // 제출 중일 때는 비활성화
          />
        </ReportButtonContainer>
      </ContentContainer>

      {/* 신고 완료 모달 */}
      {isModalOpen && (
        <ModalComponent
          modalType="신고완료"
          buttonText="확인"
          buttonClick={handleModalConfirm}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </ReportPageContainer>
  )
}

export default ReportPage
