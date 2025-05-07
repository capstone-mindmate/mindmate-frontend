import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import TopBar from '../../components/topbar/Topbar'
import { ReportItem, ReportButton } from '../../components/buttons/reportButton'
import ModalComponent from '../../components/modal/modalComponent'
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

const ReportPage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // 선택된 신고 사유들을 추적합니다
  const [selectedReports, setSelectedReports] = useState<string[]>([])

  // 텍스트 입력 상태
  const [reportText, setReportText] = useState('')

  // 신고 버튼 활성화 상태
  const [isButtonActivated, setIsButtonActivated] = useState(false)

  // 모달 표시 상태
  const [isModalOpen, setIsModalOpen] = useState(false)

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
  const handleReportSubmit = () => {
    // 선택된 신고 사유가 있을 때만 제출 가능
    if (selectedReports.length > 0) {
      console.log('신고 제출 완료!')
      console.log('선택된 신고 사유:', selectedReports)
      console.log('추가 신고 텍스트:', reportText)

      // Todo: 서버로 데이터 전송 로직 추가

      // 신고 완료 모달 표시
      setIsModalOpen(true)
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
            isActivated={isButtonActivated}
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
