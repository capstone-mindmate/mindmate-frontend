/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  RootContainer,
  MainContainer,
  WithdrawTitle,
  SectionTitle,
  SectionDescription,
  CheckboxWrapper,
  CheckboxInput,
  CheckboxLabel,
  ReasonSection,
  ReasonSubtitle,
  TextArea,
  WithdrawButton,
} from './WithdrawStyles'

import TopBar from '../../components/topbar/Topbar'

const reasons = [
  '마인드메이트에서 제공하는 서비스가 마음에 들지 않음',
  '자주 사용하지 않음',
  '앱 사용 방식이 어려움',
  '잦은 오류와 장애가 발생함',
  '기타',
]

const WithdrawMindMate = () => {
  const navigate = useNavigate()
  const [agreeWithdraw, setAgreeWithdraw] = useState(false)
  const [selectedReasons, setSelectedReasons] = useState<number[]>([])
  const [otherReason, setOtherReason] = useState('')
  const [showOtherInput, setShowOtherInput] = useState(false)

  const isButtonActive = agreeWithdraw && selectedReasons.length > 0

  const handleReasonChange = (index: number) => {
    setSelectedReasons((prev) => {
      if (prev.includes(index)) {
        const newReasons = prev.filter((item) => item !== index)
        if (index === 4) setShowOtherInput(false)
        return newReasons
      } else {
        const newReasons = [...prev, index]

        if (index === 4) setShowOtherInput(true)
        return newReasons
      }
    })
  }

  const handleWithdraw = () => {
    if (!isButtonActive) return

    // 여기에 실제 탈퇴 API 호출
    console.log('탈퇴 처리', {
      agreeWithdraw,
      selectedReasons: selectedReasons.map((index) => reasons[index]),
      otherReason: showOtherInput ? otherReason : '',
    })

    // 탈퇴 보내고 온보딩으로 보내기
    alert('회원 탈퇴가 완료되었습니다.')
    localStorage.removeItem('user')
    navigate('/onboarding')
  }

  return (
    <RootContainer>
      <TopBar
        title="회원탈퇴"
        showBackButton={true}
        onBackClick={() => navigate('/profile/setting')}
      />
      <MainContainer>
        <WithdrawTitle>
          정말 마인드메이트를 탈퇴하고 싶으신가요? 😢
        </WithdrawTitle>

        <SectionTitle>회원 탈퇴 처리 내용</SectionTitle>
        <SectionDescription>
          탈퇴이후 개인정보 처리 방침에 따라 최대 30일 이내에 '이용 기간의 모든
          개인정보 및 개설 정보가 삭제됩니다. 이후에는 "사용자닉네임"님의 활동
          데이터는 다시 복구될 수 없습니다.
        </SectionDescription>

        <CheckboxWrapper>
          <CheckboxInput
            type="checkbox"
            id="agreeWithdraw"
            checked={agreeWithdraw}
            onChange={() => setAgreeWithdraw(!agreeWithdraw)}
          />
          <CheckboxLabel htmlFor="agreeWithdraw">
            회원 탈퇴 처리 내용에 동의합니다.
          </CheckboxLabel>
        </CheckboxWrapper>

        <ReasonSection>
          <SectionTitle>
            마인드메이트 서비스를 그만 사용하는 이유를 알려주세요!
          </SectionTitle>
          <ReasonSubtitle>이후 더 나은 서비스로 찾아뵙겠습니다.</ReasonSubtitle>

          {reasons.map((reason, index) => (
            <CheckboxWrapper key={index}>
              <CheckboxInput
                type="checkbox"
                id={`reason-${index}`}
                checked={selectedReasons.includes(index)}
                onChange={() => handleReasonChange(index)}
              />
              <CheckboxLabel htmlFor={`reason-${index}`}>
                {reason}
              </CheckboxLabel>
            </CheckboxWrapper>
          ))}

          {showOtherInput && (
            <TextArea
              placeholder="계정을 삭제하려는 이유를 알려주세요."
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
            />
          )}
        </ReasonSection>

        <WithdrawButton
          isActive={isButtonActive}
          onClick={handleWithdraw}
          disabled={!isButtonActive}
        >
          탈퇴하기
        </WithdrawButton>
      </MainContainer>
    </RootContainer>
  )
}

export default WithdrawMindMate
