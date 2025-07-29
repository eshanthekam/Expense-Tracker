import { useState, useEffect } from 'react'
import { onAuthStateChange, logoutUser } from './firebase/auth'
import { testFirebaseConnection } from './firebase/test'
import AuthContainer from './components/auth/AuthContainer'
import Dashboard from './components/dashboard/Dashboard'
import ThemeToggle from './components/common/ThemeToggle'
import './App.css'

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Test Firebase connection first
    testFirebaseConnection().then(result => {
      if (!result.success) {
        console.error('Firebase connection failed:', result.error)
        alert(`Firebase connection failed: ${result.error}`)
      }
    })

    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChange((user) => {
      setCurrentUser(user)
      setIsLoading(false)
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  const handleLogin = (user) => {
    setCurrentUser(user)
  }

  const handleRegister = (user) => {
    setCurrentUser(user)
  }

  const handleLogout = async () => {
    const result = await logoutUser()
    if (result.success) {
      setCurrentUser(null)
    } else {
      alert('Error logging out: ' + result.error)
    }
  }

  if (isLoading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Expense Tracker</h1>
        <div className="header-controls">
          <ThemeToggle />
          {currentUser && (
            <div className="user-info">
              <span>Welcome, {currentUser.email}!</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          )}
        </div>
      </header>
      
      <main className="app-main">
        {!currentUser ? (
          <AuthContainer 
            onLogin={handleLogin}
            onRegister={handleRegister}
          />
        ) : (
          <Dashboard user={currentUser} />
        )}
      </main>
    </div>
  )
}

export default App
