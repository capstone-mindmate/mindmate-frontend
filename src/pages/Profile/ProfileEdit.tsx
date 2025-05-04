/** @jsxImportSource @emotion/react */
import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import InitialProfileImageSetting from '../../components/mypage/InitialProfileImageSetting'
import TitleInputBox from '../../components/inputs/titleInputBox'
import TitleSelectBox from '../../components/inputs/titleSelectBox'
import TopBar from '../../components/topbar/Topbar'
import {
  RootContainer,
  MainContainer,
  ProfileImageContainer,
  ProfileInfoContainer,
} from './ProfileEditStyles'

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

interface ProfileEditProps {}

const ProfileEdit = ({}: ProfileEditProps) => {
  const navigate = useNavigate()
  const [userNickName, setUserNickName] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [selectedYear, setSelectedYear] = useState('')

  const handleNickNameChange = (value: string) => {
    setUserNickName(value)
  }

  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value)
  }

  const handleYearChange = (value: string) => {
    setSelectedYear(value)
  }

  return (
    <RootContainer>
      <TopBar
        title="프로필 편집"
        showBackButton={true}
        onBackClick={() => navigate('/mypage')}
        actionText="완료"
        onActionClick={() => {}}
      />
      <MainContainer>
        <ProfileImageContainer>
          <InitialProfileImageSetting />
        </ProfileImageContainer>

        <ProfileInfoContainer>
          <TitleInputBox
            placeholder="닉네임을 입력해주세요"
            onChange={handleNickNameChange}
            titleText="닉네임"
            initialValue={userNickName}
          />

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
        </ProfileInfoContainer>
      </MainContainer>
    </RootContainer>
  )
}

export default ProfileEdit
