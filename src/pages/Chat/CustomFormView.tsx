/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { fetchWithRefresh } from '../../utils/fetchWithRefresh'
import { useSocketMessage } from '../../hooks/useSocketMessage'
import { useToast } from '../../components/toast/ToastProvider'
import { useAuthStore } from '../../stores/userStore'

import { RootContainer, CustomFormContainer } from './styles/RootStyles'
import {
  HeadTextContainer,
  HeadText,
  CustomFormInputContainer,
} from './styles/CustomFormViewStyles'

import TopBar from '../../components/topbar/Topbar'
import AskInput from '../../components/customForm/AnswerInput'

interface CustomFormViewProps {
  formId: string | undefined
  matchId: string | undefined
}

const CustomFormView = ({ formId, matchId }: CustomFormViewProps) => {
  const [askList, setAskList] = useState<string[]>([])
  const [answers, setAnswers] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<any>(null)

  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const chatRoomId = matchId
  const { stompClient, isConnected } = useSocketMessage()
  const { showToast } = useToast()

  const otherProfileImageFromNav = location.state?.profileImage
  const otherUserNameFromNav = location.state?.userName

  // 폼 상세 조회
  useEffect(() => {
    if (!formId) return

    const fetchFormData = async () => {
      try {
        const res = await fetchWithRefresh(
          `http://localhost/api/custom-forms/${formId}`
        )
        if (!res.ok) {
          throw new Error('설문지 정보를 불러오지 못했습니다.')
        }
        const data = await res.json()
        setFormData(data)
        setAskList(data.items?.map((item: any) => item.question) || [])
        // 답변 배열을 질문 수만큼 빈 문자열로 초기화
        setAnswers(new Array(data.items?.length || 0).fill(''))
      } catch (e) {
        console.error('폼 데이터 조회 실패:', e)
        showToast('설문지 정보를 불러오지 못했습니다.', 'error')
      }
    }

    fetchFormData()
  }, [formId, showToast])

  // 폼 제출 검증
  const validateForm = () => {
    // 모든 질문에 답변했는지 확인
    if (answers.length !== askList.length) {
      showToast('모든 질문에 답변해주세요.', 'error')
      return false
    }

    if (answers.some((answer) => !answer.trim())) {
      showToast('모든 질문에 답변해주세요.', 'error')
      return false
    }

    // 답변 길이 검증 (예: 각 답변 최대 500자)
    const tooLongAnswers = answers.filter(
      (answer) => answer.trim().length > 500
    )
    if (tooLongAnswers.length > 0) {
      showToast('답변은 500자 이하로 입력해주세요.', 'error')
      return false
    }

    return true
  }

  // 답변 제출 - 연속 제출 방지 로직 강화
  const handleSubmit = async () => {
    if (!formId || !chatRoomId) {
      showToast('폼 정보가 유효하지 않습니다.', 'error')
      return
    }

    if (isSubmitting) {
      showToast('답변을 제출 중입니다. 잠시만 기다려주세요.', 'info')
      return
    }

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // 유효한 답변만 필터링 (앞뒤 공백 제거)
      const trimmedAnswers = answers.map((answer) => answer.trim())

      // 웹소켓으로 전송 시도
      if (stompClient && stompClient.connected) {
        const myUserId = user?.userId

        // 커스텀폼 채널로만 전송
        stompClient.publish({
          destination: '/app/chat.customform.respond',
          body: JSON.stringify({
            formId: Number(formId),
            chatRoomId: Number(chatRoomId),
            answers: trimmedAnswers,
            type: 'CUSTOM_FORM',
            answered: true,
            responderId: myUserId,
          }),
        })

        //console.log('커스텀폼 답변 웹소켓 전송 완료')

        showToast('답변이 제출되었습니다.', 'success')

        // 채팅방으로 이동
        navigate(`/chat/${chatRoomId}`, {
          state: {
            profileImage: otherProfileImageFromNav,
            userName: otherUserNameFromNav,
          },
        })
        return
      }

      // 웹소켓 연결이 안되었을 경우 REST API 호출로 대체
      //console.log('REST API로 커스텀폼 답변 제출')

      const res = await fetchWithRefresh(
        `http://localhost/api/custom-forms/${formId}/respond`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            formId: Number(formId),
            chatRoomId: Number(chatRoomId),
            answers: trimmedAnswers,
          }),
        }
      )

      if (res.ok) {
        //console.log('REST API 커스텀폼 답변 제출 성공')

        showToast('답변이 제출되었습니다.', 'success')

        navigate(`/chat/${chatRoomId}`, {
          state: {
            profileImage: otherProfileImageFromNav,
            userName: otherUserNameFromNav,
          },
        })
      } else if (res.status === 429) {
        showToast('요청이 너무 빠릅니다. 잠시 후 다시 시도해주세요.', 'error')
      } else if (res.status >= 500) {
        showToast(
          '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          'error'
        )
      } else if (res.status === 409) {
        showToast('이미 답변이 완료된 설문지입니다.', 'error')
      } else {
        throw new Error('설문지 응답에 실패했습니다.')
      }
    } catch (e) {
      console.error('설문지 응답 제출 오류:', e)
      showToast('설문지 응답 제출에 실패했습니다. 다시 시도해주세요.', 'error')
    } finally {
      // 연속 제출 방지를 위해 1초 후에 상태 리셋
      setTimeout(() => {
        setIsSubmitting(false)
      }, 1000)
    }
  }

  // 답변 업데이트 핸들러
  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers]
    newAnswers[index] = value
    setAnswers(newAnswers)
  }

  // 뒤로가기 처리
  const handleBackClick = () => {
    if (isSubmitting) {
      showToast('답변 제출 중입니다. 잠시만 기다려주세요.', 'info')
      return
    }

    navigate(`/chat/${chatRoomId}`, {
      state: {
        profileImage: otherProfileImageFromNav,
        userName: otherUserNameFromNav,
      },
    })
  }

  // 모든 질문에 답변이 있는지 확인
  const hasAllAnswers = () => {
    return (
      answers.length === askList.length &&
      answers.every((answer) => answer.trim() !== '')
    )
  }

  // 완료 버튼 활성화 조건
  const isFormComplete = () => {
    return hasAllAnswers() && !isSubmitting
  }

  return (
    <RootContainer>
      <TopBar
        title="답변 작성"
        showBackButton={true}
        onBackClick={handleBackClick}
        isActionDisabled={!isFormComplete()}
        actionText={isSubmitting ? '제출 중...' : '완료'}
        onActionClick={handleSubmit}
      />
      <CustomFormContainer>
        <HeadTextContainer>
          <HeadText>질문이 도착했어요 📝</HeadText>
        </HeadTextContainer>

        <CustomFormInputContainer>
          {askList.map((ask, index) => (
            <AskInput
              key={index}
              title={ask}
              onAnswerChange={(value) => {
                if (!isSubmitting) {
                  // 제출 중이 아닐 때만 변경 허용
                  handleAnswerChange(index, value)
                }
              }}
            />
          ))}
        </CustomFormInputContainer>
      </CustomFormContainer>
    </RootContainer>
  )
}

export default CustomFormView
