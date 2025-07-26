import { useState } from 'react'
import Login from './Login'
import Register from './Register'

const AuthContainer = ({ onLogin, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true)

  const handleSwitchToRegister = () => {
    setIsLogin(false)
  }

  const handleSwitchToLogin = () => {
    setIsLogin(true)
  }

  const handleLogin = (user) => {
    onLogin(user)
  }

  const handleRegister = (user) => {
    onRegister(user)
  }

  return (
    <div className="auth-container">
      {isLogin ? (
        <Login 
          onLogin={handleLogin}
          onSwitchToRegister={handleSwitchToRegister}
        />
      ) : (
        <Register 
          onRegister={handleRegister}
          onSwitchToLogin={handleSwitchToLogin}
        />
      )}
    </div>
  )
}

export default AuthContainer 