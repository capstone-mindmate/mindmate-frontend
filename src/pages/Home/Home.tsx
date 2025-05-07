import React from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../../components/topbar/Topbar'
import { AlarmIcon, NormalPlusIcon } from '../../components/icon/iconComponents'
import FrameSlider from './FrameSlider'
import { frames } from './FrameData'
import HomeCategoryButton from '../../components/home/homeCategoryButton'
import NavigationComponent from '../../components/navigation/navigationComponent'
import Emoticon, { EmoticonType } from '../../components/emoticon/Emoticon'
import CardNewsComponent from '../../components/home/cardNewsComponent'
import StudentSupportLink from '../../components/home/StudentSupportLink'
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

const HomePage = () => {
  const navigate = useNavigate()
  // 알람 아이콘 클릭 핸들러
  const handleAlarmClick = () => {
    navigate('/notification') // 알림 페이지로 이동
  }

  // 플로팅 버튼 활성화 핸들러
  const handleFloatingButtonActive = (isActive: boolean) => {
    if (isActive) {
      navigate('/matching/register') // 글쓰기 페이지로 이동
    }
  }

  // 프레임 클릭 핸들러
  const handleFrameClick = (frameId: number) => {
    console.log(`Frame ${frameId} clicked, navigate to detail page`)
    // Todo: 상세 페이지로 이동하는 로직 추가
  }

  // 더보기 버튼 클릭 핸들러
  const handleSeeMoreClick = () => {
    navigate('/emoticons')
  }

  // 이모티콘 클릭 핸들러
  const handleEmoticonClick = (type: EmoticonType) => {
    navigate('/emoticons')
  }

  // 카드뉴스 클릭 핸들러
  const handleCardNewsClick = (url: string) => {
    console.log(`Opening URL: ${url}`)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  // 카테고리별 필터링 이동 핸들러
  const handleCategoryClick = (category: string) => {
    navigate('/matching', { state: { category } })
  }

  return (
    <HomeContainer>
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
        <FrameSlider frames={frames} onFrameClick={handleFrameClick} />
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

          {/* 이모티콘 그리드 */}
          <EmoticonGrid>
            <Emoticon
              type="normal"
              size="medium"
              onClick={() => handleEmoticonClick('normal')}
            />
            <Emoticon
              type="love"
              size="medium"
              onClick={() => handleEmoticonClick('love')}
            />
            <Emoticon
              type="couple"
              size="medium"
              onClick={() => handleEmoticonClick('couple')}
            />
            <Emoticon
              type="talking"
              size="medium"
              onClick={() => handleEmoticonClick('talking')}
            />
          </EmoticonGrid>

          {/* 지금 필요한 학생소식 섹션 */}
          <PlainSectionContainer>
            <SectionTitleContainer>
              <SectionTitle>지금 필요한 학생소식</SectionTitle>
              <SeeMoreButton onClick={() => console.log('더보기 clicked')}>
                더보기
              </SeeMoreButton>
            </SectionTitleContainer>

            {/* 카드 뉴스 컴포넌트 영역 */}
            <CardNewsScrollContainer>
              <ClickableCard
                onClick={() =>
                  handleCardNewsClick(
                    'https://github.com/capstone-mindmate/mindmate-frontend'
                  )
                }
              >
                <CardNewsComponent
                  imgUrl="https://ascc.ajou.ac.kr/_attach/ajou/editor-image/2024/12/JdgawSPIUDxxxGOibddSJULmkn.jpg"
                  title="슬기로운 방학생활"
                  organization="인권센터 학생상담소"
                  date="2025-01-16"
                />
              </ClickableCard>
              <ClickableCard
                onClick={() =>
                  handleCardNewsClick(
                    'https://github.com/capstone-mindmate/mindmate-frontend'
                  )
                }
              >
                <CardNewsComponent
                  imgUrl="https://ascc.ajou.ac.kr/_attach/ajou/editor-image/2024/12/JdgawSPIUDxxxGOibddSJULmkn.jpg"
                  title="나의 솔로해방 일지"
                  organization="인권센터 학생상담소"
                  date="2025-01-15"
                />
              </ClickableCard>
              <ClickableCard
                onClick={() =>
                  handleCardNewsClick(
                    'https://github.com/capstone-mindmate/mindmate-frontend'
                  )
                }
              >
                <CardNewsComponent
                  imgUrl="https://ascc.ajou.ac.kr/_attach/ajou/editor-image/2024/12/JdgawSPIUDxxxGOibddSJULmkn.jpg"
                  title="스트레스 관리 방법"
                  organization="인권센터 학생상담소"
                  date="2025-01-10"
                />
              </ClickableCard>
            </CardNewsScrollContainer>
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
