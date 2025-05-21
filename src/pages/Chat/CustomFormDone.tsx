/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { fetchWithRefresh } from '../../utils/fetchWithRefresh'
import { useToast } from '../../components/toast/ToastProvider'

import { RootContainer, CustomFormContainer } from './styles/RootStyles'
import {
  HeadTextContainer,
  HeadText,
  CustomFormInputContainer,
} from './styles/CustomFormViewStyles'

import TopBar from '../../components/topbar/Topbar'
import Answer from '../../components/customForm/Answer'

interface CustomFormViewProps {
  formId: string | undefined
  matchId: string | undefined
}

const CustomFormView = ({ formId, matchId }: CustomFormViewProps) => {
  const [askList, setAskList] = useState<string[]>([])
  const [answers, setAnswers] = useState<string[]>([])
  const location = useLocation()
  const navigate = useNavigate()
  const chatRoomId = matchId
  const { showToast } = useToast()

  const otherProfileImageFromNav = location.state?.profileImage
  const otherUserNameFromNav = location.state?.userName

  // 폼 상세 조회
  useEffect(() => {
    if (!formId) return

    const fetchFormData = async () => {
      try {
        const res = await fetchWithRefresh(
          `https://mindmate.shop/api/custom-forms/${formId}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        )
        if (!res.ok) {
          throw new Error('설문지 정보를 불러오지 못했습니다.')
        }
        const data = await res.json()
        setAskList(data.items?.map((item: any) => item.question) || [])
        setAnswers(data.items?.map((item: any) => item.answer) || [])
      } catch (e) {
        console.error('폼 데이터 조회 실패:', e)
        showToast('설문지 정보를 불러오지 못했습니다.', 'error')
      }
    }

    fetchFormData()
  }, [formId, showToast])

  return (
    <RootContainer>
      <TopBar
        title={`${otherUserNameFromNav}님의 설문지`}
        showBackButton={true}
        onBackClick={() =>
          navigate(`/chat/${chatRoomId}`, {
            state: {
              profileImage: otherProfileImageFromNav,
              userName: otherUserNameFromNav,
            },
          })
        }
      />
      <CustomFormContainer>
        <HeadTextContainer>
          <HeadText>질문이 도착했어요 📝</HeadText>
        </HeadTextContainer>

        <CustomFormInputContainer>
          {askList.map((ask, index) => (
            <Answer key={index} title={ask} answer={answers[index]} />
          ))}
        </CustomFormInputContainer>
      </CustomFormContainer>
    </RootContainer>
  )
}

export default CustomFormView
