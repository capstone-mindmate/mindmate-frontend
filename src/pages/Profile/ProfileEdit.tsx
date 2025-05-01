/** @jsxImportSource @emotion/react */
import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { RootContainer, MainContainer } from './ProfileEditStyles'

interface ProfileEditProps {}

const ProfileEdit = ({}: ProfileEditProps) => {
  return (
    <RootContainer>
      <MainContainer></MainContainer>
    </RootContainer>
  )
}

export default ProfileEdit
