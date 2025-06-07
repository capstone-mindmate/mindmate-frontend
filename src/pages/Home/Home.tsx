import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../../components/topbar/Topbar'
import { AlarmIcon, NormalPlusIcon } from '../../components/icon/iconComponents'
import FrameSlider from './FrameSlider'
import SkeletonFrameSlider from '../../components/skeleton/SkeletonFrameSlider' // 스켈레톤 컴포넌트 import
import SkeletonEmoticonGrid from '../../components/skeleton/SkeletonEmoticonGrid' // 이모티콘 스켈레톤 import
import SkeletonCardNews from '../../components/skeleton/SkeletonCardNews' // 카드뉴스 스켈레톤 import
import HomeCategoryButton from '../../components/home/homeCategoryButton'
import NavigationComponent from '../../components/navigation/navigationComponent'
import Emoticon, { EmoticonType } from '../../components/emoticon/Emoticon'
import CardNewsComponent from '../../components/home/cardNewsComponent'
import StudentSupportLink from '../../components/home/StudentSupportLink'
import { useToast } from '../../components/toast/ToastProvider'
import {
  HomeContainer,
  ContentContainer,
  CategoryTitle,
  HomeCategoryContainer,
  SectionContainer,
  SectionTitleContainer,
  SectionTitle,
  SeeMoreButton,
  EmoticonGrid,
  CardNewsScrollContainer,
  ClickableCard,
  StudentSupportContainer,
  PlainSectionContainer,
  LogoText,
} from './HomeStyles'
import FloatingButton from '../../components/buttons/floatingButton'
import { getTokenCookie } from '../../utils/fetchWithRefresh'
import { FrameData } from './FrameSlider'
import { fetchWithRefresh } from '../../utils/fetchWithRefresh'
import { usePageAnimation, smoothNavigate } from '../../hooks/usePageAnimation'
import { getKoreanErrorMessage } from '../../utils/errorMessageUtils'
// 매거진 데이터 인터페이스 정의
interface MagazineContent {
  id: number
  type: string
  text: string | null
  imageUrl: string | null
  emoticonUrl: string | null
  emoticonName: string | null
  contentOrder: number
}

interface PopularMagazine {
  id: number
  title: string
  subtitle: string
  contents: MagazineContent[]
  authorName: string
  authorId: number
  likeCount: number
  status: string
  category: string
  createdAt: string
  updatedAt: string
}

interface CardNews {
  title: string
  article_types: string[]
  article_url: string
  image_urls: string[]
  upload_date: string
}

// 인기 이모티콘 데이터 인터페이스 정의
interface PopularEmoticon {
  id: number
  name: string
  imageUrl: string
}

