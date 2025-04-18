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
  CategoryDetailContainer,
} from './style'
import NavigationComponent from '../../components/navigation/navigationComponent'
import BrownRoundButton from '../../components/buttons/brownRoundButton'
import YellowRoundButton from '../../components/buttons/yellowRoundButton'
import NormalSelectButton from '../../components/buttons/normalSelectButton'
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

          <CategoryDetailContainer>
            <NormalSelectButton
              options={['소프트웨어학과', '미디어학과']}
              onChange={(isActive) => {
                console.log('버튼 상태 : ', isActive)
              }}
            />

            <BrownRoundButton
              buttonText="리스너"
              onActiveChange={(isActive) => {
                console.log('버튼 상태 : ', isActive)
              }}
            />

            <YellowRoundButton
              buttonText="스피커"
              onActiveChange={(isActive) => {
                console.log('버튼 상태 : ', isActive)
              }}
            />
          </CategoryDetailContainer>
        </TopFixedContent>
      </MatchingContainer>
      <NavigationComponent />
    </RootContainer>
  )
}

export default Matching
