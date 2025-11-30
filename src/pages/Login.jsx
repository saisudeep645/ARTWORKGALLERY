import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import accountDB from '../utils/accountDatabase'
import './Login.css'

function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [showOTP, setShowOTP] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [generatedOTP, setGeneratedOTP] = useState('')
  const [tempUser, setTempUser] = useState(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    return otp
  }

  const handleOTPChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOTP = [...otp]
      newOTP[index] = value
      setOtp(newOTP)
      
      // Auto-focus next input
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus()
      }
    }
  }

  const handleOTPKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    try {
      // Login using account database
      const user = accountDB.auth.login(formData.email, formData.password)
      
      // Generate and show OTP
      const newOTP = generateOTP()
      setGeneratedOTP(newOTP)
      setTempUser(user)
      setShowOTP(true)
      
      // Show OTP in console/alert for demo purposes
      alert(`Your OTP is: ${newOTP}\n\n(In production, this would be sent via email/SMS)`)
      
    } catch (err) {
      setError(err.message)
    }
  }

  const handleVerifyOTP = (e) => {
    e.preventDefault()
    setError('')
    
    const enteredOTP = otp.join('')
    
    if (enteredOTP === generatedOTP) {
      // OTP verified successfully
      console.log('Login - User being stored:', tempUser)
      localStorage.setItem('user', JSON.stringify(tempUser))
      
      // Verify it was stored correctly
      const stored = localStorage.getItem('user')
      console.log('Login - Verified stored user:', JSON.parse(stored))
      
      // Navigate based on role
      if (tempUser.role === 'admin') {
        navigate('/admin')
      } else if (tempUser.role === 'artist') {
        navigate('/artist-dashboard')
      } else if (tempUser.role === 'curator') {
        navigate('/curator-dashboard')
      } else {
        navigate('/')
      }
    } else {
      setError('Invalid OTP. Please try again.')
      setOtp(['', '', '', '', '', ''])
      document.getElementById('otp-0').focus()
    }
  }

  const handleResendOTP = () => {
    const newOTP = generateOTP()
    setGeneratedOTP(newOTP)
    setOtp(['', '', '', '', '', ''])
    setError('')
    alert(`New OTP sent: ${newOTP}\n\n(In production, this would be sent via email/SMS)`)
    document.getElementById('otp-0').focus()
  }

  const handleBackToLogin = () => {
    setShowOTP(false)
    setOtp(['', '', '', '', '', ''])
    setGeneratedOTP('')
    setTempUser(null)
    setError('')
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          {!showOTP ? (
            <>
              <h1>Welcome Back</h1>
              <p className="login-subtitle">Sign in to your account</p>

              {error && <div className="error-message">{error}</div>}

              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                  />
                  <span className="input-icon">📧</span>
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
                    placeholder="Enter your password"
                  />
                  <span className="input-icon">🔒</span>
                </div>

                <div className="form-footer">
                  <label className="remember-me">
                    <input type="checkbox" />
                    <span>Remember me</span>
                  </label>
                  <a href="#" className="forgot-password">Forgot password?</a>
                </div>

                <button type="submit" className="btn btn-primary btn-large btn-full">
                  Sign In →
                </button>
              </form>

              <div className="demo-credentials">
                <p><strong>Demo Credentials:</strong></p>
                <p>Admin: admin@gallery.com / admin123</p>
                <p>Artist: artist@gallery.com / artist123</p>
                <p>Curator: curator@gallery.com / curator123</p>
                <p>User: any email / any password (6+ chars)</p>
              </div>

              <div className="signup-link">
                Don't have an account? <Link to="/register">Sign Up</Link>
              </div>
            </>
          ) : (
            <>
              <h1>Verify OTP</h1>
              <p className="login-subtitle">Enter the 6-digit code sent to {formData.email}</p>

              {error && <div className="error-message">{error}</div>}

              <form onSubmit={handleVerifyOTP} className="otp-form">
                <div className="otp-inputs">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOTPChange(index, e.target.value)}
                      onKeyDown={(e) => handleOTPKeyDown(index, e)}
                      className="otp-input"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                <button type="submit" className="btn btn-primary btn-large btn-full">
                  Verify OTP
                </button>

                <div className="otp-actions">
                  <button type="button" onClick={handleResendOTP} className="resend-otp">
                    Resend OTP
                  </button>
                  <button type="button" onClick={handleBackToLogin} className="back-to-login">
                    Back to Login
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login
