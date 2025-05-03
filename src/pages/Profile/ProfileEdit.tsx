/** @jsxImportSource @emotion/react */
import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { RootContainer, MainContainer, MenuList } from './ProfileEditStyles'

import LeftRightBox from '../../components/profile/leftRightBox'
import Logout from '../../components/profile/logout'
import RedirectBox from '../../components/profile/redirectBox'
import Withdraw from '../../components/profile/withdraw'
import Toggle from '../../components/profile/toggle'

interface ProfileEditProps {}

const ProfileEdit = ({}: ProfileEditProps) => {
  return (
    <RootContainer>
      <MainContainer>
        <MenuList>
          <LeftRightBox />
          <Toggle />

          <RedirectBox />
          <RedirectBox />

          <Logout />
          <Withdraw />
        </MenuList>
      </MainContainer>
    </RootContainer>
  )
}

export default ProfileEdit
