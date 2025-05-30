import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ToastProvider from './components/toast/ToastProvider.tsx'
import { GlobalStyles } from '../styles/GlobalStyles.tsx'

createRoot(document.getElementById('root')!).render(
  <>
    <GlobalStyles />
    <ToastProvider>
      <App />
    </ToastProvider>
  </>
)
