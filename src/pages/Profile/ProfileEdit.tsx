/** @jsxImportSource @emotion/react */
import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import InitialProfileImageSetting from '../../components/mypage/InitialProfileImageSetting'
import TitleInputBox from '../../components/inputs/titleInputBox'
import TitleSelectBox from '../../components/inputs/titleSelectBox'
import TopBar from '../../components/topbar/Topbar'
import { useToast } from '../../components/toast/ToastProvider'
import {
  RootContainer,
  MainContainer,
  ProfileImageContainer,
  ProfileInfoContainer,
} from './ProfileEditStyles'
import { fetchWithRefresh } from '../../utils/fetchWithRefresh'
import { getKoreanErrorMessage } from '../../utils/errorMessageUtils'

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
  const [originalNickName, setOriginalNickName] = useState('') // 원래 닉네임 저장
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

  // 검증 상태
  const [isFileSizeValid, setIsFileSizeValid] = useState(true) // 파일 크기 검증 상태
  const [isNicknameValid, setIsNicknameValid] = useState(true) // 닉네임 중복 검증 상태
  const [isCheckingNickname, setIsCheckingNickname] = useState(false) // 닉네임 체크 중

  const { showToast } = useToast()

  const defaultProfileImageUrl =
    'https://mindmate.shop/api/profileImages/default-profile-image.png'
  const realProfileImageUrl = profileImagePreview

  // 액션 버튼 활성화 여부 계산
  const isActionEnabled =
    isFileSizeValid && isNicknameValid && !isCheckingNickname

  // 내 프로필 정보 불러오기
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      try {
        const res = await fetchWithRefresh(
          'https://mindmate.shop/api/profiles',
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        )
        const data = await res.json()
        setUserNickName(data.nickname || '')
        setOriginalNickName(data.nickname || '') // 원래 닉네임 저장
        setSelectedDepartment(data.department || '')
        setSelectedYear(data.entranceTime ? String(data.entranceTime) : '')
        setProfileImagePreview(
          'https://mindmate.shop/api' + data.profileImage || undefined
        )
        setProfileImageUrl(data.profileImage || undefined)
        setProfileImageId(data.profileImageId)
      } catch (error) {
        const koreanMessage = getKoreanErrorMessage(error, 'general')
        showToast(koreanMessage, 'error')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  useEffect(() => {
    setIsImageLoaded(false)
  }, [realProfileImageUrl])

  // 닉네임 변경 시 중복 체크
  useEffect(() => {
    const checkNickname = async () => {
      // 원래 닉네임과 같으면 유효한 것으로 처리
      if (userNickName === originalNickName) {
        setIsNicknameValid(true)
        return
      }

      // 닉네임이 비어있으면 무효
      if (!userNickName.trim()) {
        setIsNicknameValid(false)
        return
      }

      setIsCheckingNickname(true)
      try {
        const res = await fetchWithRefresh(
          `https://mindmate.shop/api/auth/check-nickname?nickname=${encodeURIComponent(userNickName)}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        )
        const data = await res.json()
        setIsNicknameValid(!data.exists) // exists가 false면 사용 가능

        if (data.exists) {
          showToast('이미 사용 중인 닉네임입니다.', 'error')
        }
      } catch (error) {
        console.error('닉네임 중복 체크 오류:', error)
        setIsNicknameValid(false)
      } finally {
        setIsCheckingNickname(false)
      }
    }

    // 디바운싱: 500ms 후에 체크
    const timeoutId = setTimeout(checkNickname, 500)
    return () => clearTimeout(timeoutId)
  }, [userNickName, originalNickName])

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
    // 파일 크기 검증 (1MB = 1024 * 1024 bytes)
    const maxSize = 1024 * 1024 // 1MB
    if (file.size > maxSize) {
      setIsFileSizeValid(false)
      showToast(
        '사진의 용량이 너무 큽니다.\n1MB 이하의 이미지를 선택해주세요.',
        'error'
      )
      return
    }

    setIsFileSizeValid(true)
    setProfileImageFile(file)
    setProfileImagePreview(URL.createObjectURL(file))
  }

  const handleBackClick = () => {
    try {
      console.log('ProfileEdit: 뒤로가기 버튼 클릭됨')

      // 메모리 정리
      if (profileImagePreview && profileImageFile) {
        URL.revokeObjectURL(profileImagePreview)
      }

      // 안전한 네비게이션
      navigate('/mypage', { replace: false })
    } catch (error) {
      //console.error('ProfileEdit: 뒤로가기 중 오류 발생:', error)
      // 오류 발생 시 강제로 마이페이지로 이동
      window.location.href = '/mypage'
    }
  }

  // 완료 버튼 클릭 시
  const handleSave = async () => {
    // 버튼이 비활성화되어 있으면 실행하지 않음
    if (!isActionEnabled) {
      return
    }

    try {
      let newProfileImageId = profileImageId

      // 새로운 이미지가 있는 경우 업로드
      if (profileImageFile) {
        try {
          const formData = new FormData()
          formData.append('file', profileImageFile)
          const imageRes = await fetchWithRefresh(
            'https://mindmate.shop/api/profiles/image',
            {
              method: 'POST',
              body: formData,
            }
          )

          if (!imageRes.ok) {
            const errorData = await imageRes.json()
            const koreanMessage = getKoreanErrorMessage(errorData, 'upload')
            showToast(koreanMessage, 'error')
            return
          }

          const imageData = await imageRes.json()
          newProfileImageId = imageData.id
        } catch (error) {
          const koreanMessage = getKoreanErrorMessage(error, 'upload')
          showToast(koreanMessage, 'error')
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

      const res = await fetchWithRefresh('https://mindmate.shop/api/profiles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        showToast('프로필이 성공적으로 업데이트되었습니다.', 'success')
        setTimeout(() => {
          navigate('/mypage')
        }, 1000)
      } else {
        const errorData = await res.json()

        // DUPLICATE_NICKNAME 에러 처리
        if (errorData.error === 'DUPLICATE_NICKNAME') {
          setIsNicknameValid(false)
          showToast(
            '이미 사용 중인 닉네임입니다. \n다른 닉네임을 선택해주세요.',
            'error'
          )
        } else {
          const koreanMessage = getKoreanErrorMessage(errorData, 'general')
          showToast(koreanMessage, 'error')
        }
      }
    } catch (error) {
      const koreanMessage = getKoreanErrorMessage(error, 'general')
      showToast(koreanMessage, 'error')
    }
  }

  if (loading) return <div></div>

  return (
    <div>
      <RootContainer>
        <TopBar
          title="프로필 편집"
          showBackButton={true}
          onBackClick={() => {
            handleBackClick()
          }}
          actionText="완료"
          onActionClick={handleSave}
          isActionDisabled={!isActionEnabled} // 액션 버튼 비활성화
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
    </div>
  )
}

export default ProfileEdit
