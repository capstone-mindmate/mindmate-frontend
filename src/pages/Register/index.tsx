/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import DepartmentAndAdmission from './steps/DepartmentAndAdmission'
import NickNameAndProfile from './steps/NickNameAndProfile'
import InitialCategorySetting from './steps/InitialCategorySetting'
import FinalConfirmation from './steps/FinalConfirmation'
import {
  RegisterContainer,
  RegisterStepContainer,
  StepIndicatorContainer,
  StepDot,
  RegisterNavBar,
  RootContainer,
} from './style'
import { BackIcon } from '../../components/icon/iconComponents'
import { useMutation } from '@tanstack/react-query'
import { fetchWithRefresh } from '../../utils/fetchWithRefresh'
import { useAuthStore } from '../../stores/userStore'
import { useToast } from '../../components/toast/ToastProvider'

// 회원 상태 타입 신규(NEW) 재방문(REVISITING)
type UserStatus = 'NEW' | 'REVISITING'

type RegisterStep =
  | 'DEPARTMENT_AND_ADMISSION'
  | 'NICKNAME_AND_PROFILE'
  | 'INITIAL_CATEGORY_SETTING'
  | 'FINAL_CONFIRMATION'

// 로컬 스토리지 키
const REGISTER_DATA_KEY = 'register_data'
const REGISTER_STEP_KEY = 'register_step'

// File을 base64로 변환하는 함수
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

