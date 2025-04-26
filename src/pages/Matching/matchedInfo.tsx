/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import TopBar from '../../components/topbar/Topbar'
import { css } from '@emotion/react'

import {
  RootContainer,
  MatchingContainer,
  TopFixedContent,
  CategoryContainer,
  MatchedInfoCategoryContainer,
  CategoryItemText,
  MatchItemsContainer,
} from './style'
import MatchItem from '../../components/matching/matchItem'
const matchItemsData = [
  {
    id: 1,
    department: '소프트웨어학과',
    title: '소프트웨어학과 소개',
    description: '소프트웨어학과는 소프트웨어 개발과 관련된 학과입니다.',
    matchType: '리스너',
    category: '진로',
    borderSet: true,
    username: '행복한 돌멩이',
    profileImage: '/public/image.png',
    makeDate: '04월 19일 15:30',
  },
  {
    id: 2,
    department: '미디어학과',
    title: '미디어학과 관련 질문',
    description: '미디어학과에 관한 궁금한 점이 있습니다.',
    matchType: '스피커',
    category: '경제',
    borderSet: true,
    username: '건들면 짖는댕',
    profileImage: '/public/image.png',
    makeDate: '04월 19일 14:20',
  },
  {
    id: 3,
    department: '소프트웨어학과',
    title: '취업 준비 방법',
    description: '소프트웨어 분야 취업 준비는 어떻게 하면 좋을까요?',
    matchType: '리스너',
    category: '취업',
    borderSet: true,
    username: '말하고 싶어라',
    profileImage: '/public/image copy.png',
    makeDate: '04월 18일 22:15',
  },
]

interface MatchedInfoProps {}

const MatchedInfo = ({}: MatchedInfoProps) => {
  const [selectedCategory, setSelectedCategory] = useState('내가 만든 매칭방')

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
  }

  const handleMatchItemClick = (item: (typeof matchItemsData)[0]) => {
    console.log(item)
  }

  return (
    <RootContainer>
      <TopBar title="매칭방 목록" showBackButton actionText="" />
      <MatchingContainer>
        <TopFixedContent fixedType="matched">
          <CategoryContainer>
            <MatchedInfoCategoryContainer
              className={
                selectedCategory === '내가 만든 매칭방' ? 'selected' : ''
              }
              onClick={() => handleCategorySelect('내가 만든 매칭방')}
            >
              <CategoryItemText>내가 만든 매칭방</CategoryItemText>
            </MatchedInfoCategoryContainer>

            <MatchedInfoCategoryContainer
              className={
                selectedCategory === '신청보낸 매칭방' ? 'selected' : ''
              }
              onClick={() => handleCategorySelect('신청보낸 매칭방')}
            >
              <CategoryItemText>신청보낸 매칭방</CategoryItemText>
            </MatchedInfoCategoryContainer>
          </CategoryContainer>
        </TopFixedContent>

        <MatchItemsContainer pageType="matched">
          {matchItemsData.length > 0 ? (
            matchItemsData.map((item, index) => (
              <MatchItem
                key={item.id}
                department={item.department}
                title={item.title}
                description={item.description}
                matchType={item.matchType}
                category={item.category}
                borderSet={index < matchItemsData.length - 1}
                onClick={() => handleMatchItemClick(item)}
              />
            ))
          ) : (
            <div
              css={{
                padding: '20px',
                textAlign: 'center',
                width: '100%',
                color: '#888',
              }}
            >
              매칭방이 없습니다.
            </div>
          )}
        </MatchItemsContainer>
      </MatchingContainer>
    </RootContainer>
  )
}

export default MatchedInfo
