import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import accountDB from '../utils/accountDatabase'
import { cartDB, wishlistDB } from '../utils/database'
import './Profile.css'

function Profile() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  // Redirect if not logged in
  if (!user) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="access-denied">
            <h2>Please Login</h2>
            <p>You need to be logged in to view your profile.</p>
            <button onClick={() => navigate('/login')} className="btn btn-primary">
              Go to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.profile?.phone || '',
    address: user.profile?.address || '',
    bio: user.profile?.bio || '',
    website: user.profile?.website || '',
    instagram: user.profile?.instagram || '',
  })

  const [isEditing, setIsEditing] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    try {
      // Update profile in accountDB
      const updatedAccount = accountDB.accounts.updateProfile(user.id, {
        phone: formData.phone,
        address: formData.address,
        bio: formData.bio,
        website: formData.website,
        instagram: formData.instagram,
      })
      
      // Also update name if changed
      if (formData.name !== user.name) {
        accountDB.accounts.update(user.id, { name: formData.name })
      }
      
      // Update localStorage user
      const fullAccount = accountDB.accounts.getById(user.id)
      const userToStore = { ...fullAccount, password: undefined }
      localStorage.setItem('user', JSON.stringify(userToStore))
      
      alert('Profile updated successfully!')
      setIsEditing(false)
      window.location.reload()
    } catch (error) {
      alert('Error updating profile: ' + error.message)
    }
  }

  // Get user's activity based on role
  const getUserActivity = () => {
    if (user.role === 'artist') {
      const artistArtworks = JSON.parse(localStorage.getItem('artistArtworks') || '[]')
      const myArtworks = artistArtworks.filter(art => art.artistEmail === user.email)
      return {
        type: 'Artworks Created',
        count: myArtworks.length,
        icon: '🎨'
      }
    } else if (user.role === 'user') {
      const cart = cartDB.getAll()
      const wishlist = wishlistDB.getAll()
      return {
        type: 'Items in Cart',
        count: cart.length,
        wishlistCount: wishlist.length,
        icon: '🛒'
      }
    } else if (user.role === 'admin') {
      return {
        type: 'Admin Account',
        count: 'Full Access',
        icon: '👑'
      }
    } else if (user.role === 'curator') {
      const artworks = JSON.parse(localStorage.getItem('artworks') || '[]')
      const reviewed = artworks.filter(art => art.evaluatedBy === user.name).length
      return {
        type: 'Artworks Reviewed',
        count: reviewed,
        icon: '⭐'
      }
    }
    return {
      type: 'Account',
      count: 'Active',
      icon: '👤'
    }
  }

  const activity = getUserActivity()

  return (
    <div className="profile-page">
      <div className="profile-hero">
        <div className="profile-hero-content">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <h1>{user.name}</h1>
          <div className={`role-badge ${user.role}`}>
            {user.role === 'admin' && '👑 Admin'}
            {user.role === 'artist' && '🎨 Artist'}
            {user.role === 'curator' && '⭐ Curator'}
            {user.role === 'user' && '👤 Visitor'}
          </div>
          <p className="profile-email">{user.email}</p>
        </div>
      </div>

      <div className="container">
        {/* Activity Stats */}
        <section className="profile-section stats-section">
          <h2>Account Overview</h2>
          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-icon">{activity.icon}</div>
              <div className="stat-number">{activity.count}</div>
              <div className="stat-label">{activity.type}</div>
            </div>
            {user.role === 'user' && activity.wishlistCount !== undefined && (
              <div className="stat-box">
                <div className="stat-icon">❤️</div>
                <div className="stat-number">{activity.wishlistCount}</div>
                <div className="stat-label">Wishlist Items</div>
              </div>
            )}
            <div className="stat-box">
              <div className="stat-icon">📅</div>
              <div className="stat-number">Member</div>
              <div className="stat-label">Since 2024</div>
            </div>
          </div>
        </section>

        {/* Profile Information */}
        <section className="profile-section">
          <div className="section-header">
            <h2>Profile Information</h2>
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="btn btn-primary">
                Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    style={{ background: '#f0f0f0', cursor: 'not-allowed' }}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="form-group">
                  <label>Website</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                />
              </div>

              <div className="form-group">
                <label>Instagram</label>
                <input
                  type="text"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  placeholder="@username"
                />
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Tell us about yourself..."
                ></textarea>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)} 
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-info-display">
              <div className="info-row">
                <span className="info-label">Full Name:</span>
                <span className="info-value">{user.name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{user.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Role:</span>
                <span className="info-value">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
              </div>
              {formData.phone && (
                <div className="info-row">
                  <span className="info-label">Phone:</span>
                  <span className="info-value">{formData.phone}</span>
                </div>
              )}
              {formData.address && (
                <div className="info-row">
                  <span className="info-label">Address:</span>
                  <span className="info-value">{formData.address}</span>
                </div>
              )}
              {formData.website && (
                <div className="info-row">
                  <span className="info-label">Website:</span>
                  <span className="info-value">
                    <a href={formData.website} target="_blank" rel="noopener noreferrer">
                      {formData.website}
                    </a>
                  </span>
                </div>
              )}
              {formData.instagram && (
                <div className="info-row">
                  <span className="info-label">Instagram:</span>
                  <span className="info-value">{formData.instagram}</span>
                </div>
              )}
              {formData.bio && (
                <div className="info-row">
                  <span className="info-label">Bio:</span>
                  <span className="info-value">{formData.bio}</span>
                </div>
              )}
              {!formData.phone && !formData.address && !formData.bio && (
                <p className="empty-message">
                  No additional information provided. Click "Edit Profile" to add more details.
                </p>
              )}
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section className="profile-section">
          <h2>Quick Actions</h2>
          <div className="quick-actions-grid">
            {user.role === 'admin' && (
              <button onClick={() => navigate('/admin')} className="action-card">
                <span className="action-icon">🎛️</span>
                <span className="action-label">Admin Dashboard</span>
              </button>
            )}
            {user.role === 'artist' && (
              <>
                <button onClick={() => navigate('/artist-dashboard')} className="action-card">
                  <span className="action-icon">🎨</span>
                  <span className="action-label">My Dashboard</span>
                </button>
                <button onClick={() => navigate('/artist-profile')} className="action-card">
                  <span className="action-icon">👤</span>
                  <span className="action-label">Artist Profile</span>
                </button>
              </>
            )}
            {user.role === 'curator' && (
              <>
                <button onClick={() => navigate('/curator-dashboard')} className="action-card">
                  <span className="action-icon">⭐</span>
                  <span className="action-label">Curator Panel</span>
                </button>
                <button onClick={() => navigate('/gallery')} className="action-card">
                  <span className="action-icon">🖼️</span>
                  <span className="action-label">Review Artworks</span>
                </button>
              </>
            )}
            {user.role === 'user' && (
              <>
                <button onClick={() => navigate('/cart')} className="action-card">
                  <span className="action-icon">🛒</span>
                  <span className="action-label">My Cart</span>
                </button>
                <button onClick={() => navigate('/cart')} className="action-card">
                  <span className="action-icon">❤️</span>
                  <span className="action-label">Wishlist</span>
                </button>
              </>
            )}
            <button onClick={() => navigate('/gallery')} className="action-card">
              <span className="action-icon">🖼️</span>
              <span className="action-label">Browse Gallery</span>
            </button>
            <button onClick={() => navigate('/artists')} className="action-card">
              <span className="action-icon">🎭</span>
              <span className="action-label">View Artists</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Profile
