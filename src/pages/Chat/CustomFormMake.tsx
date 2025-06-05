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
    if (askList.length > 1) {
      // 최소 1개는 유지
      setAskList(askList.filter((_, i) => i !== index))
    }
  }

  // 폼 제출 검증
  const validateForm = () => {
    // 빈 질문 제거 후 검증
    const validQuestions = askList.filter((ask) => ask.trim())

    if (validQuestions.length === 0) {
      showToast('최소 1개의 질문을 입력해주세요.', 'error')
      return false
    }

    if (validQuestions.length > 5) {
      showToast('질문은 최대 5개까지 입력할 수 있습니다.', 'error')
      return false
    }

    return true
  }

  // 폼 제출 처리 - 연속 제출 방지 로직 강화
  const handleSubmit = async () => {
    if (!matchId) {
      showToast('매칭 ID가 유효하지 않습니다.', 'error')
      return
    }

    if (isSubmitting) {
      showToast('설문지를 생성 중입니다. 잠시만 기다려주세요.', 'info')
      return
    }

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // 유효한 질문만 필터링
      const validQuestions = askList.filter((q) => q.trim())

      // 웹소켓으로 전송 시도
      if (stompClient && stompClient.connected) {
        // console.log('웹소켓으로 커스텀폼 생성 요청:', {
        //   chatRoomId: matchId,
        //   questions: validQuestions,
        // })

        stompClient.publish({
          destination: '/app/chat.customform.create',
          body: JSON.stringify({
            chatRoomId: matchId,
            questions: validQuestions,
          }),
        })

        // 성공 메시지
        showToast('설문지가 생성되었습니다.', 'success')

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
      //console.log('REST API로 커스텀폼 생성 요청')

      const res = await fetchWithRefresh(
        'https://mindmate.shop/api/custom-forms',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chatRoomId: matchId,
            questions: validQuestions,
          }),
        }
      )

      if (res.ok) {
        const data = await res.json()
        //console.log('커스텀 폼 생성 성공:', data)

        showToast('설문지가 생성되었습니다.', 'success')

        navigate(`/chat/${matchId}`, {
          state: {
            profileImage: otherProfileImageFromNav,
            userName: otherUserNameFromNav,
            newCustomForm: data,
          },
        })
      } else if (res.status === 429) {
        showToast('요청이 너무 빠릅니다. 잠시 후 다시 시도해주세요.', 'error')
      } else if (res.status >= 500) {
        showToast(
          '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          'error'
        )
      } else {
        throw new Error('커스텀 폼 생성에 실패했습니다.')
      }
    } catch (e) {
      console.error('커스텀 폼 생성 오류:', e)
      showToast('설문지 생성에 실패했습니다. 다시 시도해주세요.', 'error')
    } finally {
      // 연속 제출 방지를 위해 1초 후에 상태 리셋
      setTimeout(() => {
        setIsSubmitting(false)
      }, 1000)
    }
  }

  // 뒤로가기 처리
  const handleBackClick = () => {
    if (isSubmitting) {
      showToast('설문지 생성 중입니다. 잠시만 기다려주세요.', 'info')
      return
    }

    navigate(`/chat/${matchId}`, {
      state: {
        profileImage: otherProfileImageFromNav,
        userName: otherUserNameFromNav,
      },
    })
  }

  // 완료 버튼 활성화 조건
  const isFormValid = () => {
    const validQuestions = askList.filter((ask) => ask.trim())
    return validQuestions.length > 0 && !isSubmitting
  }

  return (
    <RootContainer>
      <TopBar
        title="설문지 작성"
        showBackButton={true}
        onBackClick={handleBackClick}
        actionText={isSubmitting ? '생성 중...' : '완료'}
        isActionDisabled={!isFormValid()}
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
                if (!isSubmitting) {
                  // 제출 중이 아닐 때만 변경 허용
                  const newList = [...askList]
                  newList[index] = value
                  setAskList(newList)
                }
              }}
              onCloseBtnClick={() => {
                if (!isSubmitting) {
                  // 제출 중이 아닐 때만 삭제 허용
                  handleDeleteAsk(index)
                }
              }}
            />
          ))}
          {askList.length < 5 && (
            <AnswerAddButton
              onClick={isSubmitting ? undefined : handleAddAsk} // 제출 중일 때 클릭 비활성화
              style={{
                opacity: isSubmitting ? 0.5 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                pointerEvents: isSubmitting ? 'none' : 'auto', // 클릭 이벤트 차단
              }}
            >
              질문추가
            </AnswerAddButton>
          )}
        </CustomFormInputContainer>
      </CustomFormContainer>
    </RootContainer>
  )
}

export default CustomFormMake
