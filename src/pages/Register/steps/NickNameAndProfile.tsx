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

// File을 base64로 변환하는 함수
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const NickNameAndProfile = ({
  goToNextStep,
  initialData = {},
}: NickNameAndProfileProps) => {
  const [isEnabled, setIsEnabled] = useState(false)
  const [userNickName, setUserNickName] = useState(initialData.nickname || '')
  // base64 문자열로 상태 관리 (undefined 허용)
  const [profileImage, setProfileImage] = useState<string | undefined>(
    initialData.profileImage
  )

  useEffect(() => {
    setIsEnabled(userNickName !== '')
  }, [userNickName])

  const handleNickNameChange = (value: string) => {
    setUserNickName(value)
  }

  // File 선택 시 base64로 변환해서 상태에 저장
  const handleImageChange = async (file: File) => {
    const base64 = await fileToBase64(file)
    setProfileImage(base64)
  }

  const handleNextStep = () => {
    if (isEnabled) {
      const updatedData: any = { nickname: userNickName }
      if (profileImage) {
        updatedData.profileImage = profileImage
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
          initialImage={profileImage}
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
