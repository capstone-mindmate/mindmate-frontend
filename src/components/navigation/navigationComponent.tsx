import React from 'react'
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Link, useLocation } from 'react-router-dom'
import {
  HomeIcon,
  ChatBubbleIcon,
  UserIcon,
  AttachmentIcon,
  ChatAlertIcon,
} from '../icon/iconComponents'
import { useMessageStore } from '../../store/messageStore'
import { useSocketMessage } from '../../hooks/useSocketMessage'

interface NavItem {
  path: string
  icon: (color: string) => React.ReactNode
  label: string
  showAlert?: boolean
  alertCount?: number
}

const navigationStyle = {
  container: css`
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #ffffff;
    border-top: 1px solid #eaeaea;
    padding: 12px 0;
    z-index: 1000;
  `,
  nav: css`
    display: flex;
    justify-content: space-around;
    align-items: center;
    max-width: 500px;
    margin: 0 auto;
  `,
  item: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-decoration: none;
    color: #d9d9d9;
    gap: 4px;
    position: relative;
  `,
  label: css`
    font-size: 12px;
    margin-top: 4px;
  `,
  active: css`
    color: #392111;
  `,
  alertContainer: css`
    position: absolute;
    top: -8px;
    right: -8px;
  `,
}

const NavigationComponent: React.FC = () => {
  const location = useLocation()
  const unreadCount = useMessageStore((state) => state.unreadCount)

  // 소켓 연결
  useSocketMessage()

  const navItems: NavItem[] = [
    {
      path: '/',
      icon: (color) => <HomeIcon color={color} />,
      label: '홈',
    },
    {
      path: '/나중에 정하기',
      icon: (color) => <AttachmentIcon color={color} />,
      label: '매칭',
    },
    {
      path: '/나중에 정하기',
      icon: (color) => (
        <div
          css={css`
            position: relative;
          `}
        >
          <ChatBubbleIcon color={color} />
          {unreadCount > 0 || ( // 소켓 연결되면 &&(and)로 바꾸기
            <div css={navigationStyle.alertContainer}>
              <ChatAlertIcon
                width={24}
                height={24}
                alertCount={12} //  alertCount={unreadCount} 소켓 연결되면 이걸로
                fontSize={12}
              />
            </div>
          )}
        </div>
      ),
      label: '채팅',
      showAlert: true,
      alertCount: unreadCount,
    },
    {
      path: '/나중에 정하기',
      icon: (color) => <UserIcon color={color} />,
      label: '마이페이지',
    },
  ]

  return (
    <div css={navigationStyle.container}>
      <nav css={navigationStyle.nav}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          const color = isActive ? '#392111' : '#D9D9D9'

          return (
            <Link
              key={item.path}
              to={item.path}
              css={[navigationStyle.item, isActive && navigationStyle.active]}
            >
              {item.icon(color)}
              <span css={navigationStyle.label}>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default NavigationComponent
