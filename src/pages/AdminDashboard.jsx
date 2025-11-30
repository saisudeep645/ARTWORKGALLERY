import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { artworksDB, artistsDB, ordersDB, messagesDB } from '../utils/database'
import './AdminDashboard.css'

function AdminDashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))
  const [activeTab, setActiveTab] = useState('overview')

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="admin-page">
        <div className="container">
          <div className="access-denied">
            <h2>Access Denied</h2>
            <p>You must be an admin to access this page.</p>
            <button onClick={() => navigate('/login')} className="btn btn-primary">
              Go to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
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
            className={activeTab === 'artworks' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('artworks')}
          >
            Manage Artworks
          </button>
          <button
            className={activeTab === 'artists' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('artists')}
          >
            Manage Artists
          </button>
          <button
            className={activeTab === 'add-artwork' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('add-artwork')}
          >
            Add Artwork
          </button>
          <button
            className={activeTab === 'edit-artwork' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('edit-artwork')}
          >
            Edit Artworks
          </button>
          <button
            className={activeTab === 'delete-artwork' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('delete-artwork')}
          >
            Delete Artworks
          </button>
          <button
            className={activeTab === 'add-artist' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('add-artist')}
          >
            Add Artist
          </button>
          <button
            className={activeTab === 'messages' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('messages')}
          >
            Messages
          </button>
        </div>

        <div className="dashboard-content">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'artworks' && <ManageArtworks key={activeTab} />}
          {activeTab === 'artists' && <ManageArtists key={activeTab} />}
          {activeTab === 'add-artwork' && <AddArtwork onSuccess={() => setActiveTab('artworks')} />}
          {activeTab === 'edit-artwork' && <EditArtworks key={activeTab} />}
          {activeTab === 'delete-artwork' && <DeleteArtworks key={activeTab} />}
          {activeTab === 'add-artist' && <AddArtist onSuccess={() => setActiveTab('artists')} />}
          {activeTab === 'messages' && <MessagesTab key={activeTab} />}
        </div>
      </div>
    </div>
  )
}

