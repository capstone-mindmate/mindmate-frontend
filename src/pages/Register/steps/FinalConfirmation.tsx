/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import {
  RegisterContainer,
  RegisterTitle,
  RegisterTitleContainer,
  RegisterInputContainer,
  RegisterConfirmButtonContainer,
  RegisterSubTitle,
  RegisterAgreementContainer,
} from './styles/InitialStyles'
import BrownRectButton from '../../../components/buttons/brownRectButton'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface FinalConfirmationProps {
  goToNextStep: (data?: any) => void
  initialData?: any
}

// 체크 아이콘 컴포넌트
const CheckIcon = ({
  isChecked,
  color,
}: {
  isChecked: boolean
  color: string
}) => (
  <div
    css={css`
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background-color: ${isChecked ? color : '#ffffff'};
      border: 1px solid ${isChecked ? color : '#D9D9D9'};
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all 0.2s ease;
    `}
  >
    {isChecked && (
      <svg
        width="14"
        height="10"
        viewBox="0 0 14 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1 5L5 9L13 1"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )}
  </div>
)

const styles = {
  agreementItemStyle: css`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 0;
    cursor: pointer;
  `,
  agreementTextStyle: css`
    font-size: 16px;
    font-weight: medium;
    line-height: 1.5;
    color: #000000;
    user-select: none;
  `,
  agreementDetailStyle: css`
    margin-left: auto;
    font-size: 14px;
    color: #a3a3a3;
    display: flex;
    align-items: center;
    cursor: pointer;
  `,
}

const FinalConfirmation = ({
  goToNextStep,
  initialData = {},
}: FinalConfirmationProps) => {
  // 초기값 설정 (이전에 동의한 경우 유지)
  const [isAllAgreed, setIsAllAgreed] = useState(
    initialData.personalInfoAgreed || false
  )
  const [agreements, setAgreements] = useState({
    personal: initialData.personalInfoAgreed || false,
  })
  const [isEnabled, setIsEnabled] = useState(isAllAgreed)
  const navigate = useNavigate()

  // 모든 동의 항목이 체크되었는지 확인
  useEffect(() => {
    setIsAllAgreed(agreements.personal)
  }, [agreements])

  // 버튼 활성화 상태 설정
  useEffect(() => {
    setIsEnabled(isAllAgreed)
  }, [isAllAgreed])

  const handleNextStep = () => {
    if (isEnabled) {
      goToNextStep({
        personalInfoAgreed: agreements.personal,
      })
    }
  }

  const toggleAgreement = (key: keyof typeof agreements) => {
    setAgreements((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  // 개인정보 약관 페이지로 이동 (현재 상태 저장)
  const goToPrivacyPage = (e: React.MouseEvent) => {
    e.stopPropagation() // 체크박스 클릭 이벤트 전파 방지
    navigate('/register/privacy', {
      state: { fromRegister: true },
    })
  }

  return (
    <RegisterContainer>
      <RegisterTitleContainer>
        <RegisterTitle>
          가입을 위해
          <br />
          약관에 동의해주세요
        </RegisterTitle>
        <RegisterSubTitle>
          편리한 이용을 위해 다음 약관에 동의가 필요해요
        </RegisterSubTitle>
      </RegisterTitleContainer>

      <RegisterInputContainer>
        <RegisterAgreementContainer>
          <div
            onClick={() => toggleAgreement('personal')}
            css={styles.agreementItemStyle}
          >
            <CheckIcon isChecked={agreements.personal} color="#1B5BFE" />
            <span css={styles.agreementTextStyle}>
              개인정보 수집 및 이용 동의(필수)
            </span>
            <div css={styles.agreementDetailStyle} onClick={goToPrivacyPage}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 18L15 12L9 6"
                  stroke="#A3A3A3"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </RegisterAgreementContainer>
      </RegisterInputContainer>

      <RegisterConfirmButtonContainer>
        <BrownRectButton
          isEnabled={isEnabled}
          buttonText="회원가입"
          onActiveChange={handleNextStep}
        />
      </RegisterConfirmButtonContainer>
    </RegisterContainer>
  )
}

export default FinalConfirmation
