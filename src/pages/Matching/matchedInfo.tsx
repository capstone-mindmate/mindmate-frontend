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
  CategoryItem,
  CategoryItemText,
} from './style'

interface MatchedInfoProps {}

const MatchedInfo = ({}: MatchedInfoProps) => {
  const [selectedCategory, setSelectedCategory] = useState('전체')

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
  }
  return (
    <RootContainer>
      <TopBar title="매칭방 목록" showBackButton actionText="" />
      <MatchingContainer>
        <TopFixedContent fixedType="matched">
          <CategoryContainer>
            <CategoryItem
              className={selectedCategory === '전체' ? 'selected' : ''}
              onClick={() => handleCategorySelect('전체')}
            >
              <CategoryItemText>전체</CategoryItemText>
            </CategoryItem>

            <CategoryItem
              className={selectedCategory === '전체' ? 'selected' : ''}
              onClick={() => handleCategorySelect('전체')}
            >
              <CategoryItemText>전체</CategoryItemText>
            </CategoryItem>

            <CategoryItem
              className={selectedCategory === '전체' ? 'selected' : ''}
              onClick={() => handleCategorySelect('전체')}
            >
              <CategoryItemText>전체</CategoryItemText>
            </CategoryItem>
          </CategoryContainer>
        </TopFixedContent>
      </MatchingContainer>
    </RootContainer>
  )
}

export default MatchedInfo
