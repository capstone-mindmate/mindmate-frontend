/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { fetchWithRefresh } from '../../utils/fetchWithRefresh'
import { useSocketMessage } from '../../hooks/useSocketMessage'
import { useToast } from '../../components/toast/ToastProvider'

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

    return true
  }

  // 답변 제출
  const handleSubmit = async () => {
    if (!formId || !chatRoomId) {
      showToast('폼 정보가 유효하지 않습니다.', 'error')
      return
    }

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // 웹소켓으로 전송 시도
      if (stompClient && stompClient.connected) {
        stompClient.publish({
          destination: '/app/chat.customform.respond',
          body: JSON.stringify({
            formId: Number(formId),
            chatRoomId: Number(chatRoomId),
            answers,
          }),
        })

        // 시스템 메시지 전송 (응답 완료 알림)
        stompClient.publish({
          destination: '/app/chat.send',
          body: JSON.stringify({
            roomId: chatRoomId,
            content: '상대방이 설문에 응답했습니다.',
            type: 'SYSTEM',
          }),
        })

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
      const res = await fetchWithRefresh(
        `http://localhost/api/custom-forms/${formId}/respond`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            formId: Number(formId),
            chatRoomId: Number(chatRoomId),
            answers,
          }),
        }
      )

      if (res.ok) {
        // 시스템 메시지도 REST API로 전송
        await sendSystemMessageREST(chatRoomId)
        navigate(`/chat/${chatRoomId}`, {
          state: {
            profileImage: otherProfileImageFromNav,
            userName: otherUserNameFromNav,
          },
        })
      } else {
        throw new Error('설문지 응답에 실패했습니다.')
      }
    } catch (e) {
      console.error('설문지 응답 제출 오류:', e)
      showToast('설문지 응답 제출에 실패했습니다. 다시 시도해주세요.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 답변 업데이트 핸들러
  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers]
    newAnswers[index] = value
    setAnswers(newAnswers)
  }

  // 시스템 메시지 REST API 전송 함수 (웹소켓 실패 시 대체용)
  const sendSystemMessageREST = async (roomId: string | number) => {
    try {
      const res = await fetchWithRefresh(`http://localhost/api/chat/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          content: '상대방이 설문에 응답했습니다.',
          type: 'SYSTEM',
        }),
      })

      if (!res.ok) {
        console.error('시스템 메시지 전송 실패')
      }
    } catch (e) {
      console.error('시스템 메시지 전송 오류:', e)
    }
  }

  // 모든 질문에 답변이 있는지 확인
  const hasAllAnswers = () => {
    return (
      answers.length === askList.length &&
      answers.every((answer) => answer.trim() !== '')
    )
  }

  return (
    <RootContainer>
      <TopBar
        title="답변 작성"
        showBackButton={true}
        onBackClick={() =>
          navigate(`/chat/${chatRoomId}`, {
            state: {
              profileImage: otherProfileImageFromNav,
              userName: otherUserNameFromNav,
            },
          })
        }
        isActionDisabled={!hasAllAnswers() || isSubmitting}
        actionText="완료"
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
              onAnswerChange={(value) => handleAnswerChange(index, value)}
            />
          ))}
        </CustomFormInputContainer>
      </CustomFormContainer>
    </RootContainer>
  )
}

export default CustomFormView
