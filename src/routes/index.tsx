import Register from '../pages/Register'
import Devtools from '../pages/Devtools'
import OnboardingPage from '../pages/Onboarding/Onboarding'
import PersonalInformationDocument from '../pages/Register/steps/PersonalInformationDocument'
import Matching from '../pages/Matching'
import HomePage from '../pages/Home/Home.tsx'
import MyPage from '../pages/Mypage/Mypage.tsx'
import Notification from '../pages/Home/NotificationPage.tsx'
import MagazineList from '../pages/Magazine/MagazineList.tsx'
import MagazineWrite from '../pages/Magazine/MagazineWrite.tsx'
import Magazine from '../pages/Magazine/Magazine.tsx'
import MyList from '../pages/Magazine/MyList.tsx'

import DetailReviewPage from '../pages/Mypage/DetailReviewPage.tsx'
import Report from '../pages/Mypage/ReportPage.tsx'

import RegisterChatRoom from '../pages/Matching/registerChatRoom'
import MatchedInfo from '../pages/Matching/matchedInfo'
import MatchedApplication from '../pages/Matching/application'
import EmoticonHome from '../pages/Emoticons/emoticonHome'
import PointPurchase from '../pages/Emoticons/pointPurchase'
import PointHistory from '../pages/Emoticons/pointHistory'
import PurchaseSuccess from '../pages/Emoticons/purchaseSuccess'
import PurchaseFail from '../pages/Emoticons/purchaseFail'
import ProfileSetting from '../pages/Profile/ProfileSetting.tsx'
import ProfileEdit from '../pages/Profile/ProfileEdit.tsx'
import ChatTest from '../pages/ChatTest/ChatTest'
import TermsOfUse from '../pages/Register/steps/TermsOfUse'
import WithdrawMindMate from '../pages/Profile/WithdrawMindMate'
import CustomFormMake from '../pages/Chat/CustomFormMake'
import CustomFormView from '../pages/Chat/CustomFormView'

import ChatHome from '../pages/Chat/ChatHome'
import ChatRoom from '../pages/Chat/ChatRoom'
import { useAuthStore } from '../stores/userStore'
import { useEffect, useState } from 'react'
import {
  useNavigate,
  Navigate,
  useParams,
  useLocation,
  createBrowserRouter,
} from 'react-router-dom'
import { useSocketMessage } from '../hooks/useSocketMessage'
import CustomFormDone from '../pages/Chat/CustomFormDone'
import ReviewPage from '../pages/Review/ReviewPage'

// 경로별 컴포넌트 렌더링을 위한 헬퍼 함수
const ChatRoomRoute = () => {
  const { id } = useParams()
  return <ChatRoom chatId={id} />
}

const CustomFormMakeRoute = () => {
  const { matchId } = useParams()
  return <CustomFormMake matchId={matchId} />
}

const CustomFormDoneRoute = () => {
  const { formId, matchId: matchIdFromParams } = useParams()
  const location = useLocation()
  const matchIdFromState = location.state?.matchingId
  const matchId = matchIdFromParams || matchIdFromState
  return <CustomFormDone formId={formId} matchId={matchId} />
}

const CustomFormViewRoute = () => {
  const { formId, matchId: matchIdFromParams } = useParams()
  const location = useLocation()
  const matchIdFromState = location.state?.matchingId
  const matchId = matchIdFromParams || matchIdFromState
  return <CustomFormView formId={formId} matchId={matchId} />
}

const NotFound = () => {
  const location = useLocation()

  if (location.pathname.startsWith('/api')) {
    return null
  }

  return <div>404 Not Found</div>
}

const ReportRoute = () => {
  return <Report />
}

const ChatReportRoute = () => {
  return <Report />
}

// 프로필 신고를 위한 새로운 Route 컴포넌트 추가
const ProfileReportRoute = () => {
  return <Report />
}

const ReviewRoute = () => {
  const { chatId } = useParams()
  const location = useLocation()
  const opponentName = location.state?.opponentName
  return <ReviewPage chatId={chatId} opponentName={opponentName} />
}