function OverviewTab() {
  return (
    <div className="overview-tab">
      <h2>Dashboard Overview</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🎨</div>
          <div className="stat-number">12</div>
          <div className="stat-label">Total Artworks</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👨‍🎨</div>
          <div className="stat-number">7</div>
          <div className="stat-label">Total Artists</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-number">156</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-number">$24,500</div>
          <div className="stat-label">Total Sales</div>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-icon">🛒</span>
            <span>New purchase: "Starry Night" by Vincent van Gogh</span>
            <span className="activity-time">2 hours ago</span>
          </div>
          <div className="activity-item">
            <span className="activity-icon">👤</span>
            <span>New user registered: john.doe@email.com</span>
            <span className="activity-time">5 hours ago</span>
          </div>
          <div className="activity-item">
            <span className="activity-icon">❤️</span>
            <span>"The Kiss" added to 3 wishlists</span>
            <span className="activity-time">1 day ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ManageArtworks() {
  const [artworks, setArtworks] = useState([])
  const [editingArtwork, setEditingArtwork] = useState(null)
  const [editFormData, setEditFormData] = useState({})

  useEffect(() => {
    loadArtworks()
  }, [])

  const loadArtworks = () => {
    const allArtworks = artworksDB.getAll()
    setArtworks(allArtworks)
  }

  const handleEdit = (artwork) => {
    setEditingArtwork(artwork.id)
    setEditFormData({ ...artwork })
  }

  const handleCancelEdit = () => {
    setEditingArtwork(null)
    setEditFormData({})
  }

  const handleSaveEdit = () => {
    const updatedData = {
      ...editFormData,
      stock: parseInt(editFormData.stock) || 1
    }
    artworksDB.update(editingArtwork, updatedData)
    setEditingArtwork(null)
    setEditFormData({})
    loadArtworks()
    alert('Artwork updated successfully!')
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this artwork?')) {
      artworksDB.delete(id)
      loadArtworks()
      alert('Artwork deleted successfully!')
    }
  }

  return (
    <div className="manage-section">
      <h2>Manage Artworks</h2>
      {artworks.length === 0 ? (
        <p className="no-data">No artworks found. Add some artworks to get started.</p>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Artist</th>
                <th>Price</th>
                <th>Year</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {artworks.map(artwork => (
                <tr key={artwork.id}>
                  <td>
                    <img src={artwork.imageUrl} alt={artwork.title} className="table-image" />
                  </td>
                  <td>
                    {editingArtwork === artwork.id ? (
                      <input
                        type="text"
                        value={editFormData.title}
                        onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                        className="edit-input"
                      />
                    ) : (
                      artwork.title
                    )}
                  </td>
                  <td>
                    {editingArtwork === artwork.id ? (
                      <input
                        type="text"
                        value={editFormData.artist}
                        onChange={(e) => setEditFormData({ ...editFormData, artist: e.target.value })}
                        className="edit-input"
                      />
                    ) : (
                      artwork.artist
                    )}
                  </td>
                  <td>
                    {editingArtwork === artwork.id ? (
                      <input
                        type="number"
                        value={editFormData.price}
                        onChange={(e) => setEditFormData({ ...editFormData, price: parseFloat(e.target.value) })}
                        className="edit-input"
                      />
                    ) : (
                      `$${artwork.price}`
                    )}
                  </td>
                  <td>
                    {editingArtwork === artwork.id ? (
                      <input
                        type="number"
                        value={editFormData.year}
                        onChange={(e) => setEditFormData({ ...editFormData, year: e.target.value })}
                        className="edit-input"
                      />
                    ) : (
                      artwork.year
                    )}
                  </td>
                  <td>
                    {editingArtwork === artwork.id ? (
                      <div>
                        <input
                          type="number"
                          value={editFormData.stock || 1}
                          onChange={(e) => setEditFormData({ ...editFormData, stock: e.target.value })}
                          className="edit-input"
                          min="0"
                          style={{width: '80px'}}
                        />
                        <small style={{display: 'block', fontSize: '0.75rem', color: '#666'}}>
                          Sold: {artwork.soldCount || 0}
                        </small>
                      </div>
                    ) : (
                      <div>
                        <strong>{(artwork.stock || 1) - (artwork.soldCount || 0)}</strong> / {artwork.stock || 1}
                        <small style={{display: 'block', fontSize: '0.75rem', color: '#666'}}>
                          available
                        </small>
                      </div>
                    )}
                  </td>
                  <td>
                    {editingArtwork === artwork.id ? (
                      <>
                        <button className="action-btn save" onClick={handleSaveEdit}>Save</button>
                        <button className="action-btn cancel" onClick={handleCancelEdit}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="action-btn edit" onClick={() => handleEdit(artwork)}>Edit</button>
                        <button className="action-btn delete" onClick={() => handleDelete(artwork.id)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function ManageArtists() {
  const [artists, setArtists] = useState([])
  const [editingArtist, setEditingArtist] = useState(null)
  const [editFormData, setEditFormData] = useState({})

  useEffect(() => {
    loadArtists()
  }, [])

  const loadArtists = () => {
    const allArtists = artistsDB.getAll()
    setArtists(allArtists)
  }

  const handleEdit = (artist) => {
    setEditingArtist(artist.id)
    setEditFormData({ ...artist })
  }

  const handleCancelEdit = () => {
    setEditingArtist(null)
    setEditFormData({})
  }

  const handleSaveEdit = () => {
    artistsDB.update(editingArtist, editFormData)
    setEditingArtist(null)
    setEditFormData({})
    loadArtists()
    alert('Artist updated successfully!')
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this artist?')) {
      artistsDB.delete(id)
      loadArtists()
      alert('Artist deleted successfully!')
    }
  }

  const getArtworkCount = (artistName) => {
    const artworks = artworksDB.getAll()
    return artworks.filter(a => a.artist === artistName).length
  }

  return (
    <div className="manage-section">
      <h2>Manage Artists</h2>
      {artists.length === 0 ? (
        <p className="no-data">No artists found. Add some artists to get started.</p>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Nationality</th>
                <th>Birth Year</th>
                <th>Artworks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {artists.map(artist => (
                <tr key={artist.id}>
                  <td>
                    <img src={artist.imageUrl} alt={artist.name} className="table-image" />
                  </td>
                  <td>
                    {editingArtist === artist.id ? (
                      <input
                        type="text"
                        value={editFormData.name}
                        onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                        className="edit-input"
                      />
                    ) : (
                      artist.name
                    )}
                  </td>
                  <td>
                    {editingArtist === artist.id ? (
                      <input
                        type="text"
                        value={editFormData.nationality}
                        onChange={(e) => setEditFormData({ ...editFormData, nationality: e.target.value })}
                        className="edit-input"
                      />
                    ) : (
                      artist.nationality
                    )}
                  </td>
                  <td>
                    {editingArtist === artist.id ? (
                      <input
                        type="number"
                        value={editFormData.birthYear}
                        onChange={(e) => setEditFormData({ ...editFormData, birthYear: e.target.value })}
                        className="edit-input"
                      />
                    ) : (
                      artist.birthYear
                    )}
                  </td>
                  <td>{getArtworkCount(artist.name)}</td>
                  <td>
                    {editingArtist === artist.id ? (
                      <>
                        <button className="action-btn save" onClick={handleSaveEdit}>Save</button>
                        <button className="action-btn cancel" onClick={handleCancelEdit}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="action-btn edit" onClick={() => handleEdit(artist)}>Edit</button>
                        <button className="action-btn delete" onClick={() => handleDelete(artist.id)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function AddArtwork({ onSuccess }) {
  const user = JSON.parse(localStorage.getItem('user'))
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    year: '',
    medium: '',
    price: '',
    description: '',
    imageUrl: '',
    category: '',
    stock: '1'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const newArtwork = {
      ...formData,
      price: parseFloat(formData.price),
      year: formData.year,
      stock: parseInt(formData.stock) || 1,
      artistEmail: user.email,
      artistId: user.id
    }
    
    artworksDB.add(newArtwork)
    alert('Artwork added successfully!')
    setFormData({ title: '', artist: '', year: '', medium: '', price: '', description: '', imageUrl: '', category: '', stock: '1' })
    
    // Switch to manage artworks tab
    if (onSuccess) {
      setTimeout(() => onSuccess(), 100)
    }
  }

  return (
    <div className="add-section">
      <h2>Add New Artwork</h2>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-row">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Artist</label>
            <input
              type="text"
              value={formData.artist}
              onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Year</label>
            <input
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Price ($)</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Medium</label>
            <input
              type="text"
              value={formData.medium}
              onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Stock Quantity</label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              required
              min="1"
              placeholder="Number of items available"
            />
            <small>Set to 1 for unique artworks</small>
          </div>
          <div className="form-group">
            <label>Image URL</label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows="5"
            required
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary btn-large">
          Add Artwork
        </button>
      </form>
    </div>
  )
}

function AddArtist({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    nationality: '',
    birthYear: '',
    deathYear: '',
    bio: '',
    specialization: '',
    imageUrl: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const newArtist = {
      ...formData,
      birthYear: formData.birthYear,
      deathYear: formData.deathYear || null
    }
    
    artistsDB.add(newArtist)
    alert('Artist added successfully!')
    setFormData({ name: '', nationality: '', birthYear: '', deathYear: '', bio: '', specialization: '', imageUrl: '' })
    
    // Switch to manage artists tab
    if (onSuccess) {
      setTimeout(() => onSuccess(), 100)
    }
  }

  return (
    <div className="add-section">
      <h2>Add New Artist</h2>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-row">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Nationality</label>
            <input
              type="text"
              value={formData.nationality}
              onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Birth Year</label>
            <input
              type="number"
              value={formData.birthYear}
              onChange={(e) => setFormData({ ...formData, birthYear: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Death Year</label>
            <input
              type="number"
              value={formData.deathYear}
              onChange={(e) => setFormData({ ...formData, deathYear: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Specialization</label>
          <input
            type="text"
            value={formData.specialization}
            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
            placeholder="e.g., Post-Impressionism, Landscape"
            required
          />
        </div>

        <div className="form-group">
          <label>Image URL</label>
          <input
            type="url"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Biography</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows="6"
            required
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary btn-large">
          Add Artist
        </button>
      </form>
    </div>
  )
}

function EditArtworks() {
  const [artworks, setArtworks] = useState([])
  const [editingArtwork, setEditingArtwork] = useState(null)
  const [editFormData, setEditFormData] = useState({})

  useEffect(() => {
    loadArtworks()
  }, [])

  const loadArtworks = () => {
    const allArtworks = artworksDB.getAll()
    setArtworks(allArtworks)
  }

  const handleEdit = (artwork) => {
    setEditingArtwork(artwork.id)
    setEditFormData({ ...artwork })
  }

  const handleCancelEdit = () => {
    setEditingArtwork(null)
    setEditFormData({})
  }

  const handleSaveEdit = () => {
    artworksDB.update(editingArtwork, editFormData)
    setEditingArtwork(null)
    setEditFormData({})
    loadArtworks()
    alert('Artwork updated successfully!')
  }

  return (
    <div className="manage-section">
      <h2>Edit Artworks</h2>
      <p className="section-description">Select an artwork to edit its details</p>
      {artworks.length === 0 ? (
        <p className="no-data">No artworks found. Add some artworks to get started.</p>
      ) : (
        <div className="artworks-grid">
          {artworks.map(artwork => (
            <div key={artwork.id} className="artwork-edit-card">
              {editingArtwork === artwork.id ? (
                <div className="edit-form-card">
                  <img src={editFormData.imageUrl} alt={editFormData.title} className="edit-preview-image" />
                  <div className="edit-fields">
                    <div className="form-group">
                      <label>Title</label>
                      <input
                        type="text"
                        value={editFormData.title}
                        onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Artist</label>
                      <input
                        type="text"
                        value={editFormData.artist}
                        onChange={(e) => setEditFormData({ ...editFormData, artist: e.target.value })}
                        className="form-control"
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Price ($)</label>
                        <input
                          type="number"
                          value={editFormData.price}
                          onChange={(e) => setEditFormData({ ...editFormData, price: parseFloat(e.target.value) })}
                          className="form-control"
                        />
                      </div>
                      <div className="form-group">
                        <label>Year</label>
                        <input
                          type="number"
                          value={editFormData.year}
                          onChange={(e) => setEditFormData({ ...editFormData, year: parseInt(e.target.value) })}
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Image URL</label>
                      <input
                        type="url"
                        value={editFormData.imageUrl}
                        onChange={(e) => setEditFormData({ ...editFormData, imageUrl: e.target.value })}
                        className="form-control"
                      />
                    </div>
                    <div className="edit-actions">
                      <button onClick={handleSaveEdit} className="btn btn-success">
                        💾 Save Changes
                      </button>
                      <button onClick={handleCancelEdit} className="btn btn-secondary">
                        ✖️ Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <img src={artwork.imageUrl} alt={artwork.title} className="artwork-card-image" />
                  <div className="artwork-card-info">
                    <h3>{artwork.title}</h3>
                    <p className="artwork-artist">{artwork.artist}</p>
                    <p className="artwork-details">${artwork.price.toLocaleString()} • {artwork.year}</p>
                    <button onClick={() => handleEdit(artwork)} className="btn btn-primary btn-block">
                      ✏️ Edit Artwork
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function DeleteArtworks() {
  const [artworks, setArtworks] = useState([])

  useEffect(() => {
    loadArtworks()
  }, [])

  const loadArtworks = () => {
    const allArtworks = artworksDB.getAll()
    setArtworks(allArtworks)
  }

  const handleDelete = (artwork) => {
    if (window.confirm(`Are you sure you want to delete "${artwork.title}" by ${artwork.artist}? This action cannot be undone.`)) {
      artworksDB.delete(artwork.id)
      loadArtworks()
      alert('Artwork deleted successfully!')
    }
  }

  return (
    <div className="manage-section">
      <h2>Delete Artworks</h2>
      <p className="section-description">Select an artwork to permanently delete it from the database</p>
      {artworks.length === 0 ? (
        <p className="no-data">No artworks found. Add some artworks to get started.</p>
      ) : (
        <div className="artworks-grid">
          {artworks.map(artwork => (
            <div key={artwork.id} className="artwork-delete-card">
              <img src={artwork.imageUrl} alt={artwork.title} className="artwork-card-image" />
              <div className="artwork-card-info">
                <h3>{artwork.title}</h3>
                <p className="artwork-artist">{artwork.artist}</p>
                <p className="artwork-details">${artwork.price.toLocaleString()} • {artwork.year}</p>
                <button onClick={() => handleDelete(artwork)} className="btn btn-danger btn-block">
                  🗑️ Delete Artwork
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Messages Tab Component
function MessagesTab() {
  const [messages, setMessages] = useState([])
  const [selectedMessage, setSelectedMessage] = useState(null)

  useEffect(() => {
    loadMessages()
  }, [])

  const loadMessages = () => {
    const allMessages = messagesDB.getAll()
    // Sort by newest first
    setMessages(allMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
  }

  const handleViewMessage = (message) => {
    setSelectedMessage(message)
    if (message.status === 'unread') {
      messagesDB.markAsRead(message.id)
      loadMessages()
    }
  }

  const handleDeleteMessage = (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      messagesDB.delete(id)
      setSelectedMessage(null)
      loadMessages()
    }
  }

  const unreadCount = messages.filter(msg => msg.status === 'unread').length

  return (
    <div className="messages-tab">
      <h2>Contact Messages {unreadCount > 0 && <span className="badge">{unreadCount} new</span>}</h2>
      
      <div className="messages-container">
        <div className="messages-list">
          {messages.length === 0 ? (
            <p className="no-data">No messages yet.</p>
          ) : (
            messages.map(msg => (
              <div 
                key={msg.id} 
                className={`message-item ${msg.status === 'unread' ? 'unread' : ''} ${selectedMessage?.id === msg.id ? 'active' : ''}`}
                onClick={() => handleViewMessage(msg)}
              >
                <div className="message-header">
                  <h4>{msg.subject}</h4>
                  {msg.status === 'unread' && <span className="unread-dot"></span>}
                </div>
                <p className="message-from">From: {msg.name} ({msg.userRole})</p>
                <p className="message-preview">{msg.message.substring(0, 60)}...</p>
                <p className="message-date">{new Date(msg.createdAt).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>

        <div className="message-details">
          {selectedMessage ? (
            <div className="message-full">
              <div className="message-full-header">
                <h3>{selectedMessage.subject}</h3>
                <button 
                  onClick={() => handleDeleteMessage(selectedMessage.id)} 
                  className="btn btn-danger btn-small"
                >
                  🗑️ Delete
                </button>
              </div>
              
              <div className="message-meta">
                <p><strong>From:</strong> {selectedMessage.name}</p>
                <p><strong>Email:</strong> {selectedMessage.email}</p>
                <p><strong>Role:</strong> <span className="role-badge">{selectedMessage.userRole}</span></p>
                <p><strong>Date:</strong> {new Date(selectedMessage.createdAt).toLocaleString()}</p>
              </div>

              <div className="message-body">
                <h4>Message:</h4>
                <p>{selectedMessage.message}</p>
              </div>

              <div className="message-actions">
                <a 
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                  className="btn btn-primary"
                >
                  📧 Reply via Email
                </a>
              </div>
            </div>
          ) : (
            <div className="no-message-selected">
              <p>Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
