import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import TopBar from '../../components/topbar/Topbar'
import { StarIcon } from '../../components/icon/iconComponents'
import {
  MagazineDetailContainer,
  CoverImage,
  TitleOverlay,
  MagazineTitle,
  MagazineSubtitle,
  ContentContainer,
  MagazineContent,
  AuthorProfileContainer,
  AuthorProfileImage,
  AuthorProfileInfo,
  NameRow,
  AuthorProfileName,
  AuthorProfileDepartment,
  AuthorDate,
  AuthorProfileArrow,
  BottomToolbar,
  ToolbarButton,
  LikeCount,
  AnimatedButtonWrapper,
} from './styles/MagazineStyles'
import { fetchWithRefresh } from '../../utils/fetchWithRefresh'
import { categoryNames } from './magazinedata'

// API 응답 데이터 타입 정의
interface MagazineContent {
  id: number
  type: string
  text: string | null
  imageUrl: string | null
  emoticonUrl: string | null
  emoticonName: string | null
  contentOrder: number
}

interface MagazineData {
  id: number
  title: string
  subtitle: string
  contents: MagazineContent[]
  authorName: string
  authorId: number
  authorImageUrl: string // authorProfileImage에서 변경
  authorDepartment: string
  likeCount: number
  status: string
  category: string
  createdAt: string
  updatedAt: string
  author: boolean
  liked: boolean
}

// 좋아요 응답 타입
interface LikeResponse {
  liked: boolean
  likeCount: number
}

// 활동 정보 기록을 위한 인터페이스 추가
interface EngagementData {
  dwellTime: number // 체류 시간(초)
  scrollPercentage: number // 스크롤 퍼센트(0-100)
}

