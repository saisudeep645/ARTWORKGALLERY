import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ArtistDashboard.css'

function ArtistDashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))
  const [activeTab, setActiveTab] = useState('overview')

  // Check if user is artist
  if (!user || user.role !== 'artist') {
    return (
      <div className="artist-dashboard-page">
        <div className="container">
          <div className="access-denied">
            <h2>Access Denied</h2>
            <p>You must be an artist to access this page.</p>
            <button onClick={() => navigate('/login')} className="btn btn-primary">
              Go to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="artist-dashboard-page">
      <div className="artist-dashboard-header">
        <h1>Artist Dashboard</h1>
        <p>Welcome back, {user.name}!</p>
      </div>

      <div className="container">
        <div className="dashboard-tabs">
          <button
            className={activeTab === 'overview' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={activeTab === 'my-artworks' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('my-artworks')}
          >
            My Artworks
          </button>
          <button
            className={activeTab === 'add-artwork' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('add-artwork')}
          >
            Add New Artwork
          </button>
          <button
            className={activeTab === 'profile' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('profile')}
          >
            Edit Profile
          </button>
        </div>

        <div className="dashboard-content">
          {activeTab === 'overview' && <OverviewTab user={user} />}
          {activeTab === 'my-artworks' && <MyArtworksTab user={user} />}
          {activeTab === 'add-artwork' && <AddArtworkTab user={user} />}
          {activeTab === 'profile' && <EditProfileTab user={user} />}
        </div>
      </div>
    </div>
  )
}

function OverviewTab({ user }) {
  // Get artist's artworks from localStorage
  const artistArtworks = JSON.parse(localStorage.getItem('artistArtworks') || '[]')
  const myArtworks = artistArtworks.filter(art => 
    art.artistEmail === user.email || art.artistId === user.id
  )

  return (
    <div className="overview-tab">
      <h2>Dashboard Overview</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🎨</div>
          <div className="stat-number">{myArtworks.length}</div>
          <div className="stat-label">My Artworks</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👁️</div>
          <div className="stat-number">{myArtworks.reduce((sum, art) => sum + (art.views || 0), 0)}</div>
          <div className="stat-label">Total Views</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">❤️</div>
          <div className="stat-number">{myArtworks.reduce((sum, art) => sum + (art.likes || 0), 0)}</div>
          <div className="stat-label">Total Likes</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-number">${myArtworks.reduce((sum, art) => sum + (art.price || 0), 0)}</div>
          <div className="stat-label">Total Value</div>
        </div>
      </div>

      <div className="welcome-message">
        <h3>Welcome to Your Artist Dashboard!</h3>
        <p>Here you can manage your artworks, add new pieces to the gallery, and update your artist profile.</p>
        <div className="quick-actions">
          <button className="btn btn-primary" onClick={() => window.scrollTo(0, 0)}>
            Add New Artwork
          </button>
          <button className="btn btn-outline" onClick={() => window.location.href = '/artist-profile'}>
            View My Profile
          </button>
        </div>
      </div>

      {myArtworks.length > 0 && (
        <div className="recent-artworks">
          <h3>Recent Artworks</h3>
          <div className="artworks-preview-grid">
            {myArtworks.slice(0, 3).map(artwork => (
              <div key={artwork.id} className="artwork-preview-card">
                <img src={artwork.imageUrl} alt={artwork.title} />
                <div className="artwork-preview-info">
                  <h4>{artwork.title}</h4>
                  <p>${artwork.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function MyArtworksTab({ user }) {
  const [artworks, setArtworks] = useState(() => {
    const artistArtworks = JSON.parse(localStorage.getItem('artistArtworks') || '[]')
    // Show all artworks for any artist
    return artistArtworks
  })
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this artwork?')) {
      const allArtworks = JSON.parse(localStorage.getItem('artistArtworks') || '[]')
      const updated = allArtworks.filter(art => art.id !== id)
      localStorage.setItem('artistArtworks', JSON.stringify(updated))
      setArtworks(artworks.filter(art => art.id !== id))
      alert('Artwork deleted successfully!')
    }
  }

  const handleEdit = (artwork) => {
    setEditingId(artwork.id)
    setEditForm({ ...artwork })
  }

  const handleSaveEdit = () => {
    const allArtworks = JSON.parse(localStorage.getItem('artistArtworks') || '[]')
    const updated = allArtworks.map(art => 
      art.id === editingId ? { ...editForm, stock: parseInt(editForm.stock) || 1 } : art
    )
    localStorage.setItem('artistArtworks', JSON.stringify(updated))
    setArtworks(artworks.map(art => art.id === editingId ? { ...editForm, stock: parseInt(editForm.stock) || 1 } : art))
    setEditingId(null)
    alert('Artwork updated successfully!')
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditForm({})
  }

  if (artworks.length === 0) {
    return (
      <div className="empty-state">
        <h2>No Artworks Yet</h2>
        <p>You haven't added any artworks to the gallery yet.</p>
        <button className="btn btn-primary" onClick={() => window.scrollTo(0, 0)}>
          Add Your First Artwork
        </button>
      </div>
    )
  }

  return (
    <div className="manage-section">
      <h2>My Artworks ({artworks.length})</h2>
      <div className="artworks-grid">
        {artworks.map(artwork => (
          <div key={artwork.id} className="artwork-manage-card">
            {editingId === artwork.id ? (
              // Edit Mode
              <div className="artwork-edit-form">
                <img src={editForm.imageUrl} alt={editForm.title} style={{width: '100%', borderRadius: '8px', marginBottom: '15px'}} />
                <h3>{editForm.title}</h3>
                <div className="form-group">
                  <label>Stock Quantity</label>
                  <input
                    type="number"
                    value={editForm.stock || 1}
                    onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                    min="0"
                  />
                  <small>Current sold: {editForm.soldCount || 0} | Available: {(parseInt(editForm.stock) || 1) - (editForm.soldCount || 0)}</small>
                </div>
                <div className="artwork-actions">
                  <button className="action-btn save" onClick={handleSaveEdit}>
                    Save Stock
                  </button>
                  <button className="action-btn cancel" onClick={handleCancelEdit}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <>
                <img src={artwork.imageUrl} alt={artwork.title} />
                <div className="artwork-manage-info">
                  <h3>{artwork.title}</h3>
                  <p className="artwork-year">{artwork.year}</p>
                  <p className="artwork-medium">{artwork.medium}</p>
                  <p className="artwork-price">${artwork.price}</p>
                  <p className="artwork-stock">
                    <strong>Stock:</strong> {(artwork.stock || 1) - (artwork.soldCount || 0)} / {artwork.stock || 1} available
                  </p>
                  <p className="artwork-status">
                    <span className={`status-badge ${artwork.sold ? 'sold-out' : 'active'}`}>
                      {artwork.sold ? 'Sold Out' : 'Available'}
                    </span>
                  </p>
                  <div className="artwork-actions">
                    <button className="action-btn edit" onClick={() => handleEdit(artwork)}>
                      Edit
                    </button>
                    <button className="action-btn delete" onClick={() => handleDelete(artwork.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function AddArtworkTab({ user }) {
  const [formData, setFormData] = useState({
    title: '',
    year: '',
    medium: '',
    price: '',
    description: '',
    imageUrl: '',
    category: '',
    stock: '1'
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const artistArtworks = JSON.parse(localStorage.getItem('artistArtworks') || '[]')
    
    const newArtwork = {
      id: Date.now(),
      ...formData,
      artist: user.name,
      artistEmail: user.email,
      artistId: user.id || user.email, // Use ID if available, fallback to email
      year: parseInt(formData.year),
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock) || 1,
      soldCount: 0,
      views: 0,
      likes: 0,
      featured: false,
      createdAt: new Date().toISOString()
    }

    artistArtworks.push(newArtwork)
    localStorage.setItem('artistArtworks', JSON.stringify(artistArtworks))
    
    alert('Artwork added successfully!')
    setFormData({
      title: '',
      year: '',
      medium: '',
      price: '',
      description: '',
      imageUrl: '',
      category: '',
      stock: '1'
    })
  }

  return (
    <div className="add-section">
      <h2>Add New Artwork</h2>
      <form onSubmit={handleSubmit} className="artist-form">
        <div className="form-row">
          <div className="form-group">
            <label>Artwork Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter artwork title"
            />
          </div>
          <div className="form-group">
            <label>Year *</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              placeholder="e.g., 2025"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Medium *</label>
            <input
              type="text"
              name="medium"
              value={formData.medium}
              onChange={handleChange}
              required
              placeholder="e.g., Oil on canvas"
            />
          </div>
          <div className="form-group">
            <label>Price ($) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              placeholder="Enter price"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Stock Quantity *</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              min="1"
              placeholder="Number of items available"
            />
            <small>Set to 1 for unique artworks</small>
          </div>
          <div className="form-group">
            <label>Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="">Select a category</option>
              <option value="Abstract">Abstract</option>
              <option value="Impressionism">Impressionism</option>
              <option value="Expressionism">Expressionism</option>
              <option value="Post-Impressionism">Post-Impressionism</option>
              <option value="Contemporary">Contemporary</option>
              <option value="Modern Art">Modern Art</option>
              <option value="Portrait">Portrait</option>
              <option value="Landscape">Landscape</option>
              <option value="Still Life">Still Life</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Image URL *</label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            required
            placeholder="https://example.com/image.jpg"
          />
          {formData.imageUrl && (
            <div className="image-preview">
              <img src={formData.imageUrl} alt="Preview" />
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="6"
            required
            placeholder="Describe your artwork..."
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary btn-large">
          Add Artwork to Gallery
        </button>
      </form>
    </div>
  )
}

function EditProfileTab({ user }) {
  const [formData, setFormData] = useState({
    name: user.name || '',
    bio: '',
    specialization: '',
    website: '',
    instagram: '',
    portfolio: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Update user profile
    const updatedUser = {
      ...user,
      name: formData.name,
      profile: formData
    }
    
    localStorage.setItem('user', JSON.stringify(updatedUser))
    alert('Profile updated successfully!')
  }

  return (
    <div className="edit-profile-section">
      <h2>Edit Artist Profile</h2>
      <form onSubmit={handleSubmit} className="artist-form">
        <div className="form-group">
          <label>Artist Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Specialization</label>
          <input
            type="text"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            placeholder="e.g., Contemporary Abstract, Oil Painting"
          />
        </div>

        <div className="form-group">
          <label>Biography</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="6"
            placeholder="Tell visitors about yourself and your artistic journey..."
          ></textarea>
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

        <div className="form-group">
          <label>Instagram</label>
          <input
            type="text"
            name="instagram"
            value={formData.instagram}
            onChange={handleChange}
            placeholder="@yourusername"
          />
        </div>

        <div className="form-group">
          <label>Portfolio Link</label>
          <input
            type="url"
            name="portfolio"
            value={formData.portfolio}
            onChange={handleChange}
            placeholder="https://portfolio.com"
          />
        </div>

        <button type="submit" className="btn btn-primary btn-large">
          Update Profile
        </button>
      </form>
    </div>
  )
}

export default ArtistDashboard
