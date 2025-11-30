import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import accountDB from '../utils/accountDatabase'
import './Register.css'

function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  })
  const [error, setError] = useState('')
  const [showOTP, setShowOTP] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [generatedOTP, setGeneratedOTP] = useState('')
  const [tempUserData, setTempUserData] = useState(null)

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

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    try {
      // Check if email already exists
      const existingUser = accountDB.accounts.getByEmail(formData.email)
      if (existingUser) {
        setError('Email already registered')
        return
      }

      // Store form data temporarily and show OTP
      setTempUserData(formData)
      const newOTP = generateOTP()
      setGeneratedOTP(newOTP)
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
      try {
        // OTP verified - complete registration
        const newUser = accountDB.auth.register({
          name: tempUserData.name,
          email: tempUserData.email,
          password: tempUserData.password,
          role: tempUserData.role
        })
        
        console.log('Registration - Created User:', newUser)
        
        // Store in localStorage for compatibility
        localStorage.setItem('user', JSON.stringify(newUser))
        
        alert('Registration successful! You are now logged in.')
        
        // Navigate based on role
        if (newUser.role === 'admin') {
          navigate('/admin')
        } else if (newUser.role === 'artist') {
          navigate('/artist-dashboard')
        } else if (newUser.role === 'curator') {
          navigate('/curator-dashboard')
        } else {
          navigate('/')
        }
      } catch (err) {
        setError(err.message)
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

  const handleBackToRegister = () => {
    setShowOTP(false)
    setOtp(['', '', '', '', '', ''])
    setGeneratedOTP('')
    setTempUserData(null)
    setError('')
  }

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-card">
          {!showOTP ? (
            <>
              <h1>Create Account</h1>
              <p className="register-subtitle">Join our art community today</p>

              {error && <div className="error-message">{error}</div>}

              <form onSubmit={handleSubmit} className="register-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

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
                    placeholder="At least 6 characters"
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
                    placeholder="Re-enter your password"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="role">Register as</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="role-select"
                  >
                    <option value="user">Visitor</option>
                    <option value="artist">Artist</option>
                    <option value="curator">Curator</option>
                    <option value="admin">Gallery Admin</option>
                  </select>
                </div>

                <div className="terms-checkbox">
                  <label>
                    <input type="checkbox" required />
                    <span>I agree to the <a href="#">Terms & Conditions</a> and <a href="#">Privacy Policy</a></span>
                  </label>
                </div>

                <button type="submit" className="btn btn-primary btn-large btn-full">
                  Create Account →
                </button>
              </form>

              <div className="login-link">
                Already have an account? <Link to="/login">Sign In</Link>
              </div>
            </>
          ) : (
            <>
              <h1>Verify OTP</h1>
              <p className="register-subtitle">Enter the 6-digit code sent to {formData.email}</p>

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
                  Verify & Create Account
                </button>

                <div className="otp-actions">
                  <button type="button" onClick={handleResendOTP} className="resend-otp">
                    Resend OTP
                  </button>
                  <button type="button" onClick={handleBackToRegister} className="back-to-login">
                    Back to Registration
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

export default Register
