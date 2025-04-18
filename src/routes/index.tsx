import { createBrowserRouter } from 'react-router-dom'
import Register from '../pages/Register'
import Devtools from '../pages/Devtools'
import ChatTest from '../pages/ChatTest/ChatTest'

export const router = createBrowserRouter([
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/devdev',
    element: <Devtools />,
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
