import { useState } from 'react'

const Register = ({ onRegister, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('') // Clear error when user types
  }

  const validateForm = () => {
    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters long')
      return false
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return false
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Get stored users
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]')
      
      // Check if username already exists
      const existingUser = storedUsers.find(u => u.username === formData.username)
      
      if (existingUser) {
        setError('Username already exists. Please choose a different one.')
        return
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        username: formData.username,
        password: formData.password,
        createdAt: new Date().toISOString()
      }

      // Add user to storage
      storedUsers.push(newUser)
      localStorage.setItem('users', JSON.stringify(storedUsers))

      // Initialize user's expenses storage
      localStorage.setItem(`expenses_${newUser.id}`, JSON.stringify([]))

      // Remove password from user object before storing in session
      const { password, ...userWithoutPassword } = newUser
      onRegister(userWithoutPassword)
      
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-form">
      <h3>Register</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="Choose a username"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Choose a password"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Confirm your password"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Creating account...' : 'Register'}
        </button>
      </form>

      <div className="auth-switch">
        <p>
          Already have an account?{' '}
          <button 
            type="button" 
            className="link-btn"
            onClick={onSwitchToLogin}
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  )
}

export default Register 