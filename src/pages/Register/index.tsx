/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react'
import DepartmentAndAdmission from './steps/DepartmentAndAdmission'
import NickNameAndProfile from './steps/NickNameAndProfile'
import InitialCategorySetting from './steps/InitialCategorySetting'
import {
  RegisterContainer,
  RegisterStepContainer,
  StepIndicatorContainer,
  StepDot,
  RegisterNavBar,
  RootContainer,
} from './style'
import { BackIcon } from '../../components/icon/iconComponents'

// 회원 상태 타입 신규(NEW) 재방문(REVISITING)
type UserStatus = 'NEW' | 'REVISITING'

type RegisterStep =
  | 'DEPARTMENT_AND_ADMISSION'
  | 'NICKNAME_AND_PROFILE'
  | 'INITIAL_CATEGORY_SETTING'

const StepIndicator = ({ currentStep }: { currentStep: RegisterStep }) => {
  const steps: RegisterStep[] = [
    'DEPARTMENT_AND_ADMISSION',
    'NICKNAME_AND_PROFILE',
    'INITIAL_CATEGORY_SETTING',
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
  const [currentStep, setCurrentStep] = useState<RegisterStep>(
    'DEPARTMENT_AND_ADMISSION'
  )
  // 사용자 상태 확인 신규인지 재방문 인지 <- 백이랑 얘기
  const [userStatus, setUserStatus] = useState<UserStatus>('NEW')

  // 회원가입 데이터 상태 관리
  const [registerData, setRegisterData] = useState({
    // 추가하기
  })

  // 다음 단계로 이동하는 함수
  const goToNextStep = (data?: any) => {
    const stepOrder: RegisterStep[] = [
      'DEPARTMENT_AND_ADMISSION',
      'NICKNAME_AND_PROFILE',
      'INITIAL_CATEGORY_SETTING',
    ]

    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex < stepOrder.length - 1) {
      // 데이터가 있으면 상태 업데이트
      if (data) {
        setRegisterData((prev) => ({ ...prev, ...data }))
      }
      setCurrentStep(stepOrder[currentIndex + 1])
    }
  }

  const goToPrevStep = () => {
    const stepOrder: RegisterStep[] = [
      'DEPARTMENT_AND_ADMISSION',
      'NICKNAME_AND_PROFILE',
      'INITIAL_CATEGORY_SETTING',
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
        setCurrentStep('DEPARTMENT_AND_ADMISSION')
        break
      case 'REVISITING':
        // 홈화면으로 보내
        break
      default:
        setCurrentStep('DEPARTMENT_AND_ADMISSION')
    }
  }, [userStatus])

  // 현재 단계에 따른 컴포넌트 렌더링
  const renderStep = () => {
    switch (currentStep) {
      case 'DEPARTMENT_AND_ADMISSION':
        return <DepartmentAndAdmission goToNextStep={goToNextStep} />
      case 'NICKNAME_AND_PROFILE':
        return <NickNameAndProfile goToNextStep={goToNextStep} />
      case 'INITIAL_CATEGORY_SETTING':
        return <InitialCategorySetting goToNextStep={goToNextStep} />
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
