/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { RootContainer, MatchingContainer } from './style'
const Matching = () => {
  const location = useLocation()

  return (
    <RootContainer>
      <MatchingContainer></MatchingContainer>
    </RootContainer>
  )
}

export default Matching
