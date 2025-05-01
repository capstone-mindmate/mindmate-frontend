import { createBrowserRouter, useParams } from 'react-router-dom'
import Register from '../pages/Register'
import Devtools from '../pages/Devtools'
import ChatTest from '../pages/ChatTest/ChatTest'
import OnboardingPage from '../pages/Onboarding/Onboarding'
import PersonalInformationDocument from '../pages/Register/steps/PersonalInformationDocument'
import Matching from '../pages/Matching'
import HomePage from '../pages/Home/Home.tsx'
import ChatTest from '../pages/ChatTest/ChatTest'
import RegisterChatRoom from '../pages/Matching/registerChatRoom'
import MatchedInfo from '../pages/Matching/matchedInfo'
import MatchedApplication from '../pages/Matching/application'
import EmoticonHome from '../pages/Emoticons/emoticonHome'
import PointPurchase from '../pages/Emoticons/pointPurchase'
import PointHistory from '../pages/Emoticons/pointHistory'
import PurchaseSuccess from '../pages/Emoticons/purchaseSuccess'
import PurchaseFail from '../pages/Emoticons/purchaseFail'

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
    path: '*',
    // element: <div>404 Not Found</div>
    element: <Devtools />,
  },
  {
    path: '/chat-test',
    element: <ChatTest />,
  },
])
