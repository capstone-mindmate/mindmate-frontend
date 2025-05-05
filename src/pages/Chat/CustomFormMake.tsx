/** @jsxImportSource @emotion/react */
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import { RootContainer, CustomFormContainer } from './styles/RootStyles'
import {
  HeadTextContainer,
  HeadText,
  CustomFormInputContainer,
  AnswerAddButton,
} from './styles/CustomFormMakeStyles'

import TopBar from '../../components/topbar/Topbar'
import AskInput from '../../components/customForm/AskInput'
interface CustomFormMakeProps {
  matchId: string | undefined
}

const CustomFormMake = ({ matchId }: CustomFormMakeProps) => {
  const navigate = useNavigate()

  const [askList, setAskList] = useState<string[]>(['', '', ''])

  const handleAddAsk = () => {
    if (askList.length < 5) {
      setAskList([...askList, ''])
    }
  }

  const handleDeleteAsk = (index: number) => {
    setAskList(askList.filter((_, i) => i !== index))
  }

  return (
    <RootContainer>
      <TopBar
        title="설문지 작성"
        showBackButton={true}
        onBackClick={() => {
          navigate(`/chat/${matchId}`)
        }}
        actionText="완료"
        onActionClick={() => {}}
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
