/** @jsxImportSource @emotion/react */
import { useState, useEffect, useRef } from 'react'

import { RootContainer, ChatContainer, LogoText } from './styles/rootStyles'

import TopBar from '../../components/topbar/Topbar'

interface ChatHomeProps {
  matchId: string
}

const ChatHome = ({ matchId }: ChatHomeProps) => {
  return (
    <RootContainer>
      <TopBar
        leftContent={<LogoText>채팅</LogoText>}
        showBorder={false}
        isFixed={true}
      />
      <ChatContainer></ChatContainer>
    </RootContainer>
  )
}

export default ChatHome
