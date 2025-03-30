import { useState } from 'react'
import './App.css'
import * as IconComponents from './components/icon/iconComponents'
import { GlobalStyles } from '../styles/GlobalStyles'
import { useToast } from './components/toast/ToastProvider.tsx'
import TopBar from './components/topbar/Topbar.tsx'

/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

const iconListStyles = css`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
`

function App() {
  const [count, setCount] = useState(0)
  const { showToast } = useToast()

  const handleBackClick = () => {
    showToast('뒤로가기 버튼이 클릭되었습니다', 'info')
  }

  const handleAction = () => {
    showToast('액션 버튼이 클릭되었습니다', 'success')
  }

  return (
    <>
      <GlobalStyles />
      <TopBar
        title="타이틀 입력"
        showBackButton
        onBackClick={handleBackClick}
        actionText="등록"
        onActionClick={handleAction}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          paddingTop: '70px', // TopBar 높이만큼 여백 추가
        }}
      >
        <div className="card" style={{ marginBottom: '30px' }}>
          <button
            onClick={() => {
              setCount((count) => count + 1)
              if (count % 4 === 0) {
                showToast('카운트가 증가했습니다!', 'success')
              } else if (count % 4 === 1) {
                showToast('아주대학교 이메일을 입력해주세요', 'info')
              } else if (count % 4 === 2) {
                showToast('네트워크 연결을 확인해주세요', 'warning')
              } else {
                showToast('전송에 실패했습니다', 'error')
              }
            }}
          >
            count is {count}
          </button>
        </div>

        <h1>Icon List</h1>
        <div className="icon-list" css={iconListStyles}>
          <IconComponents.AlarmIcon color="#F7374F" />
          <IconComponents.BackIcon color="#F7374F" />
          <IconComponents.CheckIconBig color="#F7374F" />
          <IconComponents.CheckIconSmall color="#F7374F" />
          <IconComponents.ErrorIcon color="#F7374F" />
          <IconComponents.ImageIcon color="#F7374F" />
          <IconComponents.InfoIcon color="#F7374F" />
          <IconComponents.KebabIcon color="#F7374F" />
          <IconComponents.ListIcon color="#F7374F" />
          <IconComponents.PlusIcon color="#F7374F" />
          <IconComponents.SearchIcon color="#F7374F" />
          <IconComponents.SendIcon color="#F7374F" />
          <IconComponents.SettingIcon color="#F7374F" />
          <IconComponents.SmileIcon color="#F7374F" />
          <IconComponents.StarIcon color="#F7374F" />
          <IconComponents.TextIcon color="#F7374F" />
          <IconComponents.UploadIcon color="#F7374F" />
          <IconComponents.WarningIcon color="#F7374F" />
          <IconComponents.AttachmentIcon color="#F7374F" />
          <IconComponents.CameraIcon color="#F7374F" />
          <IconComponents.ChatAlertIcon
            color="#F7374F"
            alertCount={10}
            fontSize={12}
          />
          <IconComponents.ChatBoxIcon color="#F7374F" />
          <IconComponents.ChatBubbleIcon color="#F7374F" />
          <IconComponents.CoinIcon color="#F7374F" />
          <IconComponents.HomeIcon color="#F7374F" />
          <IconComponents.MessageIcon color="#F7374F" />
          <IconComponents.NormalPlusIcon color="#F7374F" />
          <IconComponents.UserIcon color="#F7374F" />
          <IconComponents.CloseIcon color="#F7374F" />
        </div>
      </div>
    </>
  )
}

export default App