// 전역 인증 여부 추적
let socketInitialized = false

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, hydrated, setUser } = useAuthStore()
  const navigate = useNavigate()

  // 웹소켓 연결 - 한 번만 초기화하도록 상태 관리
  const { isConnected } = useSocketMessage()
  const [initializing, setInitializing] = useState(!socketInitialized)

  // 웹소켓 초기화 완료 추적
  useEffect(() => {
    if (isConnected && initializing) {
      socketInitialized = true
      setInitializing(false)
    }
  }, [isConnected, initializing])

  // hydration 후 user가 null이고 localStorage에 user가 있으면 복원 시도 (임시)
  useEffect(() => {
    if (hydrated && !user) {
      const raw = localStorage.getItem('auth-store')
      if (raw) {
        try {
          const parsed = JSON.parse(raw)
          if (parsed.state?.user) {
            setUser(parsed.state.user)
          } else {
            navigate('/onboarding', { replace: true })
          }
        } catch (e) {
          navigate('/onboarding', { replace: true })
        }
      } else {
        navigate('/onboarding', { replace: true })
      }
    }
  }, [hydrated, user, navigate, setUser])

  if (!hydrated) {
    return null
  }

  // 인증 확인
  if (!user) {
    return <Navigate to="/onboarding" replace />
  }

  return <>{children}</>
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/home" replace />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/register/privacy',
    element: <PersonalInformationDocument />,
  },
  {
    path: '/privacy',
    element: <PersonalInformationDocument />,
  },
  {
    path: '/terms',
    element: <TermsOfUse />,
  },
  {
    path: '/onboarding',
    element: <OnboardingPage />,
  },
  {
    path: '/withdraw',
    element: (
      <RequireAuth>
        <WithdrawMindMate />
      </RequireAuth>
    ),
  },
  {
    path: '/devdev',
    element: (
      <RequireAuth>
        <Devtools />
      </RequireAuth>
    ),
  },
  {
    path: '/matching',
    element: (
      <RequireAuth>
        <Matching />
      </RequireAuth>
    ),
  },
  {
    path: '/home',
    element: (
      <RequireAuth>
        <HomePage />
      </RequireAuth>
    ),
  },
  {
    path: '/mypage',
    element: (
      <RequireAuth>
        <MyPage />
      </RequireAuth>
    ),
  },
  {
    path: '/mypage/:userId',
    element: (
      <RequireAuth>
        <MyPage />
      </RequireAuth>
    ),
  },
  {
    path: '/detailreview',
    element: (
      <RequireAuth>
        <DetailReviewPage />
      </RequireAuth>
    ),
  },
  {
    path: '/matching/register',
    element: (
      <RequireAuth>
        <RegisterChatRoom />
      </RequireAuth>
    ),
  },
  {
    path: '/matching/matched',
    element: (
      <RequireAuth>
        <MatchedInfo />
      </RequireAuth>
    ),
  },
  {
    path: '/matching/application',
    element: (
      <RequireAuth>
        <MatchedApplication />
      </RequireAuth>
    ),
  },
  {
    path: '/chat',
    element: (
      <RequireAuth>
        <ChatHome />
      </RequireAuth>
    ),
  },
  {
    path: '/chat/:id',
    element: (
      <RequireAuth>
        <ChatRoomRoute />
      </RequireAuth>
    ),
  },
  {
    path: '/chat/custom-form/make/:matchId',
    element: (
      <RequireAuth>
        <CustomFormMakeRoute />
      </RequireAuth>
    ),
  },
  {
    path: '/chat/custom-form/view/:formId/:matchId',
    element: (
      <RequireAuth>
        <CustomFormViewRoute />
      </RequireAuth>
    ),
  },
  {
    path: '/chat/custom-form/done/:formId/:matchId',
    element: (
      <RequireAuth>
        <CustomFormDoneRoute />
      </RequireAuth>
    ),
  },
  {
    path: '/emoticons',
    element: (
      <RequireAuth>
        <EmoticonHome />
      </RequireAuth>
    ),
  },
  {
    path: '/coin',
    element: (
      <RequireAuth>
        <PointPurchase />
      </RequireAuth>
    ),
  },
  {
    path: '/coin/history',
    element: (
      <RequireAuth>
        <PointHistory />
      </RequireAuth>
    ),
  },
  {
    path: '/coin/success',
    element: (
      <RequireAuth>
        <PurchaseSuccess />
      </RequireAuth>
    ),
  },
  {
    path: '/coin/fail',
    element: (
      <RequireAuth>
        <PurchaseFail />
      </RequireAuth>
    ),
  },
  {
    path: '/chat-test',
    element: (
      <RequireAuth>
        <ChatTest />
      </RequireAuth>
    ),
  },
  {
    path: '/review/:chatId',
    element: (
      <RequireAuth>
        <ReviewRoute />
      </RequireAuth>
    ),
  },
  {
    path: '/profile/setting',
    element: (
      <RequireAuth>
        <ProfileSetting />
      </RequireAuth>
    ),
  },
  {
    path: '/profile/edit',
    element: (
      <RequireAuth>
        <ProfileEdit />
      </RequireAuth>
    ),
  },
  {
    path: '/report/:reportedUserId/:targetUserId/:fromPage',
    element: (
      <RequireAuth>
        <ReportRoute />
      </RequireAuth>
    ),
  },
  {
    path: '/chat/:chatId/report/:reportedUserId/:targetUserId',
    element: (
      <RequireAuth>
        <ChatReportRoute />
      </RequireAuth>
    ),
  },
  {
    path: '/profile/:profileId/report/:reportedUserId/:targetUserId',
    element: (
      <RequireAuth>
        <ProfileReportRoute />
      </RequireAuth>
    ),
  },
  {
    path: '/magazinelist',
    element: (
      <RequireAuth>
        <MagazineList />
      </RequireAuth>
    ),
  },
  {
    path: '/magazine/write',
    element: (
      <RequireAuth>
        <MagazineWrite />
      </RequireAuth>
    ),
  },
  {
    path: '/magazine/:id',
    element: (
      <RequireAuth>
        <Magazine />
      </RequireAuth>
    ),
  },
  {
    path: '/magazine/mylist',
    element: (
      <RequireAuth>
        <MyList />
      </RequireAuth>
    ),
  },
  {
    path: '*',
    element: <NotFound />,
  },
  {
    path: '/notification',
    element: (
      <RequireAuth>
        <Notification />
      </RequireAuth>
    ),
  },
])
