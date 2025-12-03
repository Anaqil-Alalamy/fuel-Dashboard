import { useState } from 'react'
import '../styles/login.css'

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (!email || !password) {
        throw new Error('Please enter both email and password')
      }

      const validUsername = 'Hamdey'
      const validPassword = '123456'

      if (email !== validUsername && email !== validUsername.toLowerCase()) {
        throw new Error('Invalid username or password')
      }

      if (password !== validPassword) {
        throw new Error('Invalid username or password')
      }

      console.log('Login successful:', { email, rememberMe })
      await new Promise(resolve => setTimeout(resolve, 1500))

      if (onLoginSuccess) {
        onLoginSuccess()
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-section">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2Fabc8ab05f7d144f289a582747d3e5ca3%2F0b324f888a424c8eafb46b5a1298f5b4?format=webp&width=800"
            alt="Company Logo"
            className="logo-image"
          />
        </div>

        <div className="form-header">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to your account</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-options">
            <label className="remember-checkbox">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
            <a href="#" className="forgot-password-link">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="signup-section">
          <p className="signup-text">
            Don't have an account?{' '}
            <a href="#" className="signup-link">
              Sign Up
            </a>
          </p>
        </div>
      </div>

      <div className="login-background-accent"></div>
    </div>
  )
}
