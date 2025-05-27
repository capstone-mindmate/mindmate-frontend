import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { setTokenCookie } from '../../utils/fetchWithRefresh'
import { useAuthStore } from '../../stores/userStore'
import { fetchWithRefresh } from '../../utils/fetchWithRefresh'

const Auth = () => {
  const navigate = useNavigate()
  const { setUser } = useAuthStore()

  useEffect(() => {
    const fetchProfile = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const token = urlParams.get('token')
      const refreshToken = urlParams.get('refreshToken')

      if (token && refreshToken) {
        setTokenCookie(token, 'accessToken')
        setTokenCookie(refreshToken, 'refreshToken')
        try {
          const res = await fetchWithRefresh('http://localhost/api/profiles', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          })
          if (!res.ok) {
            const errorData = await res.json()
            throw new Error(errorData.error)
          }
          const profileData = await res.json()
          setUser(profileData)
          navigate('/home')
        } catch (e: any) {
          if (e?.message === 'PROFILE_NOT_FOUND') {
            navigate('/register')
          } else {
            navigate('/onboarding')
          }
        }
      } else {
        navigate('/onboarding')
      }
    }
    fetchProfile()
  }, [navigate, setUser])

  return (
    <div className="loading-container">
      <p>로그인 중...</p>
    </div>
  )
}

export default Auth