const Magazine: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [magazine, setMagazine] = useState<MagazineData | null>(null)
  const [featuredImage, setFeaturedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true) // 초기 로딩 상태를 true로 설정
  const [error, setError] = useState<string | null>(null)

  // 좋아요 처리 관련 상태 분리
  const [isLiked, setIsLiked] = useState<boolean>(false)
  const [likeCount, setLikeCount] = useState<number>(0)
  const [isLikeProcessing, setIsLikeProcessing] = useState<boolean>(false)

  // 활동 정보 기록을 위한 상태 및 ref 추가
  const contentRef = useRef<HTMLDivElement>(null)
  const startTimeRef = useRef<number>(Date.now())
  const [maxScrollPercentage, setMaxScrollPercentage] = useState<number>(0)
  const isEngagementSentRef = useRef<boolean>(false) // 활동 정보 전송 여부 추적

  // 스크롤 퍼센테이지 계산 함수 수정
  const calculateScrollPercentage = () => {
    if (!contentRef.current) return 0

    const element = contentRef.current
    const scrollTop = element.scrollTop
    const scrollHeight = element.scrollHeight
    const clientHeight = element.clientHeight

    // 스크롤 가능한 총 높이
    const scrollableHeight = scrollHeight - clientHeight

    // 스크롤이 불가능한 경우 (내용이 화면보다 작은 경우)
    if (scrollableHeight <= 0) return 0

    // 현재 스크롤 위치 / 스크롤 가능한 총 높이
    const percentage = Math.round((scrollTop / scrollableHeight) * 100)

    // 끝까지 스크롤한 경우 100%로 처리 (10px의 여유 추가)
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      return 100
    }

    return percentage
  }

  // 활동 정보 전송 함수
  const sendEngagementData = async () => {
    // 이미 전송했거나 매거진 ID가 없는 경우 무시
    if (isEngagementSentRef.current || !id || !magazine) return

    // 체류 시간 계산 (초 단위)
    const endTime = Date.now()
    const dwellTimeSeconds = Math.floor((endTime - startTimeRef.current) / 1000)

    // 최소 체류 시간 (10초) 이하면 전송하지 않음
    if (dwellTimeSeconds < 5) return

    // 스크롤 퍼센테이지 최종 계산
    let finalScrollPercentage = maxScrollPercentage

    // ContentRef가 있다면 최종 스크롤 위치를 다시 한번 계산
    if (contentRef.current) {
      const currentPercentage = calculateScrollPercentage()
      finalScrollPercentage = Math.max(maxScrollPercentage, currentPercentage)
    }

    try {
      isEngagementSentRef.current = true // 중복 전송 방지

      const engagementData: EngagementData = {
        dwellTime: dwellTimeSeconds,
        scrollPercentage: finalScrollPercentage,
      }

      // 활동 정보 전송
      console.log('활동 정보 전송:', engagementData)

      // fetchWithRefresh 사용하여 활동 정보 전송 API 호출
      const response = await fetchWithRefresh(
        `http://localhost/api/magazines/${id}/engagement`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(engagementData),
        }
      )

      if (!response.ok) {
        throw new Error(`활동 정보 전송 실패: ${response.status}`)
      }

      // JSON 파싱 오류 처리 부분
      try {
        const responseText = await response.text()
        // 응답이 비어 있지 않은 경우에만 JSON 파싱
        if (responseText && responseText.trim()) {
          JSON.parse(responseText)
        }
      } catch (parseError) {
        // 파싱 오류가 발생해도 성공으로 처리 (서버에는 저장됨)
      }
    } catch (error) {
      // 에러 발생해도 사용자 경험에 영향 없도록 조용히 처리
    }
  }

  useEffect(() => {
    const fetchMagazine = async () => {
      try {
        setIsLoading(true)

        // fetchWithRefresh 사용하여 매거진 데이터 가져오기
        const response = await fetchWithRefresh(
          `http://localhost/api/magazines/${id}`
        )

        if (!response.ok) {
          throw new Error(
            `API 호출 실패: ${response.status} ${response.statusText}`
          )
        }

        const data: MagazineData = await response.json()

        setMagazine(data)

        // 좋아요 상태도 분리하여 저장
        setIsLiked(data.liked)
        setLikeCount(data.likeCount)

        // 컨텐츠 중 이미지가 있는지 확인하고 대표 이미지로 설정
        extractFeaturedImage(data.contents)
      } catch (error) {
        console.error('매거진 조회 오류:', error)
        setError(
          error instanceof Error
            ? error.message
            : '매거진을 불러오는 중 오류가 발생했습니다'
        )
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      // 페이지 로드 시 측정 시작 시간 설정 및 초기화
      startTimeRef.current = Date.now()
      isEngagementSentRef.current = false
      setMaxScrollPercentage(0)
      fetchMagazine()
    }

    // 컴포넌트 언마운트 또는 페이지 이탈 시 활동 정보 전송
    return () => {
      sendEngagementData()
    }
  }, [id])

  // 스크롤 이벤트 리스너 등록
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return

      // 스크롤 퍼센테이지 계산
      const currentPercentage = calculateScrollPercentage()

      // 최대 스크롤 퍼센트 업데이트
      if (currentPercentage > maxScrollPercentage) {
        setMaxScrollPercentage(currentPercentage)
      }
    }

    // 스크롤 이벤트 리스너 등록
    const contentElement = contentRef.current
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll)

      // 콘텐츠가 로드된 후 초기 스크롤 퍼센테이지 계산
      setTimeout(() => {
        handleScroll()
      }, 500)
    }

    // 스크롤 상태를 주기적으로 체크 (이미지 로딩 후 높이 변경 고려)
    const scrollCheckInterval = setInterval(() => {
      handleScroll()
    }, 2000)

    // 페이지 가시성 변경 이벤트 (탭 전환 등) 처리
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        sendEngagementData()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    // 창 전환 이벤트 처리
    const handleBeforeUnload = () => {
      sendEngagementData()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      // 이벤트 리스너 제거
      if (contentElement) {
        contentElement.removeEventListener('scroll', handleScroll)
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      clearInterval(scrollCheckInterval)
    }
  }, [maxScrollPercentage])

  // 컨텐츠에서 첫 번째 이미지 URL을 추출하는 함수
  const extractFeaturedImage = (contents: MagazineContent[]) => {
    const imageContent = contents.find(
      (content) => content.type === 'IMAGE' && content.imageUrl
    )

    if (imageContent && imageContent.imageUrl) {
      // 이미지 URL이 상대 경로인 경우 기본 URL 추가
      const imageUrl = imageContent.imageUrl.startsWith('http')
        ? imageContent.imageUrl
        : `http://localhost/api${imageContent.imageUrl}`

      setFeaturedImage(imageUrl)
    } else {
      // 기본 이미지 경로
      setFeaturedImage('/public/image.png')
    }
  }

  // 컨텐츠를 HTML로 변환하는 함수
  const renderContentAsHTML = () => {
    if (!magazine || !magazine.contents) return ''

    return magazine.contents
      .sort((a, b) => a.contentOrder - b.contentOrder)
      .map((content) => {
        switch (content.type) {
          case 'TEXT':
            return content.text || ''
          case 'IMAGE':
            if (!content.imageUrl) return ''

            // 이미지 URL이 상대 경로인 경우 기본 URL 추가
            const imageUrl = content.imageUrl.startsWith('http')
              ? content.imageUrl
              : `http://localhost/api${content.imageUrl}`

            // 이미지 로드 후 스크롤 위치 갱신을 위해 클래스 추가
            return `<img src="${imageUrl}" class="magazine-content-image" alt="콘텐츠 이미지" onload="setTimeout(function() { window.dispatchEvent(new Event('resize')); }, 100)" />`
          case 'EMOTICON':
            if (!content.emoticonUrl) return ''

            // 이모티콘 URL이 상대 경로인 경우 기본 URL 추가
            const emoticonUrl = content.emoticonUrl.startsWith('http')
              ? content.emoticonUrl
              : `http://localhost/api${content.emoticonUrl}`

            return `<img src="${emoticonUrl}" alt="${content.emoticonName || '이모티콘'}" class="magazine-emoticon" />`
          default:
            return ''
        }
      })
      .join('')
  }

  // 날짜를 포맷팅하는 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}년 ${month}월 ${day}일`
  }

  const handleAuthorClick = () => {
    // 작성자 프로필 페이지로 이동 전 활동 정보 전송
    sendEngagementData()
    if (magazine) {
      navigate(`/profile/${magazine.authorId}`)
    }
  }

  const handleBackClick = () => {
    // 매거진 목록 페이지로 이동 전 활동 정보 전송
    sendEngagementData()
    navigate('/magazinelist')
  }

  // 좋아요 토글 함수 (최적화)
  const handleStarClick = async () => {
    if (!magazine || isLikeProcessing) return

    // 좋아요 처리 중 상태로 설정
    setIsLikeProcessing(true)

    // 즉시 UI 업데이트 (낙관적 업데이트)
    const newIsLiked = !isLiked
    const newLikeCount = isLiked ? likeCount - 1 : likeCount + 1

    // 먼저 UI 상태를 업데이트하여 애니메이션 효과가 보이도록 함
    setIsLiked(newIsLiked)
    setLikeCount(newLikeCount)

    try {
      // fetchWithRefresh 사용하여 좋아요 API 호출
      const response = await fetchWithRefresh(
        `http://localhost/api/magazines/${magazine.id}/like`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error('좋아요 처리 실패')
      }

      // 응답 처리
      const data: LikeResponse = await response.json()

      // magazine 상태도 업데이트 (필요하면)
      setMagazine((prevState) => {
        if (!prevState) return null
        return {
          ...prevState,
          liked: data.liked,
          likeCount: data.likeCount,
        }
      })

      // 서버 응답으로 최종 상태 업데이트 (만약 서버와 상태가 달라졌을 경우)
      setIsLiked(data.liked)
      setLikeCount(data.likeCount)
    } catch (error) {
      console.error('좋아요 처리 중 오류 발생:', error)
      // 오류 발생 시 UI 상태를 원래대로 되돌림
      setIsLiked(!newIsLiked)
      setLikeCount(newIsLiked ? likeCount + 1 : likeCount - 1)
    } finally {
      // 처리 완료
      setIsLikeProcessing(false)
    }
  }

  if (isLoading) {
    return <div>로딩 중...</div>
  }

  if (error) {
    return <div>오류 발생: {error}</div>
  }

  if (!magazine) {
    return <div>매거진을 찾을 수 없습니다.</div>
  }

  // 프로필 이미지 URL 처리
  const profileImageUrl = magazine.authorImageUrl.startsWith('http')
    ? magazine.authorImageUrl
    : `http://localhost/api${magazine.authorImageUrl}`

  return (
    <MagazineDetailContainer>
      <TopBar
        title={categoryNames[magazine.category] || magazine.category}
        showBackButton
        onBackClick={handleBackClick}
      />

      <CoverImage featuredImage={featuredImage}>
        <TitleOverlay>
          <MagazineTitle>{magazine.title}</MagazineTitle>
          <MagazineSubtitle>{magazine.subtitle}</MagazineSubtitle>
        </TitleOverlay>
      </CoverImage>

      <ContentContainer ref={contentRef}>
        <MagazineContent
          dangerouslySetInnerHTML={{ __html: renderContentAsHTML() }}
        />

        <AuthorProfileContainer onClick={handleAuthorClick}>
          <AuthorProfileImage>
            <img
              src={profileImageUrl}
              alt={`${magazine.authorName}의 프로필`}
            />
          </AuthorProfileImage>
          <AuthorProfileInfo>
            <NameRow>
              <AuthorProfileName>{magazine.authorName}</AuthorProfileName>
              <AuthorProfileDepartment>
                {magazine.authorDepartment}
              </AuthorProfileDepartment>
            </NameRow>
            <AuthorDate>{formatDate(magazine.createdAt)}</AuthorDate>
          </AuthorProfileInfo>
          <AuthorProfileArrow>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="#CCCCCC"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </AuthorProfileArrow>
        </AuthorProfileContainer>
      </ContentContainer>
      <BottomToolbar>
        <ToolbarButton
          onClick={handleStarClick}
          disabled={isLikeProcessing}
          active={isLiked}
        >
          <StarIcon
            width={22}
            height={22}
            color={isLiked ? '#FFB800' : '#333333'}
            filled={isLiked}
          />
          <LikeCount>{likeCount}</LikeCount>
        </ToolbarButton>
      </BottomToolbar>
    </MagazineDetailContainer>
  )
}

export default Magazine
