/** @jsxImportSource @emotion/react */
import {
  RegisterContainer,
  RegisterTitle,
  RegisterTitleContainer,
  RegisterInputContainer,
} from './styles/InitialStyles'
import TitleInputBox from '../../../components/inputs/titleInputBox'

const handleInputChange = (value: string) => {}

const DepartmentAndAdmission = () => {
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
        <TitleInputBox
          placeholder="학과를 선택해주세요"
          onChange={handleInputChange}
          titleText="학과"
        />
        <TitleInputBox
          placeholder="입학년도를 선택해주세요"
          onChange={handleInputChange}
          titleText="입학년도"
        />
      </RegisterInputContainer>
    </RegisterContainer>
  )
}

export default DepartmentAndAdmission
