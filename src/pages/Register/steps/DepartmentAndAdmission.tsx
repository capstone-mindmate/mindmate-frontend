/** @jsxImportSource @emotion/react */
import {
  RegisterContainer,
  RegisterTitle,
  RegisterTitleContainer,
  RegisterInputContainer,
  RegisterConfirmButtonContainer,
} from './styles/InitialStyles'
import TitleSelectBox from '../../../components/inputs/titleSelectBox'
import BrownRectButton from '../../../components/buttons/brownRectButton'
import { useState, useEffect } from 'react'

interface DepartmentAndAdmissionProps {
  goToNextStep: (data?: any) => void
  initialData?: any
}

const departmentOptions = [
  '기계공학과',
  '산업공학과',
  '화학공학과',
  '환경안전공학과',
  '건설시스템공학과',
  '교통시스템공학과',
  '건축학과',
  'AI모빌리티학과',
  '첨단신소재공학과',
  '응용화학생명공학과',
  '전자공학과',
  '지능형반도체공학과',
  '소프트웨어학과',
  '사이버보안학과',
  '소프트웨어융합학과',
  '국방디지털융합학과',
  '디지털미디어학과',
  '수학과',
  '물리학과',
  '화학과',
  '생명과학과',
  '국어국문학과',
  '영어영문학과',
  '불어불문학과',
  '사학과',
  '문화콘텐츠학과',
  '경제학과',
  '심리학과',
  '사회학과',
  '정치외교학과',
  '행정학과',
  '경영학과',
  'e-비즈니스학과',
  '금융공학과',
  '법학과',
  '의학과',
  '간호학과',
  '약학과',
  '바이오헬스규제과학과',
  '프런티어과학학부',
  '경제정치사회융합학부',
  '다산학부대학',
  '자유전공학부',
  '국제학부',
]

const DepartmentAndAdmission = ({
  goToNextStep,
  initialData = {},
}: DepartmentAndAdmissionProps) => {
  const [isEnabled, setIsEnabled] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState(
    initialData.department || ''
  )
  const [selectedYear, setSelectedYear] = useState(
    initialData.admissionYear || ''
  )

  useEffect(() => {
    setIsEnabled(selectedDepartment !== '' && selectedYear !== '')
  }, [selectedDepartment, selectedYear])

  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value)
  }

  const handleYearChange = (value: string) => {
    setSelectedYear(value)
  }

  const handleNextStep = () => {
    if (isEnabled) {
      goToNextStep({
        department: selectedDepartment,
        admissionYear: selectedYear,
      })
    }
  }

  return (
    <RegisterContainer>
      <RegisterTitleContainer>
        <RegisterTitle>
          학과와
          <br />
          입학년도를 선택해주세요
        </RegisterTitle>
      </RegisterTitleContainer>

      <RegisterInputContainer>
        <TitleSelectBox
          placeholder="학과를 선택해주세요"
          onChange={handleDepartmentChange}
          titleText="학과"
          options={departmentOptions}
          initialValue={selectedDepartment}
        />
        <TitleSelectBox
          placeholder="입학년도를 선택해주세요"
          onChange={handleYearChange}
          titleText="입학년도"
          options={Array.from(
            { length: new Date().getFullYear() - 2001 + 1 },
            (_, i) => 2001 + i
          ).map((year) => year.toString())}
          initialValue={selectedYear}
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

export default DepartmentAndAdmission
