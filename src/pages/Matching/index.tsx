/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { RootContainer, MatchingContainer } from './style'
import NavigationComponent from '../../components/Navigation/NavigationComponent'

const Matching = () => {
  const location = useLocation()

  return (
    <RootContainer>
      <MatchingContainer>
        <NavigationComponent />
      </MatchingContainer>
    </RootContainer>
  )
}

export default Matching
