/** @jsxImportSource @emotion/react */
import {
  RegisterContainer,
  RegisterTitle,
  RegisterTitleContainer,
  RegisterInputContainer,
  RegisterConfirmButtonContainer,
} from './styles/InitialStyles'
import BrownRectButton from '../../../components/buttons/brownRectButton'
import { useState, useEffect } from 'react'
import InitialProfileImageSetting from '../../../components/mypage/InitialProfileImageSetting'
import TitleInputBox from '../../../components/inputs/titleInputBox'

const NickNameAndProfile = ({ goToNextStep }: { goToNextStep: () => void }) => {
  const [isEnabled, setIsEnabled] = useState(false)
  const [userNickName, setUserNickName] = useState('')

  useEffect(() => {
    setIsEnabled(userNickName !== '')
  }, [userNickName])

  const handleNickNameChange = (value: string) => {
    setUserNickName(value)
  }

  const handleNextStep = () => {
    if (isEnabled) {
      goToNextStep()
    }
  }

  return (
    <RegisterContainer>
      <RegisterTitleContainer>
        <RegisterTitle>
          거의 다왔어요!
          <br />
          닉네임을 설정해주세요
        </RegisterTitle>
      </RegisterTitleContainer>

      <RegisterInputContainer>
        <InitialProfileImageSetting onImageChange={() => {}} />
        <TitleInputBox
          placeholder="닉네임을 입력해주세요"
          onChange={handleNickNameChange}
          titleText="닉네임"
        />
      </RegisterInputContainer>

      <RegisterConfirmButtonContainer>
        <BrownRectButton
          isEnabled={isEnabled}
          buttonText="다음"
          onActiveChange={handleNextStep}
        />
      </RegisterConfirmButtonContainer>
    </RegisterContainer>
  )
}

export default NickNameAndProfile
