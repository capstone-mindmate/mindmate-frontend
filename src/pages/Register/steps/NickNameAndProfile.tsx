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

const NickNameAndProfile = ({ goToNextStep }: { goToNextStep: () => void }) => {
  const [isEnabled, setIsEnabled] = useState(false)

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

      <RegisterInputContainer></RegisterInputContainer>

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
