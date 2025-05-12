import React, { useEffect, useState } from 'react'
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
} from './styles/MagazineStyles'

// API 응답 데이터 타입 정의
interface MagazineContent {
  id: number
  type: string
  text: string
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
  authorDepartment: string
  authorProfileImage: string
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

const Magazine: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [magazine, setMagazine] = useState<MagazineData | null>(null)
  const [featuredImage, setFeaturedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    // Todo: API 호출
    const mockData: MagazineData = {
      id: parseInt(id || '1'),
      title: '친구 사이에도 거리두기가 필요해',
      subtitle: '인간관계 때문에 고민중이라면 필독 👀',
      contents: [
        {
          id: 1,
          type: 'TEXT',
          text: '<p>친구 사이에도 누명이가 존재한다는 사실을 인지하세요. 그럼 확실히 고민이 줄어들긴합니다.</p>',
          imageUrl: null,
          emoticonUrl: null,
          emoticonName: null,
          contentOrder: 1,
        },
        {
          id: 2,
          type: 'TEXT',
          text: '<p>히히히 😊</p>',
          imageUrl: null,
          emoticonUrl: null,
          emoticonName: null,
          contentOrder: 2,
        },
        {
          id: 3,
          type: 'TEXT',
          text: '<p>매롱매롱</p>',
          imageUrl: null,
          emoticonUrl: null,
          emoticonName: null,
          contentOrder: 3,
        },
        {
          id: 4,
          type: 'TEXT',
          text: '<p>누가 힘들게 하면 마음속으로<br>참을 인 16번 써버리고 놓아주세요.. 🌸</p>',
          imageUrl: null,
          emoticonUrl: null,
          emoticonName: null,
          contentOrder: 4,
        },
        {
          id: 5,
          type: 'TEXT',
          text: '<p>그게 최곱니다요!!</p>',
          imageUrl: null,
          emoticonUrl: null,
          emoticonName: null,
          contentOrder: 5,
        },
        {
          id: 6,
          type: 'IMAGE',
          text: null,
          imageUrl: '/public/image.png',
          emoticonUrl: null,
          emoticonName: null,
          contentOrder: 6,
        },
        {
          id: 7,
          type: 'EMOTICON',
          text: null,
          imageUrl: null,
          emoticonUrl: '/public/emoticon.png',
          emoticonName: '웃는 얼굴',
          contentOrder: 7,
        },
      ],
      authorName: '김멋사',
      authorId: 12345,
      authorDepartment: '컴퓨터공학과',
      authorProfileImage: '/public/profile.png',
      likeCount: 42,
      status: 'PUBLISHED',
      category: '진로',
      createdAt: '2025-05-07T10:11:35.857Z',
      updatedAt: '2025-05-07T10:11:35.857Z',
      author: false,
      liked: false,
    }

    setMagazine(mockData)

    // 컨텐츠 중 이미지가 있는지 확인하고 대표 이미지로 설정
    extractFeaturedImage(mockData.contents)
  }, [id])

  // 컨텐츠에서 첫 번째 이미지 URL을 추출하는 함수
  const extractFeaturedImage = (contents: MagazineContent[]) => {
    const imageContent = contents.find(
      (content) => content.type === 'IMAGE' && content.imageUrl
    )
    if (imageContent && imageContent.imageUrl) {
      setFeaturedImage(imageContent.imageUrl)
    } else {
      setFeaturedImage('/public/image.png') // 기본 이미지
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
            return content.imageUrl
              ? `<img src="${content.imageUrl}" alt="콘텐츠 이미지" />`
              : ''
          case 'EMOTICON':
            return content.emoticonUrl
              ? `<img src="${content.emoticonUrl}" alt="${content.emoticonName || '이모티콘'}" />`
              : ''
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
    // 작성자 프로필 페이지로 이동
    if (magazine) {
      navigate(`/profile/${magazine.authorId}`)
    }
  }

  const handleBackClick = () => {
    navigate('/magazinelist')
  }

  // POST /api/magazine/{magazineId}/like API를 사용한 좋아요 토글 함수
  const handleStarClick = async () => {
    if (!magazine || isLoading) return

    try {
      setIsLoading(true)

      // API 호출 - POST /api/magazine/{magazineId}/like
      const response = await fetch(`/api/magazine/${magazine.id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 쿠키 포함
      })

      if (!response.ok) {
        throw new Error('좋아요 처리 실패')
      }

      // 응답 처리
      const data: LikeResponse = await response.json()

      // 상태 업데이트 - 좋아요 상태와 개수를 업데이트
      setMagazine((prevState) => {
        if (!prevState) return null
        return {
          ...prevState,
          liked: data.liked,
          likeCount: data.likeCount,
        }
      })
    } catch (error) {
      console.error('좋아요 처리 중 오류 발생:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!magazine) {
    return <div>로딩 중...</div>
  }

  return (
    <MagazineDetailContainer>
      <TopBar
        title={magazine.category}
        showBackButton
        onBackClick={handleBackClick}
      />

      <CoverImage featuredImage={featuredImage}>
        <TitleOverlay>
          <MagazineTitle>{magazine.title}</MagazineTitle>
          <MagazineSubtitle>{magazine.subtitle}</MagazineSubtitle>
        </TitleOverlay>
      </CoverImage>

      <ContentContainer>
        <MagazineContent
          dangerouslySetInnerHTML={{ __html: renderContentAsHTML() }}
        />

        <AuthorProfileContainer onClick={handleAuthorClick}>
          <AuthorProfileImage>
            <img
              src={magazine.authorProfileImage}
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
          disabled={isLoading}
          active={magazine.liked}
        >
          <StarIcon
            width={22}
            height={22}
            color={magazine.liked ? '#FFB800' : '#333333'}
          />
          <LikeCount>{magazine.likeCount}</LikeCount>
        </ToolbarButton>
      </BottomToolbar>
    </MagazineDetailContainer>
  )
}

export default Magazine
