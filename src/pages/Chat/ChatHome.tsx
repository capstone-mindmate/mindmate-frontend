/** @jsxImportSource @emotion/react */
import { useState, useEffect, useRef } from 'react'

import { RootContainer, ChatContainer, LogoText } from './styles/rootStyles'

import TopBar from '../../components/topbar/Topbar'
import NavigationComponent from '../../components/navigation/navigationComponent'

interface ChatHomeProps {}

const ChatHome = ({}: ChatHomeProps) => {
  return (
    <RootContainer>
      <TopBar
        leftContent={<LogoText>채팅</LogoText>}
        showBorder={false}
        isFixed={true}
      />
      <ChatContainer></ChatContainer>
      <NavigationComponent />
    </RootContainer>
  )
}

export default ChatHome
