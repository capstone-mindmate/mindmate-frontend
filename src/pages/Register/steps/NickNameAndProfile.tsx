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
import { useToast } from '../../../components/toast/ToastProvider'

interface NickNameAndProfileProps {
  goToNextStep: (data?: any) => void
  initialData?: any
}

const NickNameAndProfile = ({
  goToNextStep,
  initialData = {},
}: NickNameAndProfileProps) => {
  const { showToast } = useToast()
  const [isEnabled, setIsEnabled] = useState(false)
  const [userNickName, setUserNickName] = useState(initialData.nickname || '')
  const [profileImageFile, setProfileImageFile] = useState<File | undefined>(
    undefined
  )
  const [initialImageUrl, setInitialImageUrl] = useState<string | undefined>(
    undefined
  )

  // 초기 이미지 설정
  useEffect(() => {
    if (initialData.profileImage instanceof File) {
      setProfileImageFile(initialData.profileImage)
      // File 객체에서 Object URL 생성
      const imageUrl = URL.createObjectURL(initialData.profileImage)
      setInitialImageUrl(imageUrl)

      // 컴포넌트 언마운트 시 URL 정리
      return () => {
        URL.revokeObjectURL(imageUrl)
      }
    }
  }, [initialData.profileImage])

  useEffect(() => {
    setIsEnabled(userNickName !== '')
  }, [userNickName])

  const handleNickNameChange = (value: string) => {
    setUserNickName(value)
  }

  // File 선택 시 File 객체만 상태에 저장
  const handleImageChange = (file: File) => {
    // 파일 크기 검증 (1MB = 1024 * 1024 bytes)
    const maxSize = 1024 * 1024 // 1MB
    if (file.size > maxSize) {
      showToast(
        '사진의 용량이 너무 큽니다.\n1MB 이하의 이미지를 선택해주세요.',
        'error'
      )
      return
    }

    setProfileImageFile(file)

    // 새로운 이미지 선택 시 이전 URL 정리하고 새 URL 생성
    if (initialImageUrl) {
      URL.revokeObjectURL(initialImageUrl)
    }
    const newImageUrl = URL.createObjectURL(file)
    setInitialImageUrl(newImageUrl)
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

  // 컴포넌트 언마운트 시 Object URL 정리
  useEffect(() => {
    return () => {
      if (initialImageUrl) {
        URL.revokeObjectURL(initialImageUrl)
      }
    }
  }, [])

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
          initialImage={initialImageUrl}
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
