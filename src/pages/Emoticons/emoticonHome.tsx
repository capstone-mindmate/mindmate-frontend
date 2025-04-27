/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { RootContainer, EmoticonsContainer } from './style'
import EmoticonProfile from '../../components/mypage/emoticonProfile'
const EmoticonHome = () => {
  const navigate = useNavigate()

  return (
    <RootContainer>
      <EmoticonsContainer>
        <EmoticonProfile
          profileImage="/public/image.png"
          name="프로필이름"
          heldCoins={100}
        />
      </EmoticonsContainer>
    </RootContainer>
  )
}

export default EmoticonHome
