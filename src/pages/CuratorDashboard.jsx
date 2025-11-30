import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { artworksDB } from '../utils/database'
import accountDB from '../utils/accountDatabase'
import './CuratorDashboard.css'

function CuratorDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [artworks, setArtworks] = useState([])
  const [evaluatingArtwork, setEvaluatingArtwork] = useState(null)
  const [evaluation, setEvaluation] = useState({
    authenticity: 5,
    creativity: 5,
    technique: 5,
    presentation: 5,
    comment: '',
    status: 'pending'
  })
  const [exhibitions, setExhibitions] = useState([])
  const [newExhibition, setNewExhibition] = useState({
    name: '',
    theme: '',
    startDate: '',
    endDate: '',
    selectedArtworks: []
  })

  const loadArtworks = () => {
    const allArtworks = artworksDB.getAll()
    setArtworks(allArtworks)
  }

  const loadExhibitions = () => {
    const saved = localStorage.getItem('exhibitions')
    if (saved) {
      setExhibitions(JSON.parse(saved))
    }
  }

  useEffect(() => {
    // Load user from localStorage
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        console.log('Curator Dashboard - Raw User from localStorage:', parsedUser)
        
        // Check if user has profile property, if not, get from accountDB
        if (!parsedUser.profile || Object.keys(parsedUser.profile).length === 0) {
          console.log('Profile missing, fetching from accountDB...')
          const fullAccount = accountDB.accounts.getByEmail(parsedUser.email)
          if (fullAccount) {
            console.log('Full account from DB:', fullAccount)
            const updatedUser = { ...fullAccount, password: undefined }
            localStorage.setItem('user', JSON.stringify(updatedUser))
            setUser(updatedUser)
          } else {
            setUser(parsedUser)
          }
        } else {
          console.log('User profile exists:', parsedUser.profile)
          setUser(parsedUser)
        }
      } catch (error) {
        console.error('Error parsing user:', error)
      }
    }
    loadArtworks()
    loadExhibitions()
  }, [])

  // Check if user is curator
  if (!user) {
    return (
      <div className="curator-page">
        <div style={{ padding: '100px 20px', textAlign: 'center' }}>
          <h2>Loading...</h2>
        </div>
      </div>
    )
  }

  if (user.role !== 'curator') {
    return (
      <div className="curator-page">
        <div className="container">
          <div className="access-denied">
            <h2>Access Denied</h2>
            <p>You must be a curator to access this page.</p>
            <button onClick={() => navigate('/login')} className="btn btn-primary">
              Go to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  const saveExhibitions = (exhibitionList) => {
    localStorage.setItem('exhibitions', JSON.stringify(exhibitionList))
    setExhibitions(exhibitionList)
  }

  const handleEvaluate = (artwork) => {
    setEvaluatingArtwork(artwork)
    setActiveTab('evaluate')
  }

  const handleApprove = () => {
    const rating = (evaluation.authenticity + evaluation.creativity + evaluation.technique + evaluation.presentation) / 4
    artworksDB.update(evaluatingArtwork.id, {
      ...evaluatingArtwork,
      status: 'approved',
      curatorRating: rating,
      curatorComment: evaluation.comment,
      curatorName: user.name,
      reviewedDate: new Date().toISOString()
    })
    loadArtworks()
    setEvaluatingArtwork(null)
    setActiveTab('assigned')
    alert('Artwork approved successfully!')
  }

  const handleReject = () => {
    artworksDB.update(evaluatingArtwork.id, {
      ...evaluatingArtwork,
      status: 'rejected',
      curatorComment: evaluation.comment,
      curatorName: user.name,
      reviewedDate: new Date().toISOString()
    })
    loadArtworks()
    setEvaluatingArtwork(null)
    setActiveTab('assigned')
    alert('Artwork rejected.')
  }

  const handleCreateExhibition = (e) => {
    e.preventDefault()
    const newExh = {
      id: Date.now(),
      ...newExhibition,
      curator: user.name,
      createdDate: new Date().toISOString()
    }
    saveExhibitions([...exhibitions, newExh])
    setNewExhibition({
      name: '',
      theme: '',
      startDate: '',
      endDate: '',
      selectedArtworks: []
    })
    setActiveTab('exhibitions')
    alert('Exhibition created successfully!')
  }

  const toggleArtworkSelection = (artworkId) => {
    const selected = newExhibition.selectedArtworks.includes(artworkId)
    setNewExhibition({
      ...newExhibition,
      selectedArtworks: selected
        ? newExhibition.selectedArtworks.filter(id => id !== artworkId)
        : [...newExhibition.selectedArtworks, artworkId]
    })
  }

  // Statistics
  const totalReviewed = artworks.filter(a => a.status === 'approved' || a.status === 'rejected').length
  const totalApproved = artworks.filter(a => a.status === 'approved').length
  const totalRejected = artworks.filter(a => a.status === 'rejected').length
  const pendingReview = artworks.filter(a => !a.status || a.status === 'pending').length

  // Get user profile data with fallbacks
  const userName = user?.name || 'Curator'
  const userEmail = user?.email || 'curator@gallery.com'
  const userSpecialization = user?.profile?.specialization || 'Modern & Contemporary Art'
  const userBio = user?.profile?.bio || '8+ years in art curation'

  console.log('Rendering curator profile:', { userName, userEmail, userSpecialization, userBio })

  return (
    <div className="curator-page">
      {/* Curator Profile Header */}
      <div className="curator-header">
        <div className="container">
          <div className="curator-profile">
            <div className="curator-avatar">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="curator-info">
              <h1>{userName}</h1>
              <p className="role">Art Curator</p>
              <p className="email">📧 {userEmail}</p>
              <p className="expertise">🎨 Expertise: {userSpecialization}</p>
              <p className="experience">⭐ Experience: {userBio}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Navigation Tabs */}
        <div className="curator-tabs">
          <button
            className={activeTab === 'overview' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button
            className={activeTab === 'assigned' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('assigned')}
          >
            🖼️ Assigned Artworks
          </button>
          <button
            className={activeTab === 'submissions' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('submissions')}
          >
            📥 Submissions ({pendingReview})
          </button>
          <button
            className={activeTab === 'exhibitions' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('exhibitions')}
          >
            🏛️ Exhibitions
          </button>
          <button
            className={activeTab === 'create-exhibition' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('create-exhibition')}
          >
            ➕ Create Exhibition
          </button>
          <button
            className={activeTab === 'notifications' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('notifications')}
          >
            🔔 Notifications
          </button>
        </div>

        {/* Tab Content */}
        <div className="curator-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="overview-section">
              <h2>Dashboard Overview</h2>
              
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📋</div>
                  <div className="stat-number">{totalReviewed}</div>
                  <div className="stat-label">Total Reviewed</div>
                </div>
                <div className="stat-card success">
                  <div className="stat-icon">✅</div>
                  <div className="stat-number">{totalApproved}</div>
                  <div className="stat-label">Approved</div>
                </div>
                <div className="stat-card danger">
                  <div className="stat-icon">❌</div>
                  <div className="stat-number">{totalRejected}</div>
                  <div className="stat-label">Rejected</div>
                </div>
                <div className="stat-card warning">
                  <div className="stat-icon">⏳</div>
                  <div className="stat-number">{pendingReview}</div>
                  <div className="stat-label">Pending Review</div>
                </div>
              </div>

              <div className="analytics-section">
                <h3>Category Breakdown</h3>
                <div className="category-stats">
                  <div className="category-item">
                    <span className="category-name">Paintings</span>
                    <div className="category-bar">
                      <div className="category-fill" style={{width: '70%'}}></div>
                    </div>
                    <span className="category-count">14</span>
                  </div>
                  <div className="category-item">
                    <span className="category-name">Sculptures</span>
                    <div className="category-bar">
                      <div className="category-fill" style={{width: '40%'}}></div>
                    </div>
                    <span className="category-count">8</span>
                  </div>
                  <div className="category-item">
                    <span className="category-name">Photography</span>
                    <div className="category-bar">
                      <div className="category-fill" style={{width: '55%'}}></div>
                    </div>
                    <span className="category-count">11</span>
                  </div>
                  <div className="category-item">
                    <span className="category-name">Digital Art</span>
                    <div className="category-bar">
                      <div className="category-fill" style={{width: '30%'}}></div>
                    </div>
                    <span className="category-count">6</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Assigned Artworks Tab */}
          {activeTab === 'assigned' && (
            <div className="assigned-section">
              <h2>Assigned Artworks</h2>
              <div className="artworks-grid">
                {artworks.map(artwork => (
                  <div key={artwork.id} className="artwork-card">
                    <img src={artwork.imageUrl} alt={artwork.title} />
                    <div className="artwork-info">
                      <h3>{artwork.title}</h3>
                      <p className="artist-name">by {artwork.artist}</p>
                      <div className={`status-badge ${artwork.status || 'pending'}`}>
                        {artwork.status === 'approved' ? '✅ Approved' : 
                         artwork.status === 'rejected' ? '❌ Rejected' : 
                         '⏳ Pending'}
                      </div>
                      <button 
                        onClick={() => handleEvaluate(artwork)}
                        className="btn btn-primary btn-small"
                      >
                        View / Evaluate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submissions Tab */}
          {activeTab === 'submissions' && (
            <div className="submissions-section">
              <h2>New Artwork Submissions</h2>
              <div className="submissions-list">
                {artworks.filter(a => !a.status || a.status === 'pending').map(artwork => (
                  <div key={artwork.id} className="submission-item">
                    <img src={artwork.imageUrl} alt={artwork.title} className="submission-thumb" />
                    <div className="submission-details">
                      <h3>{artwork.title}</h3>
                      <p>Artist: {artwork.artist}</p>
                      <p>Submitted: {new Date().toLocaleDateString()}</p>
                    </div>
                    <button 
                      onClick={() => handleEvaluate(artwork)}
                      className="btn btn-primary"
                    >
                      Review Now
                    </button>
                  </div>
                ))}
                {artworks.filter(a => !a.status || a.status === 'pending').length === 0 && (
                  <p className="no-data">No pending submissions</p>
                )}
              </div>
            </div>
          )}

          {/* Evaluation Tab */}
          {activeTab === 'evaluate' && evaluatingArtwork && (
            <div className="evaluation-section">
              <h2>Evaluate Artwork</h2>
              <div className="evaluation-container">
                <div className="artwork-preview">
                  <img src={evaluatingArtwork.imageUrl} alt={evaluatingArtwork.title} />
                  <h3>{evaluatingArtwork.title}</h3>
                  <p>by {evaluatingArtwork.artist}</p>
                  <p className="price">${evaluatingArtwork.price?.toLocaleString()}</p>
                </div>

                <div className="evaluation-form">
                  <h3>Artwork Evaluation</h3>
                  
                  <div className="rating-group">
                    <label>Authenticity</label>
                    <div className="star-rating">
                      {[1,2,3,4,5].map(star => (
                        <span 
                          key={star}
                          className={star <= evaluation.authenticity ? 'star filled' : 'star'}
                          onClick={() => setEvaluation({...evaluation, authenticity: star})}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rating-group">
                    <label>Creativity</label>
                    <div className="star-rating">
                      {[1,2,3,4,5].map(star => (
                        <span 
                          key={star}
                          className={star <= evaluation.creativity ? 'star filled' : 'star'}
                          onClick={() => setEvaluation({...evaluation, creativity: star})}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rating-group">
                    <label>Technique</label>
                    <div className="star-rating">
                      {[1,2,3,4,5].map(star => (
                        <span 
                          key={star}
                          className={star <= evaluation.technique ? 'star filled' : 'star'}
                          onClick={() => setEvaluation({...evaluation, technique: star})}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rating-group">
                    <label>Presentation</label>
                    <div className="star-rating">
                      {[1,2,3,4,5].map(star => (
                        <span 
                          key={star}
                          className={star <= evaluation.presentation ? 'star filled' : 'star'}
                          onClick={() => setEvaluation({...evaluation, presentation: star})}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Overall Rating</label>
                    <div className="overall-rating">
                      {((evaluation.authenticity + evaluation.creativity + evaluation.technique + evaluation.presentation) / 4).toFixed(1)} / 5.0
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Comment / Feedback</label>
                    <textarea
                      value={evaluation.comment}
                      onChange={(e) => setEvaluation({...evaluation, comment: e.target.value})}
                      rows="5"
                      placeholder="Provide detailed feedback about this artwork..."
                    ></textarea>
                  </div>

                  <div className="evaluation-actions">
                    <button onClick={handleApprove} className="btn btn-success">
                      ✅ Approve Artwork
                    </button>
                    <button onClick={handleReject} className="btn btn-danger">
                      ❌ Reject Artwork
                    </button>
                    <button onClick={() => {
                      alert('Feedback sent to artist: ' + evaluatingArtwork.artist)
                    }} className="btn btn-secondary">
                      📧 Send Feedback
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Exhibitions Tab */}
          {activeTab === 'exhibitions' && (
            <div className="exhibitions-section">
              <h2>Manage Exhibitions</h2>
              <div className="exhibitions-grid">
                {exhibitions.map(exhibition => (
                  <div key={exhibition.id} className="exhibition-card">
                    <h3>{exhibition.name}</h3>
                    <p className="exhibition-theme">Theme: {exhibition.theme}</p>
                    <p>📅 {new Date(exhibition.startDate).toLocaleDateString()} - {new Date(exhibition.endDate).toLocaleDateString()}</p>
                    <p>🖼️ Artworks: {exhibition.selectedArtworks.length}</p>
                    <p className="curator-name">Curated by: {exhibition.curator}</p>
                  </div>
                ))}
                {exhibitions.length === 0 && (
                  <p className="no-data">No exhibitions created yet</p>
                )}
              </div>
            </div>
          )}

          {/* Create Exhibition Tab */}
          {activeTab === 'create-exhibition' && (
            <div className="create-exhibition-section">
              <h2>Create New Exhibition</h2>
              <form onSubmit={handleCreateExhibition} className="exhibition-form">
                <div className="form-group">
                  <label>Exhibition Name</label>
                  <input
                    type="text"
                    value={newExhibition.name}
                    onChange={(e) => setNewExhibition({...newExhibition, name: e.target.value})}
                    required
                    placeholder="e.g., Modern Art Showcase 2025"
                  />
                </div>

                <div className="form-group">
                  <label>Theme</label>
                  <input
                    type="text"
                    value={newExhibition.theme}
                    onChange={(e) => setNewExhibition({...newExhibition, theme: e.target.value})}
                    required
                    placeholder="e.g., Contemporary Expressions"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Start Date</label>
                    <input
                      type="date"
                      value={newExhibition.startDate}
                      onChange={(e) => setNewExhibition({...newExhibition, startDate: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>End Date</label>
                    <input
                      type="date"
                      value={newExhibition.endDate}
                      onChange={(e) => setNewExhibition({...newExhibition, endDate: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Select Artworks</label>
                  <div className="artwork-selection-grid">
                    {artworks.filter(a => a.status === 'approved').map(artwork => (
                      <div 
                        key={artwork.id}
                        className={`selectable-artwork ${newExhibition.selectedArtworks.includes(artwork.id) ? 'selected' : ''}`}
                        onClick={() => toggleArtworkSelection(artwork.id)}
                      >
                        <img src={artwork.imageUrl} alt={artwork.title} />
                        <div className="artwork-title">{artwork.title}</div>
                        {newExhibition.selectedArtworks.includes(artwork.id) && (
                          <div className="selected-badge">✓</div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="selected-count">{newExhibition.selectedArtworks.length} artworks selected</p>
                </div>

                <button type="submit" className="btn btn-primary btn-large">
                  Create Exhibition
                </button>
              </form>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="notifications-section">
              <h2>Notifications</h2>
              <div className="notifications-list">
                <div className="notification-item new">
                  <span className="notification-icon">📥</span>
                  <div className="notification-content">
                    <h4>New artwork submitted</h4>
                    <p>"Sunset Dreams" by Maria Garcia requires review</p>
                    <span className="notification-time">2 hours ago</span>
                  </div>
                </div>
                <div className="notification-item">
                  <span className="notification-icon">✏️</span>
                  <div className="notification-content">
                    <h4>Artist edited artwork</h4>
                    <p>John Smith updated "Modern Sculpture"</p>
                    <span className="notification-time">1 day ago</span>
                  </div>
                </div>
                <div className="notification-item">
                  <span className="notification-icon">👤</span>
                  <div className="notification-content">
                    <h4>Admin added new artist</h4>
                    <p>Emily Johnson joined as new artist</p>
                    <span className="notification-time">2 days ago</span>
                  </div>
                </div>
                <div className="notification-item warning">
                  <span className="notification-icon">⚠️</span>
                  <div className="notification-content">
                    <h4>Exhibition deadline approaching</h4>
                    <p>"Summer Art Show" ends in 3 days</p>
                    <span className="notification-time">3 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CuratorDashboard