// base64를 File로 변환하는 함수
const base64ToFile = (base64: string, filename: string): File => {
  const arr = base64.split(',')
  const mime = arr[0].match(/:(.*?);/)![1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

// 로컬 스토리지에 저장할 데이터 준비 함수
const prepareDataForStorage = async (data: any) => {
  const storageData = { ...data }

  // File 객체가 있으면 base64로 변환
  if (data.profileImage instanceof File) {
    try {
      const base64 = await fileToBase64(data.profileImage)
      storageData.profileImage = {
        base64,
        name: data.profileImage.name,
        type: data.profileImage.type,
        isFile: true,
      }
    } catch (error) {
      console.error('File to base64 conversion failed:', error)
      delete storageData.profileImage
    }
  }

  return storageData
}

// 로컬 스토리지에서 데이터 복원 함수
const restoreDataFromStorage = (data: any) => {
  const restoredData = { ...data }

  // base64 데이터가 있으면 File 객체로 변환
  if (
    data.profileImage &&
    data.profileImage.isFile &&
    data.profileImage.base64
  ) {
    try {
      const file = base64ToFile(
        data.profileImage.base64,
        data.profileImage.name
      )
      restoredData.profileImage = file
    } catch (error) {
      console.error('Base64 to file conversion failed:', error)
      delete restoredData.profileImage
    }
  }

  return restoredData
}

const StepIndicator = ({ currentStep }: { currentStep: RegisterStep }) => {
  const steps: RegisterStep[] = [
    'DEPARTMENT_AND_ADMISSION',
    'NICKNAME_AND_PROFILE',
    'INITIAL_CATEGORY_SETTING',
    'FINAL_CONFIRMATION',
  ]

  return (
    <StepIndicatorContainer>
      {steps.map((step, index) => (
        <StepDot key={step} isActive={currentStep === step} />
      ))}
    </StepIndicatorContainer>
  )
}

const Register = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { setUser, user } = useAuthStore()
  const { showToast } = useToast()

  // 로컬 스토리지에서 이전 데이터 불러오기
  const getInitialStep = (): RegisterStep => {
    return 'DEPARTMENT_AND_ADMISSION'
  }

  const getInitialData = () => {
    const savedData = localStorage.getItem(REGISTER_DATA_KEY)
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        return restoreDataFromStorage(parsedData)
      } catch (error) {
        console.error('Failed to parse register data from localStorage:', error)
        return {}
      }
    }
    return {}
  }

  const [currentStep, setCurrentStep] = useState<RegisterStep>(getInitialStep())
  // 사용자 상태 확인 신규인지 재방문 인지 <- 백이랑 얘기
  const [userStatus, setUserStatus] = useState<UserStatus>('NEW')

  // 회원가입 데이터 상태 관리
  const [registerData, setRegisterData] = useState(getInitialData())

  // 데이터를 로컬 스토리지에 저장하는 함수
  const saveDataToStorage = async (data: any) => {
    try {
      const storageData = await prepareDataForStorage(data)
      localStorage.setItem(REGISTER_DATA_KEY, JSON.stringify(storageData))
    } catch (error) {
      console.error('Failed to save data to localStorage:', error)
    }
  }

  // 데이터나 단계가 변경될 때 로컬 스토리지에 저장
  useEffect(() => {
    saveDataToStorage(registerData)
  }, [registerData])

  useEffect(() => {
    localStorage.setItem(REGISTER_STEP_KEY, currentStep)
  }, [currentStep])

  // 이미 로그인된 경우 home으로 이동
  useEffect(() => {
    if (user) {
      navigate('/home', { replace: true })
    }
  }, [user, navigate])

  // 프로필 생성 mutation
  const profileMutation = useMutation({
    mutationFn: async (profileData: any) => {
      const res = await fetchWithRefresh('http://localhost/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      })
      const data = await res.json()
      if (!res.ok) {
        // 415 에러 (닉네임 중복)인 경우
        if (res.status === 415) {
          throw new Error('NICKNAME_DUPLICATE')
        }
        throw new Error(data.message || '프로필 생성 실패')
      }
      return data
    },
    onSuccess: async (data) => {
      localStorage.setItem('userId', data.id)

      const res = await fetchWithRefresh(`http://localhost/api/profiles`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      const ProfileData = await res.json()
      if (!res.ok) throw new Error(await res.json())

      setUser(ProfileData)

      // 회원가입 완료 후 로컬 스토리지 데이터 정리
      localStorage.removeItem(REGISTER_DATA_KEY)
      localStorage.removeItem(REGISTER_STEP_KEY)

      navigate('/home')
    },
    onError: (error: Error) => {
      console.error(error)
      if (error.message === '이미 존재하는 닉네임입니다.') {
        showToast('중복된 닉네임입니다.', 'error')
      } else {
        showToast('프로필 생성 중 오류가 발생했습니다.', 'error')
      }
    },
  })

  // 다음 단계로 이동하는 함수
  const goToNextStep = async (data?: any) => {
    const stepOrder: RegisterStep[] = [
      'DEPARTMENT_AND_ADMISSION',
      'NICKNAME_AND_PROFILE',
      'INITIAL_CATEGORY_SETTING',
      'FINAL_CONFIRMATION',
    ]

    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex < stepOrder.length - 1) {
      // 데이터가 있으면 상태 업데이트
      let updatedData = { ...registerData, ...data }
      setRegisterData(updatedData)
      setCurrentStep(stepOrder[currentIndex + 1])
    } else if (currentStep === 'FINAL_CONFIRMATION') {
      let profileImageId: number | undefined = undefined

      // File 객체 확인 및 업로드
      const imageFile =
        registerData.profileImage instanceof File
          ? registerData.profileImage
          : undefined

      if (imageFile) {
        try {
          // 1. 이미지 업로드
          const formData = new FormData()
          formData.append('file', imageFile)
          const imageRes = await fetchWithRefresh(
            'http://localhost/api/profiles/image',
            {
              method: 'POST',
              body: formData,
            }
          )
          const imageData = await imageRes.json()
          if (!imageRes.ok) {
            throw new Error('이미지 업로드 실패')
          }
          profileImageId = imageData.id
        } catch (error) {
          console.error('이미지 업로드 중 오류:', error)
          showToast('이미지 업로드 중 오류가 발생했습니다.', 'error')
          return // 이미지 업로드 실패 시 프로필 생성 중단
        }
      }

      // 2. 프로필 생성
      const profilePayload: any = {
        nickname: registerData.nickname,
        department: registerData.department,
        entranceTime: Number(registerData.admissionYear),
        graduation: false,
      }
      if (profileImageId !== undefined) {
        profilePayload.profileImageId = profileImageId
      }
      profileMutation.mutate(profilePayload)
    }
  }

  const goToPrevStep = () => {
    const stepOrder: RegisterStep[] = [
      'DEPARTMENT_AND_ADMISSION',
      'NICKNAME_AND_PROFILE',
      'INITIAL_CATEGORY_SETTING',
      'FINAL_CONFIRMATION',
    ]

    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1])
    }
  }

  // 회원 상태에 따른 시작 화면 설정
  useEffect(() => {
    switch (userStatus) {
      case 'NEW':
        // 로컬 스토리지에 저장된 단계가 없으면 처음 단계로 설정
        if (!localStorage.getItem(REGISTER_STEP_KEY)) {
          setCurrentStep('DEPARTMENT_AND_ADMISSION')
        } else {
          setCurrentStep(
            localStorage.getItem(REGISTER_STEP_KEY) as RegisterStep
          )
        }
        break
      case 'REVISITING':
        // 홈화면으로 보내
        break
      default:
        if (!localStorage.getItem(REGISTER_STEP_KEY)) {
          setCurrentStep('DEPARTMENT_AND_ADMISSION')
        }
    }
  }, [userStatus])

  // 페이지를 새로고침하거나 다른 페이지에서 돌아왔을 때 데이터와 단계 복원
  useEffect(() => {
    // 개인정보 동의서 페이지에서 돌아왔을 때 처리
    if (location.state && location.state.fromPrivacy) {
      // 이미 로컬 스토리지에서 불러왔기 때문에 여기서는 추가 처리가 필요없음
    }
  }, [location])

  // 현재 단계에 따른 컴포넌트 렌더링 (이전 데이터 전달)
  const renderStep = () => {
    switch (currentStep) {
      case 'DEPARTMENT_AND_ADMISSION':
        return (
          <DepartmentAndAdmission
            goToNextStep={goToNextStep}
            initialData={registerData}
          />
        )
      case 'NICKNAME_AND_PROFILE':
        return (
          <NickNameAndProfile
            goToNextStep={goToNextStep}
            initialData={registerData}
          />
        )
      case 'INITIAL_CATEGORY_SETTING':
        return (
          <InitialCategorySetting
            goToNextStep={goToNextStep}
            initialData={registerData}
          />
        )
      case 'FINAL_CONFIRMATION':
        return (
          <FinalConfirmation
            goToNextStep={goToNextStep}
            initialData={registerData}
          />
        )
    }
  }

  return (
    <RootContainer>
      <RegisterContainer>
        <RegisterNavBar>
          <BackIcon onClick={goToPrevStep} />
          <StepIndicator currentStep={currentStep} />
        </RegisterNavBar>

        <RegisterStepContainer>{renderStep()}</RegisterStepContainer>
      </RegisterContainer>
    </RootContainer>
  )
}

export default Register
