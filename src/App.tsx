import { useState } from 'react'
import './App.css'
import * as IconComponents from './components/icon/iconComponents'
import { GlobalStyles } from '../styles/GlobalStyles'

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
  return (
    <>
      <GlobalStyles />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}
      >
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
