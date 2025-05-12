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

interface NickNameAndProfileProps {
  goToNextStep: (data?: any) => void
  initialData?: any
}

const NickNameAndProfile = ({
  goToNextStep,
  initialData = {},
}: NickNameAndProfileProps) => {
  const [isEnabled, setIsEnabled] = useState(false)
  const [userNickName, setUserNickName] = useState(initialData.nickname || '')
  const [profileImageFile, setProfileImageFile] = useState<File | undefined>(
    undefined
  )

  useEffect(() => {
    setIsEnabled(userNickName !== '')
  }, [userNickName])

  const handleNickNameChange = (value: string) => {
    setUserNickName(value)
  }

  // File 선택 시 File 객체만 상태에 저장
  const handleImageChange = (file: File) => {
    setProfileImageFile(file)
  }

  const handleNextStep = () => {
    if (isEnabled) {
      const updatedData: any = { nickname: userNickName }
      if (profileImageFile) {
        updatedData.profileImage = profileImageFile
      }
      goToNextStep(updatedData)
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
        <InitialProfileImageSetting
          onImageChange={handleImageChange}
          initialImage={
            profileImageFile ? URL.createObjectURL(profileImageFile) : undefined
          }
        />
        <TitleInputBox
          placeholder="닉네임을 입력해주세요"
          onChange={handleNickNameChange}
          titleText="닉네임"
          initialValue={userNickName}
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
