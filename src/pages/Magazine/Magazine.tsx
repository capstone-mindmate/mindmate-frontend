import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'
import TopBar from '../../components/topbar/Topbar'
import { ChatBubbleIcon, StarIcon } from '../../components/icon/iconComponents'

interface MagazineData {
  id: string | number
  title: string
  subtitle: string
  content: string
  featuredImageUrl: string | null
}

const Magazine: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [magazine, setMagazine] = useState<MagazineData | null>(null)
  const [featuredImage, setFeaturedImage] = useState<string | null>(null)

  useEffect(() => {
    // 실제 구현에서는 API 호출로 데이터를 가져옵니다
    // 지금은 목업 데이터를 사용합니다
    const mockData: MagazineData = {
      id: id || '1',
      title: '친구 사이에도 거리두기가 필요해',
      subtitle: '인간관계 때문에 고민중이라면 필독 👀',
      content:
        '<p>친구 사이에도 누명이가 존재한다는 사실을 인지하세요. 그럼 확실히 고민이 줄어들긴합니다.</p><p>히히히 😊</p><p>매롱매롱</p><p>누가 힘들게 하면 마음속으로<br>참을 인 16번 써버리고 놓아주세요.. 🌸</p><p>그게 최곱니다요!!</p>',
      featuredImageUrl: '/public/image.png',
    }

    setMagazine(mockData)

    // 첫 번째 이미지를 대표 이미지로 설정
    // 실제 코드에서는 magazine.featuredImageUrl을 사용하거나 content에서 추출
    extractFeaturedImage(mockData.content)
  }, [id])

  // HTML 내용에서 첫 번째 이미지 URL을 추출하는 함수
  const extractFeaturedImage = (htmlContent: string) => {
    if (!htmlContent) return

    // 임시 DOM에 HTML 삽입
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlContent, 'text/html')

    // 모든 이미지 태그 찾기
    const images = doc.querySelectorAll('img')

    if (images.length > 0) {
      // 첫 번째 이미지의 src 속성 가져오기
      setFeaturedImage(images[0].src)
    }
  }

  // 뒤로가기 버튼 핸들러
  const handleBackClick = () => {
    navigate('/magazine')
  }

  const handleStarClick = () => {
    console.log('좋아요')
  }

  const handleCommentClick = () => {
    console.log('댓글')
  }

  if (!magazine) {
    return <div>로딩 중...</div>
  }

  return (
    <MagazineDetailContainer>
      <TopBar title="매거진" showBackButton onBackClick={handleBackClick} />

      <CoverImage featuredImage={featuredImage}>
        <TitleOverlay>
          <MagazineTitle>{magazine.title}</MagazineTitle>
          <MagazineSubtitle>{magazine.subtitle}</MagazineSubtitle>
        </TitleOverlay>
      </CoverImage>

      <ContentContainer>
        <MagazineContent
          dangerouslySetInnerHTML={{ __html: magazine.content }}
        />
      </ContentContainer>
      <BottomToolbar>
        <ToolbarButton onClick={handleStarClick}>
          <StarIcon width={22} height={22} color="#333333" />
        </ToolbarButton>
        <ToolbarButton onClick={handleCommentClick}>
          <ChatBubbleIcon width={20} height={20} color="#333333" />
        </ToolbarButton>
      </BottomToolbar>
    </MagazineDetailContainer>
  )
}

const MagazineDetailContainer = styled.div`
  width: 100%;
  max-width: 884px;
  margin: 0 auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  overflow: hidden;
  overflow-y: auto;
`

const CoverImage = styled.div<{ featuredImage: string | null }>`
  width: 100%;
  height: 40vh;
  min-height: 300px;
  background-image: ${({ featuredImage }) =>
    featuredImage ? `url(${featuredImage})` : 'url(/public/image.png)'};
  background-size: cover;
  background-position: center;
  position: relative;
`

const TitleOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  color: white;
`

const MagazineTitle = styled.h1`
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 700;
  word-break: keep-all; /* 단어 유지 */
  max-width: 70%; /* 컨테이너 너비의 70%까지만 사용 */
  color: #ffffff;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
`

const MagazineSubtitle = styled.h2`
  margin: 0;
  font-size: 16px;
  font-weight: 400;
  color: #ffffff;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  opacity: 0.9;
`

const ContentContainer = styled.div`
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  padding-bottom: 100px;
`

const MagazineContent = styled.div`
  font-size: 16px;
  line-height: 1.6;
  color: #333333;
  flex: 1;

  img {
    max-width: 100%;
    height: auto;
    margin: 16px 0;
  }

  p {
    margin-bottom: 16px;
  }
`

const BottomToolbar = styled.div`
  display: flex;
  padding: 0px 16px;
  border-top: 1px solid #d9d9d9;
  bottom: 0;
  width: 100%;
  background-color: #ffffff;
  position: fixed;
`

const ToolbarButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  margin-bottom: 0px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:last-child {
    margin-right: 0;
  }
`

export default Magazine
