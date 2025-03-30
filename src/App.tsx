import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useToast } from './components/Toast/ToastProvider.tsx'

function App() {
  const [count, setCount] = useState(0)
  const { showToast } = useToast()

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button
          onClick={() => {
            setCount((count) => count + 1)
            if (count % 4 === 0) {
              showToast('카운트가 증가했습니다!', 'success')
            } else if (count % 4 === 1) {
              showToast('아주대학교 이메일을 입력해주세요', 'info')
            } else if (count % 4 === 2) {
              showToast('네트워크 연결을 확인해주세요', 'warning')
            } else {
              showToast('전송에 실패했습니다', 'error')
            }
          }}
        >
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
