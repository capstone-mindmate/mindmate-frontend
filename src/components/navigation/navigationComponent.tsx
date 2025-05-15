/** @jsxImportSource @emotion/react */
import React, { useEffect, useState, useCallback, useRef } from 'react'
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

  // 읽지 않은 메시지 수 상태
  const [unreadCount, setUnreadCount] = useState(0)
  const [isFirstLoad, setIsFirstLoad] = useState(true) // 첫 로딩 상태
  const previousUnreadCountRef = useRef<number>(0) // 이전 값 저장용 ref

  // 전체 읽지 않은 메시지 수 가져오기
  const { totalUnreadCount } = useMessageStore()

  // 소켓 연결 - 초기화된 소켓 클라이언트 가져오기
  const { stompClient, isConnected, fetchTotalUnreadCount } = useSocketMessage()

  // 안정화된 상태 업데이트 함수
  const updateUnreadCount = useCallback(
    (newCount: number) => {
      setUnreadCount((prevCount) => {
        // 첫 로딩 시 또는 확실한 증가가 있을 때만 업데이트
        if (isFirstLoad && newCount > 0) {
          setIsFirstLoad(false)
          previousUnreadCountRef.current = newCount
          return newCount
        }

        // 이전 값과 새 값 사이에 큰 차이(30% 이상)가 있을 때만 업데이트
        // 또는 새 값이 0이 아니고 이전 값보다 크면 업데이트
        if (
          Math.abs(prevCount - newCount) / Math.max(prevCount, 1) > 0.3 ||
          (newCount > 0 && newCount > prevCount)
        ) {
          previousUnreadCountRef.current = newCount
          return newCount
        }

        // 새 값이 0이고 이전 값도 0이면 업데이트
        if (newCount === 0 && prevCount === 0) {
          previousUnreadCountRef.current = 0
          return 0
        }

        // 그 외의 경우, 특히 새 값이 0이고 이전 값이 0이 아니면 이전 값 유지
        return prevCount
      })
    },
    [isFirstLoad]
  )

  // 커스텀 이벤트를 통한 읽지 않은 메시지 수 업데이트
  useEffect(() => {
    const handleUnreadCountUpdate = (e: CustomEvent) => {
      const { count } = e.detail as { count: number }
      // console.log('네비게이션: 이벤트로 읽지 않은 메시지 수 업데이트', count)
      updateUnreadCount(count)
    }

    // 이벤트 리스너 등록
    window.addEventListener(
      'unread-count-updated',
      handleUnreadCountUpdate as EventListener
    )

    return () => {
      window.removeEventListener(
        'unread-count-updated',
        handleUnreadCountUpdate as EventListener
      )
    }
  }, [updateUnreadCount])

  // 경로 변경 시 읽지 않은 메시지 수 갱신 - 추가 확인 로직 적용
  useEffect(() => {
    // 페이지 이동이 실제로 다른 경로로 이동한 경우에만 요청
    const currentPath = location.pathname

    // 채팅 관련 페이지에서 나갈 때만 요청 (채팅 페이지에서는 별도로 처리)
    const isChatPage = currentPath.includes('/chat')
    const wasChatPage = location.pathname.includes('/chat')

    if (!isChatPage && wasChatPage && isConnected) {
      // console.log('네비게이션: 채팅 페이지에서 나감, 읽지 않은 메시지 수 요청')
      fetchTotalUnreadCount(true) // 강제 업데이트
    }
  }, [location.pathname, isConnected, fetchTotalUnreadCount])

  // 초기 로드 및 소켓 연결 시 구독 - 한 번만 실행되도록 의존성 배열 최적화
  useEffect(() => {
    if (!stompClient || !isConnected) return

    // console.log('네비게이션: 소켓 연결됨, 초기 읽지 않은 메시지 수 요청')
    // 최초 한 번만 요청하도록 스톰프 클라이언트와 연결 상태를 의존성으로 설정
    // 강제 업데이트 옵션 추가
    fetchTotalUnreadCount(true)
  }, [stompClient, isConnected, fetchTotalUnreadCount])

  // totalUnreadCount가 업데이트되면 동기화
  useEffect(() => {
    // 최초 한 번 실행 시에만 콘솔 출력
    // console.log('네비게이션: totalUnreadCount 업데이트됨', totalUnreadCount)

    // 값이 0이 아닌 경우에만 업데이트 (초기값 또는 오류 방지)
    if (totalUnreadCount !== undefined && totalUnreadCount > 0) {
      // console.log('네비게이션: 읽지 않은 메시지 수 업데이트', totalUnreadCount)
      updateUnreadCount(totalUnreadCount)
    } else if (totalUnreadCount === 0 && !isFirstLoad) {
      // 첫 로딩이 아닐 때만 0으로 설정 (플리커링 방지)
      // console.log('네비게이션: 읽지 않은 메시지 수 0으로 설정')
      updateUnreadCount(0)
    }
  }, [totalUnreadCount, updateUnreadCount, isFirstLoad])

  // 페이지 로드 시 한 번 강제 요청
  useEffect(() => {
    if (isConnected) {
      // console.log(
      //   '네비게이션: 컴포넌트 마운트 시 읽지 않은 메시지 수 강제 요청'
      // )
      fetchTotalUnreadCount(true)
    }
  }, [isConnected, fetchTotalUnreadCount])

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
