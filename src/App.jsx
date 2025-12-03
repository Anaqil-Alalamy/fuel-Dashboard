import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn')
    if (loggedIn === 'true') {
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true')
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    setIsLoggedIn(false)
  }

  return isLoggedIn ? (
    <Dashboard onLogout={handleLogout} />
  ) : (
    <Login onLoginSuccess={handleLogin} />
  )
}

export default App
