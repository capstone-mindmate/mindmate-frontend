/** @jsxImportSource @emotion/react */
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSocketMessage } from '../../hooks/useSocketMessage'
import { useToast } from '../../components/toast/ToastProvider'

import { RootContainer, CustomFormContainer } from './styles/RootStyles'
import {
  HeadTextContainer,
  HeadText,
  CustomFormInputContainer,
  AnswerAddButton,
} from './styles/CustomFormMakeStyles'

import TopBar from '../../components/topbar/Topbar'
import AskInput from '../../components/customForm/AskInput'
import { fetchWithRefresh } from '../../utils/fetchWithRefresh'

interface CustomFormMakeProps {
  matchId: string | undefined
}

const CustomFormMake = ({ matchId }: CustomFormMakeProps) => {
  const navigate = useNavigate()
  const { stompClient } = useSocketMessage()
  const { showToast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const location = useLocation()
  const otherProfileImageFromNav = location.state?.profileImage
  const otherUserNameFromNav = location.state?.userName

  // 질문 목록 상태
  const [askList, setAskList] = useState<string[]>(['', '', ''])

  // 질문 추가
  const handleAddAsk = () => {
    if (askList.length < 5) {
      setAskList([...askList, ''])
    }
  }

  // 질문 삭제
  const handleDeleteAsk = (index: number) => {
    setAskList(askList.filter((_, i) => i !== index))
  }

  // 폼 제출 검증
  const validateForm = () => {
    // 모든 질문이 채워져 있는지 확인
    if (askList.some((ask) => !ask.trim())) {
      showToast('모든 질문을 입력해주세요.', 'error')
      return false
    }
    return true
  }

  // 폼 제출 처리
  const handleSubmit = async () => {
    if (!matchId) {
      showToast('매칭 ID가 유효하지 않습니다.', 'error')
      return
    }

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // 웹소켓으로 전송 시도
      if (stompClient && stompClient.connected) {
        // 유효한 질문만 필터링
        const validQuestions = askList.filter((q) => q.trim())

        stompClient.publish({
          destination: '/app/chat.customform.create',
          body: JSON.stringify({
            chatRoomId: matchId,
            questions: validQuestions,
          }),
        })

        // 채팅방으로 이동
        navigate(`/chat/${matchId}`, {
          state: {
            profileImage: otherProfileImageFromNav,
            userName: otherUserNameFromNav,
          },
        })
        return
      }

      // 웹소켓 연결이 안되었을 경우 REST API 호출로 대체
      const res = await fetchWithRefresh(
        'https://mindmate.shop/api/custom-forms',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chatRoomId: matchId,
            questions: askList.filter((q) => q.trim()),
          }),
        }
      )

      if (res.ok) {
        const data = await res.json()
        console.log('커스텀 폼 생성 성공:', data)
        navigate(`/chat/${matchId}`, {
          state: {
            profileImage: otherProfileImageFromNav,
            userName: otherUserNameFromNav,
            newCustomForm: data,
          },
        })
      } else {
        throw new Error('커스텀 폼 생성에 실패했습니다.')
      }
    } catch (e) {
      console.error('커스텀 폼 생성 오류:', e)
      showToast('설문지 생성에 실패했습니다. 다시 시도해주세요.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <RootContainer>
      <TopBar
        title="설문지 작성"
        showBackButton={true}
        onBackClick={() => {
          navigate(`/chat/${matchId}`, {
            state: {
              profileImage: otherProfileImageFromNav,
              userName: otherUserNameFromNav,
            },
          })
        }}
        actionText="완료"
        isActionDisabled={isSubmitting}
        onActionClick={handleSubmit}
      />

      <CustomFormContainer>
        <HeadTextContainer>
          <HeadText>궁금한 점을 자유롭게 질문해보세요! ✍🏻</HeadText>
        </HeadTextContainer>

        <CustomFormInputContainer>
          {askList.map((ask, index) => (
            <AskInput
              key={index}
              placeHolder="질문을 입력해주세요"
              value={ask}
              onChange={(value) => {
                const newList = [...askList]
                newList[index] = value
                setAskList(newList)
              }}
              onCloseBtnClick={() => handleDeleteAsk(index)}
            />
          ))}
          {askList.length < 5 && (
            <AnswerAddButton onClick={handleAddAsk}>질문추가</AnswerAddButton>
          )}
        </CustomFormInputContainer>
      </CustomFormContainer>
    </RootContainer>
  )
}

export default CustomFormMake
