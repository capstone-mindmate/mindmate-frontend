/** @jsxImportSource @emotion/react */
import { useState, useEffect, useRef } from 'react'

import { RootContainer, CustomFormContainer } from './styles/RootStyles'
import {
  HeadTextContainer,
  HeadText,
  CustomFormInputContainer,
} from './styles/CustomFormViewStyles'

import TopBar from '../../components/topbar/Topbar'
import AskInput from '../../components/customForm/AnswerInput'

interface CustomFormViewProps {
  matchId: string | undefined
}

const CustomFormView = ({ matchId }: CustomFormViewProps) => {
  const [askList, setAskList] = useState<string[]>([])
  const [answers, setAnswers] = useState<string[]>([])

  const handleAddAsk = () => {
    setAskList([...askList, ''])
  }

  // 모든 질문에 답변이 있는지 확인
  const hasAllAnswers = () => {
    return (
      answers.length === askList.length &&
      answers.every((answer) => answer.trim() !== '')
    )
  }

  // 답변 업데이트 핸들러
  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers]
    newAnswers[index] = value
    setAnswers(newAnswers)
  }

  return (
    <RootContainer>
      <TopBar
        title="답변 작성"
        showBackButton={true}
        onBackClick={() => {}}
        isActionDisabled={!hasAllAnswers()}
        actionText="완료"
        onActionClick={() => {}}
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
