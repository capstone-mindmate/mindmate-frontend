import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from './stores/userStore'
import { GoogleOAuthProvider } from '@react-oauth/google'

function App() {
  const queryClient = new QueryClient()
  window.clearUser = useAuthStore.getState().clearUser

  return (
    <GoogleOAuthProvider clientId="886143898358-4cja76nlu7mp5upid042la3k3vovnd8p.apps.googleusercontent.com">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </GoogleOAuthProvider>
  )
}

export default App
