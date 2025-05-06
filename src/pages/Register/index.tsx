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

// File을 base64로 변환하는 함수
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const Register = () => {
  const location = useLocation()
  const navigate = useNavigate()

  // 로컬 스토리지에서 이전 데이터 불러오기
  const getInitialStep = (): RegisterStep => {
    const savedStep = localStorage.getItem(REGISTER_STEP_KEY)
    return (savedStep as RegisterStep) || 'DEPARTMENT_AND_ADMISSION'
  }

  const getInitialData = () => {
    const savedData = localStorage.getItem(REGISTER_DATA_KEY)
    return savedData ? JSON.parse(savedData) : {}
  }

  const [currentStep, setCurrentStep] = useState<RegisterStep>(getInitialStep())
  // 사용자 상태 확인 신규인지 재방문 인지 <- 백이랑 얘기
  const [userStatus, setUserStatus] = useState<UserStatus>('NEW')

  // 회원가입 데이터 상태 관리
  const [registerData, setRegisterData] = useState(getInitialData())

  // 데이터나 단계가 변경될 때 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem(REGISTER_DATA_KEY, JSON.stringify(registerData))
  }, [registerData])

  useEffect(() => {
    localStorage.setItem(REGISTER_STEP_KEY, currentStep)
  }, [currentStep])

  // 프로필 생성 mutation
  const profileMutation = useMutation({
    mutationFn: async (profileData: any) => {
      const res = await fetch('http://localhost/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(profileData),
      }).then((res) => res.json())
      console.log(res)
      if (!res.ok) throw new Error('프로필 생성 실패')
      return res
    },
    onSuccess: () => {
      navigate('/home')
    },
    onError: (e) => {
      alert('프로필 생성에 실패했습니다.')
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
      // 이미지가 File 객체라면 base64로 변환해서 저장
      if (data && data.profileImage instanceof File) {
        const base64 = await fileToBase64(data.profileImage)
        updatedData.profileImage = base64
      }
      setRegisterData(updatedData)
      localStorage.setItem(REGISTER_DATA_KEY, JSON.stringify(updatedData))
      setCurrentStep(stepOrder[currentIndex + 1])
    } else if (currentStep === 'FINAL_CONFIRMATION') {
      // 마지막 단계에서 프로필 생성 API 호출
      const profilePayload = {
        nickname: registerData.nickname,
        profileImage: registerData.profileImage || '', // base64 문자열
        department: registerData.department,
        entranceTime: Number(registerData.admissionYear),
        graduation: false, // 기본값, 필요시 수정
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
