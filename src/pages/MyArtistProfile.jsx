import React from 'react'
import { useNavigate } from 'react-router-dom'
import './MyArtistProfile.css'

function MyArtistProfile() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  // Check if user is artist
  if (!user || user.role !== 'artist') {
    return (
      <div className="my-artist-profile-page">
        <div className="container">
          <div className="access-denied">
            <h2>Access Denied</h2>
            <p>You must be an artist to view this page.</p>
            <button onClick={() => navigate('/login')} className="btn btn-primary">
              Go to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Get artist's artworks
  const artistArtworks = JSON.parse(localStorage.getItem('artistArtworks') || '[]')
  const myArtworks = artistArtworks.filter(art => 
    art.artistEmail === user.email || art.artistId === user.id
  )
  const profile = user.profile || {}

  return (
    <div className="my-artist-profile-page">
      <div className="profile-hero">
        <div className="profile-hero-content">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <h1>{user.name}</h1>
          <p className="profile-email">{user.email}</p>
          {profile.specialization && (
            <p className="profile-specialization">{profile.specialization}</p>
          )}
          <button 
            onClick={() => navigate('/artist-dashboard')} 
            className="btn btn-secondary"
          >
            Edit Profile
          </button>
        </div>
      </div>

      <div className="container">
        {/* About Section */}
        <section className="profile-section">
          <h2>About Me</h2>
          {profile.bio ? (
            <p className="profile-bio">{profile.bio}</p>
          ) : (
            <p className="empty-message">
              No biography added yet. <a href="/artist-dashboard">Add your bio</a>
            </p>
          )}
        </section>

        {/* Links Section */}
        {(profile.website || profile.instagram || profile.portfolio) && (
          <section className="profile-section links-section">
            <h2>Connect With Me</h2>
            <div className="profile-links">
              {profile.website && (
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="profile-link">
                  🌐 Website
                </a>
              )}
              {profile.instagram && (
                <a href={`https://instagram.com/${profile.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="profile-link">
                  📸 Instagram
                </a>
              )}
              {profile.portfolio && (
                <a href={profile.portfolio} target="_blank" rel="noopener noreferrer" className="profile-link">
                  🎨 Portfolio
                </a>
              )}
            </div>
          </section>
        )}

        {/* Artworks Section */}
        <section className="profile-section">
          <h2>My Artworks ({myArtworks.length})</h2>
          
          {myArtworks.length > 0 ? (
            <div className="profile-artworks-grid">
              {myArtworks.map(artwork => (
                <div key={artwork.id} className="profile-artwork-card">
                  <div className="profile-artwork-image">
                    <img src={artwork.imageUrl} alt={artwork.title} />
                  </div>
                  <div className="profile-artwork-info">
                    <h3>{artwork.title}</h3>
                    <p className="artwork-year">{artwork.year}</p>
                    <p className="artwork-medium">{artwork.medium}</p>
                    <p className="artwork-price">${artwork.price}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-artworks">
              <p>No artworks yet.</p>
              <button onClick={() => navigate('/artist-dashboard')} className="btn btn-primary">
                Add Your First Artwork
              </button>
            </div>
          )}
        </section>

        {/* Stats Section */}
        <section className="profile-section stats-section">
          <h2>Statistics</h2>
          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-number">{myArtworks.length}</div>
              <div className="stat-label">Total Artworks</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">{myArtworks.reduce((sum, art) => sum + (art.views || 0), 0)}</div>
              <div className="stat-label">Total Views</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">{myArtworks.reduce((sum, art) => sum + (art.likes || 0), 0)}</div>
              <div className="stat-label">Total Likes</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default MyArtistProfile
