import { createBrowserRouter, useParams } from 'react-router-dom'
import Register from '../pages/Register'
import Devtools from '../pages/Devtools'
import OnboardingPage from '../pages/Onboarding/Onboarding'
import PersonalInformationDocument from '../pages/Register/steps/PersonalInformationDocument'
import Matching from '../pages/Matching'
import ChatTest from '../pages/ChatTest/ChatTest'
import RegisterChatRoom from '../pages/Matching/registerChatRoom'
import MatchedInfo from '../pages/Matching/matchedInfo'
import MatchedApplication from '../pages/Matching/application'
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
    path: '*',
    // element: <div>404 Not Found</div>
    element: <Devtools />,
  },
  {
    path: '/chat-test',
    element: <ChatTest />,
  },
])
