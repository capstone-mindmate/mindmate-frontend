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

const DepartmentAndAdmission = () => {
  const [isEnabled, setIsEnabled] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [selectedYear, setSelectedYear] = useState('')

  useEffect(() => {
    setIsEnabled(selectedDepartment !== '' && selectedYear !== '')
  }, [selectedDepartment, selectedYear])

  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value)
  }

  const handleYearChange = (value: string) => {
    setSelectedYear(value)
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
          options={['학과1', '학과2', '학과3']}
        />
        <TitleSelectBox
          placeholder="입학년도를 선택해주세요"
          onChange={handleYearChange}
          titleText="입학년도"
          options={['2020', '2021', '2022']}
        />
      </RegisterInputContainer>

      <RegisterConfirmButtonContainer>
        <BrownRectButton
          isEnabled={isEnabled}
          buttonText="다음"
          onActiveChange={() => {}}
        />
      </RegisterConfirmButtonContainer>
    </RegisterContainer>
  )
}

export default DepartmentAndAdmission
