/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  SearchIcon,
  ListIcon,
  PlusIcon,
  SendIcon,
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
  MatchItemsContainer,
} from './style'
import NavigationComponent from '../../components/navigation/navigationComponent'
import BrownRoundButton from '../../components/buttons/brownRoundButton'
import YellowRoundButton from '../../components/buttons/yellowRoundButton'
import NormalSelectButton from '../../components/buttons/normalSelectButton'
import MatchItem from '../../components/matching/matchItem'
import FloatingButton from '../../components/buttons/floatingButton'

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

        <MatchItemsContainer>
          <MatchItem
            department="소프트웨어학과"
            title="소프트웨어학과 소개"
            description="소프트웨어학과는 소프트웨어 개발과 관련된 학과입니다."
            matchType="리스너"
            category="진로"
            borderSet={true}
          />

          <MatchItem
            department="미디어학과"
            title="ㅁㄴㅇㄹㅁㄴㅇㄹ"
            description="ㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹ"
            matchType="스피커"
            category="경제"
            borderSet={false}
          />

          <MatchItem
            department="소프트웨어학과"
            title="소프트웨어학과 소개"
            description="소프트웨어학과는 소프트웨어 개발과 관련된 학과입니다."
            matchType="리스너"
            category="진로"
            borderSet={true}
          />

          <MatchItem
            department="소프트웨어학과"
            title="소프트웨어학과 소개"
            description="소프트웨어학과는 소프트웨어 개발과 관련된 학과입니다."
            matchType="리스너"
            category="진로"
            borderSet={true}
          />

          <MatchItem
            department="소프트웨어학과"
            title="소프트웨어학과 소개"
            description="소프트웨어학과는 소프트웨어 개발과 관련된 학과입니다."
            matchType="리스너"
            category="진로"
            borderSet={true}
          />

          <MatchItem
            department="소프트웨어학과"
            title="소프트웨어학과 소개"
            description="소프트웨어학과는 소프트웨어 개발과 관련된 학과입니다."
            matchType="리스너"
            category="진로"
            borderSet={true}
          />

          <MatchItem
            department="소프트웨어학과"
            title="소프트웨어학과 소개"
            description="소프트웨어학과는 소프트웨어 개발과 관련된 학과입니다."
            matchType="리스너"
            category="진로"
            borderSet={true}
          />

          <MatchItem
            department="소프트웨어학과"
            title="소프트웨어학과 소개"
            description="소프트웨어학과는 소프트웨어 개발과 관련된 학과입니다."
            matchType="리스너"
            category="진로"
            borderSet={true}
          />

          <MatchItem
            department="소프트웨어학과"
            title="소프트웨어학과 소개"
            description="소프트웨어학과는 소프트웨어 개발과 관련된 학과입니다."
            matchType="리스너"
            category="진로"
            borderSet={true}
          />
        </MatchItemsContainer>
      </MatchingContainer>
      <FloatingButton
        buttonIcon={<SendIcon color="#ffffff" width={18} height={18} />}
        buttonText="랜덤매칭"
        onActiveChange={(isActive) => {
          console.log('버튼 상태 : ', isActive)
        }}
      />
      <NavigationComponent />
    </RootContainer>
  )
}

export default Matching
