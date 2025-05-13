/** @jsxImportSource @emotion/react */
import React from 'react'
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
import { media } from '../../styles/breakpoints'
import { useUserStatus } from '../../hooks/useUserStatus'

interface NavItem {
  path: string
  icon: (color: string) => React.ReactNode
  label: string
  showAlert?: boolean
  alertCount?: number
}

const navigationStyle = {
  root: css`
    width: 884px;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0 auto;
    ${media.tablet} {
      width: 100%;
    }
  `,
  container: css`
    width: 100%;
    background: #ffffff;
    boder: none;
    padding: 12px 0;
    z-index: 1000;
    border-radius: 12px 12px 0 0;
    box-shadow: 0px 0px 4px 0px #39211140;
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
    gap: 0px;
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
  const { unreadCount } = useUserStatus()

  // 소켓 연결
  useSocketMessage()

  const navItems: NavItem[] = [
    {
      path: '/home',
      icon: (color) => <HomeIcon color={color} />,
      label: '홈',
    },
    {
      path: '/matching',
      icon: (color) => <AttachmentIcon color={color} />,
      label: '매칭',
    },
    {
      path: '/chat',
      icon: (color) => (
        <div
          css={css`
            position: relative;
          `}
        >
          <ChatBubbleIcon color={color} />
          {unreadCount > 0 && (
            <div css={navigationStyle.alertContainer}>
              <ChatAlertIcon
                width={24}
                height={24}
                alertCount={unreadCount}
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
      path: '/mypage',
      icon: (color) => <UserIcon color={color} />,
      label: '마이페이지',
    },
  ]

  return (
    <div css={navigationStyle.root}>
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
    </div>
  )
}

export default NavigationComponent
