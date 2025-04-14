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
} from './style'
import NavigationComponent from '../../components/navigation/navigationComponent'

const Matching = () => {
  const location = useLocation()

  return (
    <RootContainer>
      <MatchingContainer>
        <MatchingTopBar>
          <TopBarTitle>매칭하기</TopBarTitle>

          <IconList>
            <SearchIcon />
            <ListIcon />
            <PlusIcon />
          </IconList>
        </MatchingTopBar>
      </MatchingContainer>
      <NavigationComponent />
    </RootContainer>
  )
}

export default Matching
