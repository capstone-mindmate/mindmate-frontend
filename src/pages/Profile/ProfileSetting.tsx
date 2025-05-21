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
import { useAuthStore } from '../../stores/userStore'
import { fetchWithRefresh } from '../../utils/fetchWithRefresh'

interface ProfileSettingProps {}

const ProfileSetting = ({}: ProfileSettingProps) => {
  const navigate = useNavigate()
  const { user, clearUser } = useAuthStore()
  const [toggleState, setToggleState] = useState(false)

  const handleTogglePush = () => {
    setToggleState(!toggleState)
  }

  // 로그아웃 API 연동
  const handleLogout = async () => {
    try {
      await fetchWithRefresh('httpss://mindmate.shop/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
      clearUser()
      localStorage.removeItem('auth-store')
      localStorage.removeItem('userId')
      localStorage.removeItem('register_step')
      navigate('/onboarding')
    } catch (e) {
      alert('로그아웃 실패')
    }
  }

  return (
    <RootContainer>
      <TopBar
        title="설정"
        showBackButton={true}
        onBackClick={() => navigate('/mypage')}
      />
      <MainContainer>
        <MenuList>
          <LeftRightBox leftText="로그인 계정" rightText={user?.email || ''} />
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

          <Logout text="로그아웃" onClick={handleLogout} />
          <Withdraw text="회원 탈퇴" onClick={() => navigate('/withdraw')} />
        </MenuList>
      </MainContainer>
    </RootContainer>
  )
}

export default ProfileSetting
