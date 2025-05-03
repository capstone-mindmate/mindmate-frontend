/** @jsxImportSource @emotion/react */
import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { RootContainer, MainContainer, MenuList } from './ProfileSettingStyles'

import TopBar from '../../components/topbar/Topbar'
import LeftRightBox from '../../components/profile/leftRightBox'
import Logout from '../../components/profile/logout'
import RedirectBox from '../../components/profile/redirectBox'
import Withdraw from '../../components/profile/withdraw'
import Toggle from '../../components/profile/toggle'

interface ProfileSettingProps {}

const ProfileSetting = ({}: ProfileSettingProps) => {
  const navigate = useNavigate()
  const [toggleState, setToggleState] = useState(false)

  const handleTogglePush = () => {
    setToggleState(!toggleState)
  }

  return (
    <RootContainer>
      <TopBar
        title="설정"
        showBackButton={true}
        onBackClick={() => navigate('/')}
      />
      <MainContainer>
        <MenuList>
          <LeftRightBox leftText="로그인 계정" rightText="email@ajou.ac.kr" />
          <Toggle
            text="푸쉬 알림"
            toggleState={toggleState}
            onToggle={handleTogglePush}
          />

          <RedirectBox
            text="서비스 이용 약관"
            onClick={() => navigate('/terms')}
          />
          <RedirectBox
            text="개인정보처리방침"
            onClick={() => navigate('/privacy')}
          />

          <Logout text="로그아웃" onClick={() => {}} />
          <Withdraw text="회원 탈퇴" onClick={() => {}} />
        </MenuList>
      </MainContainer>
    </RootContainer>
  )
}

export default ProfileSetting
