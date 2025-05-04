import { createBrowserRouter, useParams } from 'react-router-dom'
import Register from '../pages/Register'
import Devtools from '../pages/Devtools'
import OnboardingPage from '../pages/Onboarding/Onboarding'
import PersonalInformationDocument from '../pages/Register/steps/PersonalInformationDocument'
import Matching from '../pages/Matching'
import HomePage from '../pages/Home/Home.tsx'
import MyPage from '../pages/Mypage/Mypage.tsx'
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

import ChatHome from '../pages/Chat/ChatHome'

export const router = createBrowserRouter([
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
    path: '/withdraw',
    element: <WithdrawMindMate />,
  },
  {
    path: '/devdev',
    element: <Devtools />,
  },
  {
    path: '/onboarding',
    element: <OnboardingPage />,
  },
  {
    path: '/matching',
    element: <Matching />,
  },
  {
    path: '/home',
    element: <HomePage />,
  },
  {
    path: '/mypage',
    element: <MyPage />,
  },
  {
    path: '/detailreview',
    element: <DetailReviewPage />,
  },
  {
    path: '/matching/register',
    element: <RegisterChatRoom />,
  },
  {
    path: '/matching/matched',
    element: <MatchedInfo />,
  },
  {
    path: '/matching/application',
    element: <MatchedApplication />,
  },
  {
    path: '/chat/:matchId',
    element: <ChatHomeWrapper />,
  },
  {
    path: '/emoticons',
    element: <EmoticonHome />,
  },
  {
    path: '/coin',
    element: <PointPurchase />,
  },
  {
    path: '/coin/history',
    element: <PointHistory />,
  },
  {
    path: '/coin/success',
    element: <PurchaseSuccess />,
  },
  {
    path: '/coin/fail',
    element: <PurchaseFail />,
  },
  {
    path: '/chat-test',
    element: <ChatTest />,
  },
  {
    path: '/review',
    element: <Review />,
  },
  {
    path: '/profile/setting',
    element: <ProfileSetting />,
  },
  {
    path: '/profile/edit',
    element: <ProfileEdit />,
  },
  {
    path: '*',
    element: <div>404 Not Found</div>,
  },
  {
    path: '/report',
    element: <Report />,
  },
])

function ChatHomeWrapper() {
  const { matchId } = useParams()
  if (!matchId) return <div>: )</div>
  return <ChatHome matchId={matchId} />
}
