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
import { fetchWithRefresh } from '../../utils/fetchWithRefresh'

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
  const [profileImageFile, setProfileImageFile] = useState<File | undefined>(
    undefined
  )
  const [profileImagePreview, setProfileImagePreview] = useState<
    string | undefined
  >(undefined)
  const [profileImageId, setProfileImageId] = useState<number | undefined>(
    undefined
  )
  const [profileImageUrl, setProfileImageUrl] = useState<string | undefined>(
    undefined
  )
  const [loading, setLoading] = useState(true)
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  const defaultProfileImageUrl =
    'http://localhost/api/profileImages/default-profile-image.png'
  const realProfileImageUrl = profileImagePreview

  // 내 프로필 정보 불러오기
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      try {
        const res = await fetchWithRefresh('http://localhost/api/profiles', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        const data = await res.json()
        setUserNickName(data.nickname || '')
        setSelectedDepartment(data.department || '')
        setSelectedYear(data.entranceTime ? String(data.entranceTime) : '')
        setProfileImagePreview(
          'http://localhost/api' + data.profileImage || undefined
        )
        setProfileImageUrl(data.profileImage || undefined)
        setProfileImageId(data.profileImageId)
      } catch (e) {
        // 에러 처리
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  useEffect(() => {
    setIsImageLoaded(false)
  }, [realProfileImageUrl])

  const handleNickNameChange = (value: string) => {
    setUserNickName(value)
  }

  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value)
  }

  const handleYearChange = (value: string) => {
    setSelectedYear(value)
  }

  // 이미지 변경 핸들러
  const handleImageChange = (file: File) => {
    setProfileImageFile(file)
    setProfileImagePreview(URL.createObjectURL(file))
  }

  // 완료 버튼 클릭 시
  const handleSave = async () => {
    let newProfileImageId = profileImageId
    if (profileImageFile) {
      try {
        // 1. 현재 프로필 이미지 id 조회
        // const currentImgRes = await fetchWithRefresh('http://localhost/api/profiles/image/current', {
        //   method: 'GET',
        //   headers: { 'Content-Type': 'application/json' },
        // })
        // const currentImgData = await currentImgRes.json()
        // if (currentImgRes.ok && currentImgData.id) {
        //   // 2. 기존 이미지 삭제
        //   await fetchWithRefresh(`http://localhost/api/profiles/image/${currentImgData.id}`, {
        //     method: 'DELETE',
        //     headers: { 'Content-Type': 'application/json' },
        //   })
        // }
        // 3. 새 이미지 업로드
        const formData = new FormData()
        formData.append('file', profileImageFile)
        const imageRes = await fetchWithRefresh(
          'http://localhost/api/profiles/image',
          {
            method: 'POST',
            body: formData,
          }
        )
        const imageData = await imageRes.json()
        if (!imageRes.ok) {
          alert('이미지 업로드 실패')
          return
        }
        newProfileImageId = imageData.id
      } catch (e) {
        alert('프로필 이미지 처리 중 오류가 발생했습니다.')
        return
      }
    }
    // 프로필 정보 업데이트
    const payload: any = {
      nickname: userNickName,
      department: selectedDepartment,
      entranceTime: Number(selectedYear),
      graduation: false,
    }
    if (newProfileImageId !== undefined) {
      payload.profileImageId = newProfileImageId
    }
    const res = await fetchWithRefresh('http://localhost/api/profiles', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      navigate('/mypage')
    } else {
      alert('프로필 업데이트 실패')
    }
  }

  if (loading) return <div></div>

  return (
    <RootContainer>
      <TopBar
        title="프로필 편집"
        showBackButton={true}
        onBackClick={() => navigate('/mypage')}
        actionText="완료"
        onActionClick={handleSave}
      />
      <MainContainer>
        <ProfileImageContainer>
          {realProfileImageUrl && !isImageLoaded && (
            <img
              src={realProfileImageUrl}
              alt=""
              style={{ display: 'none' }}
              onLoad={() => setIsImageLoaded(true)}
              onError={() => setIsImageLoaded(true)}
            />
          )}
          <InitialProfileImageSetting
            onImageChange={handleImageChange}
            initialImage={
              isImageLoaded ? realProfileImageUrl : defaultProfileImageUrl
            }
            onImageLoad={() => setIsImageLoaded(true)}
          />
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
