import { createBrowserRouter } from 'react-router-dom'
import Register from '../pages/Register'
import Devtools from '../pages/Devtools'
import OnboardingPage from '../pages/Onboarding/Onboarding'
import PersonalInformationDocument from '../pages/Register/steps/PersonalInformationDocument'
import Matching from '../pages/Matching'
import HomePage from '../pages/Home/Home.tsx'
import MyPage from '../pages/Mypage/Mypage.tsx'
import Notification from '../pages/Home/NotificationPage.tsx'
import Review from '../pages/Review/ReviewPage.tsx'

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
import { useEffect } from 'react'
import { useNavigate, Navigate, useParams } from 'react-router-dom'

const ChatRoomRoute = () => {
  const { id } = useParams()
  return <ChatRoom chatId={id} />
}

const CustomFormMakeRoute = () => {
  const { id } = useParams()
  return <CustomFormMake matchId={id} />
}

const CustomFormViewRoute = () => {
  const { id } = useParams()
  return <CustomFormView matchId={id} />
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, hydrated, setUser } = useAuthStore()
  const navigate = useNavigate()

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

  if (!user) {
    return <Navigate to="/onboarding" replace />
  }
  return <>{children}</>
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <OnboardingPage />,
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
    path: '/chat/custom-form/make/:id',
    element: (
      <RequireAuth>
        <CustomFormMakeRoute />
      </RequireAuth>
    ),
  },
  {
    path: '/chat/custom-form/view/:id',
    element: (
      <RequireAuth>
        <CustomFormViewRoute />
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
    path: '/review',
    element: (
      <RequireAuth>
        <Review />
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
    path: '/report',
    element: (
      <RequireAuth>
        <Report />
      </RequireAuth>
    ),
  },
  {
    path: '*',
    element: <div>404 Not Found</div>,
  },
  {
    path: '/report',
    element: <Report />,
  },
  {
    path: '/notification',
    element: <Notification />,
  },
])
