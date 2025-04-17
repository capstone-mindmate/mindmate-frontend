import { createBrowserRouter } from 'react-router-dom'
import Register from '../pages/Register'
import Devtools from '../pages/Devtools'
import OnboardingPage from '../pages/Onboarding/Onboarding'
import PersonalInformationDocument from '../pages/Register/steps/PersonalInformationDocument'
import Matching from '../pages/Matching'
import HomePage from '../pages/Home/Home.tsx'

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
    path: '*',
    // element: <div>404 Not Found</div>
    element: <Devtools />,
  },
])