const HomePage = () => {
  const navigate = useNavigate()
  const { fadeInUp } = usePageAnimation() // 애니메이션 훅 사용
  const [popularMagazines, setPopularMagazines] = useState<PopularMagazine[]>(
    []
  )
  const [magazineFrames, setMagazineFrames] = useState<FrameData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [popularEmoticons, setPopularEmoticons] = useState<PopularEmoticon[]>(
    []
  )
  const [isEmoticonLoading, setIsEmoticonLoading] = useState<boolean>(false)
  const [emoticonError, setEmoticonError] = useState<string | null>(null)
  const [cardNews, setCardNews] = useState<CardNews[]>([])
  const [isCardNewsLoading, setIsCardNewsLoading] = useState<boolean>(false)
  const [cardNewsError, setCardNewsError] = useState<string | null>(null)
  const { showToast } = useToast()

  // 인기 매거진 데이터 가져오기
  useEffect(() => {
    const fetchPopularMagazines = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // 인증 토큰 가져오기
        const accessToken = getTokenCookie('accessToken')

        // API URL
        const apiUrl = `https://mindmate.shop/api/magazines/popular?limit=5`

        // API 호출
        const response = await fetchWithRefresh(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          credentials: 'include',
        })

        if (!response.ok) {
          throw new Error(
            `API 호출 실패: ${response.status} ${response.statusText}`
          )
        }

        const data: PopularMagazine[] = await response.json()
        //console.log('인기 매거진 데이터:', data)
        setPopularMagazines(data)

        // 매거진 데이터를 프레임 형식으로 변환
        const frames = data.map((magazine, index) => {
          return {
            id: magazine.id,
            title: magazine.title,
            detail: magazine.subtitle || '',
            imageSrc: getMagazineThumbnail(magazine),
            currentPage: index + 1,
            totalPages: data.length,
          }
        })

        setMagazineFrames(frames)
      } catch (error) {
        console.error('인기 매거진 조회 오류:', error)
        const koreanMessage = getKoreanErrorMessage(error, 'magazine')
        setError(koreanMessage)
        showToast(koreanMessage, 'error')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPopularMagazines()
  }, []) // 컴포넌트 마운트 시 한 번만 실행

  // 현재 이모티콘 목록 가져오기
  useEffect(() => {
    const fetchRecommendedEmoticons = async () => {
      setIsEmoticonLoading(true)
      setEmoticonError(null)

      try {
        const res = await fetchWithRefresh(
          'https://mindmate.shop/api/emoticons/popular/viewed',
          {
            method: 'GET',
          }
        )

        if (!res.ok) {
          throw new Error(`API 호출 실패: ${res.status} ${res.statusText}`)
        }

        const data = await res.json()
        setPopularEmoticons(data)
      } catch (error) {
        console.error('인기 이모티콘 조회 오류:', error)
        const koreanMessage = getKoreanErrorMessage(error, 'emoticon')
        setEmoticonError(koreanMessage)
        showToast(koreanMessage, 'error')
      } finally {
        setIsEmoticonLoading(false)
      }
    }

    fetchRecommendedEmoticons()
  }, [])

  // 학생 소식 가져오기
  useEffect(() => {
    const fetchCardNews = async () => {
      setIsCardNewsLoading(true)
      setCardNewsError(null)

      try {
        const res = await fetchWithRefresh('https://mindmate.shop/forstudent', {
          method: 'GET',
        })

        if (!res.ok) {
          throw new Error(`API 호출 실패: ${res.status} ${res.statusText}`)
        }

        const data = await res.json()
        setCardNews(data)
        console.log(data)
      } catch (error) {
        console.error('학생소식 조회 오류:', error)
        const koreanMessage = getKoreanErrorMessage(error, 'news')
        setCardNewsError(koreanMessage)
        showToast(koreanMessage, 'error')
      } finally {
        setIsCardNewsLoading(false)
      }
    }

    fetchCardNews()
  }, [])

  // 알람 아이콘 클릭 핸들러
  const handleAlarmClick = () => {
    smoothNavigate(navigate, '/notification')
  }

  // 플로팅 버튼 활성화 핸들러
  const handleFloatingButtonActive = (isActive: boolean) => {
    if (isActive) {
      smoothNavigate(navigate, '/magazine/write')
    }
  }

  // 프레임 클릭 핸들러 - 매거진 상세 페이지로 이동
  const handleFrameClick = (frameId: number) => {
    console.log(`Frame ${frameId} clicked, navigate to magazine detail page`)
    smoothNavigate(navigate, `/magazine/${frameId}`)
  }

  // 더보기 버튼 클릭 핸들러
  const handleSeeMoreClick = () => {
    smoothNavigate(navigate, '/emoticons')
  }

  // 이모티콘 클릭 핸들러
  const handleEmoticonClick = (type: EmoticonType) => {
    smoothNavigate(navigate, '/emoticons')
  }

  // 카테고리별 필터링 이동 핸들러
  const handleCategoryClick = (category: string) => {
    smoothNavigate(navigate, '/matching', { state: { category } })
  }

  // 매거진의 썸네일 이미지 URL 추출 함수
  const getMagazineThumbnail = (magazine: PopularMagazine): string => {
    const imageContent = magazine.contents.find(
      (content) => content.type === 'IMAGE' && content.imageUrl
    )

    if (imageContent && imageContent.imageUrl) {
      return imageContent.imageUrl.startsWith('http')
        ? imageContent.imageUrl
        : `https://mindmate.shop/api${imageContent.imageUrl}`
    }

    return '/default-profile-image.png' // 기본 이미지 경로
  }

  // 카드뉴스 클릭 핸들러
  const handleCardNewsClick = (url: string) => {
    console.log(`Opening URL: ${url}`)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  // 매거진 슬라이더 렌더링 함수
  const renderMagazineSlider = () => {
    if (isLoading) {
      // 로딩 중일 때 스켈레톤 UI 표시
      return <SkeletonFrameSlider />
    }

    if (error) {
      // 에러가 발생한 경우에도 스켈레톤 UI 표시 (토스트로 에러 메시지는 별도 표시)
      return <SkeletonFrameSlider />
    }

    if (magazineFrames.length > 0) {
      return (
        <FrameSlider frames={magazineFrames} onFrameClick={handleFrameClick} />
      )
    }

    // 매거진이 없는 경우에도 스켈레톤 표시
    return <SkeletonFrameSlider />
  }

  // 이모티콘 그리드 렌더링 함수
  const renderEmoticonGrid = () => {
    if (isEmoticonLoading) {
      return <SkeletonEmoticonGrid />
    }

    if (emoticonError) {
      return <SkeletonEmoticonGrid />
    }

    if (popularEmoticons.length > 0) {
      return (
        <EmoticonGrid>
          {popularEmoticons.map((emoticon) => (
            <Emoticon
              key={emoticon.id}
              emoticonURL={'https://mindmate.shop/api' + emoticon.imageUrl}
              type={emoticon.name as any}
              size="medium"
              onClick={() => handleEmoticonClick(emoticon.name as any)}
            />
          ))}
        </EmoticonGrid>
      )
    }

    return <SkeletonEmoticonGrid />
  }

  // 카드뉴스 렌더링 함수
  const renderCardNews = () => {
    if (isCardNewsLoading) {
      return <SkeletonCardNews />
    }

    if (cardNewsError) {
      return <SkeletonCardNews />
    }

    const validCardNews = cardNews.filter((news) => news.title.trim() !== '')

    if (validCardNews.length > 0) {
      return (
        <CardNewsScrollContainer>
          {validCardNews.map((news, index) => (
            <ClickableCard
              key={`${news.article_url}-${index}`}
              onClick={() => handleCardNewsClick(news.article_url)}
            >
              <CardNewsComponent
                imgUrl={news.image_urls[0]}
                title={news.title}
                organization="인권센터 학생상담소"
                date={news.upload_date}
              />
            </ClickableCard>
          ))}
        </CardNewsScrollContainer>
      )
    }

    return <SkeletonCardNews />
  }

  return (
    <HomeContainer css={fadeInUp}>
      <ContentContainer>
        <TopBar
          leftContent={<LogoText>Mindmate</LogoText>}
          rightContent={
            <button onClick={handleAlarmClick}>
              <AlarmIcon color="#392111" />
            </button>
          }
          showBorder={false}
          isFixed={true}
          title={''}
        />

        {/* 매거진 슬라이더 영역 - 스켈레톤 UI 적용 */}
        {renderMagazineSlider()}

        <div>
          <CategoryTitle>메이트들과 고민을 나눠보세요!</CategoryTitle>
          <HomeCategoryContainer>
            <HomeCategoryButton
              buttonText="진로고민"
              emoji="🤯"
              onClick={() => handleCategoryClick('진로')}
            />
            <HomeCategoryButton
              buttonText="취업고민"
              emoji="💼"
              onClick={() => handleCategoryClick('취업')}
            />
            <HomeCategoryButton
              buttonText="학업고민"
              emoji="📚"
              onClick={() => handleCategoryClick('학업')}
            />
            <HomeCategoryButton
              buttonText="인간관계"
              emoji="👥"
              onClick={() => handleCategoryClick('인간관계')}
            />
            <HomeCategoryButton
              buttonText="경제고민"
              emoji="💰"
              onClick={() => handleCategoryClick('경제')}
            />
            <HomeCategoryButton
              buttonText="기타고민"
              emoji="🤔"
              onClick={() => handleCategoryClick('기타')}
            />
          </HomeCategoryContainer>
        </div>
        <div className="floatingList">
          <FloatingButton
            buttonIcon={<NormalPlusIcon color="#ffffff" />}
            buttonText="글쓰기"
            onActiveChange={handleFloatingButtonActive}
          />
        </div>
        {/* 추천 이모티콘 섹션 */}
        <SectionContainer>
          <SectionTitleContainer>
            <SectionTitle>추천 이모티콘</SectionTitle>
            <SeeMoreButton onClick={handleSeeMoreClick}>더보기</SeeMoreButton>
          </SectionTitleContainer>

          {/* 이모티콘 그리드 - 스켈레톤 UI 적용 */}
          {renderEmoticonGrid()}

          {/* 지금 필요한 학생소식 섹션 */}
          <PlainSectionContainer>
            <SectionTitleContainer>
              <SectionTitle>지금 필요한 학생소식</SectionTitle>
            </SectionTitleContainer>

            {/* 카드 뉴스 컴포넌트 영역 - 스켈레톤 UI 적용 */}
            {renderCardNews()}
          </PlainSectionContainer>

          <StudentSupportContainer>
            <StudentSupportLink />
          </StudentSupportContainer>
        </SectionContainer>
      </ContentContainer>
      <NavigationComponent />
    </HomeContainer>
  )
}

export default HomePage
