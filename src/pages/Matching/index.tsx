/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  SearchIcon,
  ListIcon,
  PlusIcon,
} from '../../components/icon/iconComponents'
import {
  RootContainer,
  MatchingContainer,
  MatchingTopBar,
  IconList,
  TopBarTitle,
  CategoryContainer,
  CategoryItem,
  TopFixedContent,
  CategoryItemText,
} from './style'
import NavigationComponent from '../../components/navigation/navigationComponent'

const Matching = () => {
  const location = useLocation()

  return (
    <RootContainer>
      <MatchingContainer>
        <TopFixedContent>
          <MatchingTopBar>
            <TopBarTitle>매칭하기</TopBarTitle>
            <IconList>
              <SearchIcon color="#392111" />
              <ListIcon color="#392111" />
              <PlusIcon color="#392111" />
            </IconList>
          </MatchingTopBar>

          <CategoryContainer>
            <CategoryItem className="selected">
              <CategoryItemText>전체</CategoryItemText>
            </CategoryItem>
            <CategoryItem>
              <CategoryItemText>진로</CategoryItemText>
            </CategoryItem>
            <CategoryItem>
              <CategoryItemText>취업</CategoryItemText>
            </CategoryItem>
            <CategoryItem>
              <CategoryItemText>학업</CategoryItemText>
            </CategoryItem>
            <CategoryItem>
              <CategoryItemText>인간관계</CategoryItemText>
            </CategoryItem>
            <CategoryItem>
              <CategoryItemText>경제</CategoryItemText>
            </CategoryItem>
            <CategoryItem>
              <CategoryItemText>기타</CategoryItemText>
            </CategoryItem>
          </CategoryContainer>
        </TopFixedContent>
      </MatchingContainer>
      <NavigationComponent />
    </RootContainer>
  )
}

export default Matching
