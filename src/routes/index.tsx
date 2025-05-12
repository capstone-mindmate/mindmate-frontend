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
    path: '/chat',
    element: <ChatHome />,
  },
  {
    path: '/chat/:id',
    element: <ChatRoomRoute />,
  },
  {
    path: '/chat/custom-form/make/:id',
    element: <CustomFormMakeRoute />,
  },
  {
    path: '/chat/custom-form/view/:id',
    element: <CustomFormViewRoute />,
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
    path: '/magazinelist',
    element: <MagazineList />,
  },
  {
    path: '/magazine/write',
    element: <MagazineWrite />,
  },
  {
    path: '/magazine',
    element: <Magazine />,
  },
  {
    path: '/magazine/mylist',
    element: <MyList />,
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
