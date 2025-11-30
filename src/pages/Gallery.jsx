import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { artworks } from '../data/artworks'
import { artworksDB } from '../utils/database'
import './Gallery.css'

function Gallery() {
  const user = JSON.parse(localStorage.getItem('user'))
  const [selectedArtist, setSelectedArtist] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [dbArtworks, setDbArtworks] = useState([])
  const [editingArtwork, setEditingArtwork] = useState(null)
  const [editFormData, setEditFormData] = useState({})
  const [stockTracking, setStockTracking] = useState({})
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    loadArtworks()
    loadStockTracking()
  }, [])

  const loadArtworks = () => {
    const artistArtworks = artworksDB.getAll()
    setDbArtworks(artistArtworks)
  }

  const loadStockTracking = () => {
    const tracking = JSON.parse(localStorage.getItem('artworkStockTracking') || '{}')
    const staticStock = JSON.parse(localStorage.getItem('staticArtworksStock') || '{}')
    // Merge both tracking objects
    setStockTracking({ ...tracking, ...staticStock })
    // Trigger re-render
    setRefreshKey(prev => prev + 1)
  }

  const handleEdit = (artwork, e) => {
    e.preventDefault()
    setEditingArtwork(artwork.id)
    
    // For static artworks, load stock from staticArtworksStock if it exists
    const isStaticArtwork = !artwork.artistEmail && !artwork.artistId
    if (isStaticArtwork) {
      const staticStock = JSON.parse(localStorage.getItem('staticArtworksStock') || '{}')
      const stockData = staticStock[artwork.id]
      if (stockData) {
        setEditFormData({ 
          ...artwork, 
          stock: stockData.stock,
          soldCount: stockData.soldCount 
        })
      } else {
        setEditFormData({ ...artwork })
      }
    } else {
      setEditFormData({ ...artwork })
    }
  }

  const handleCancelEdit = () => {
    setEditingArtwork(null)
    setEditFormData({})
  }

  const handleSaveEdit = () => {
    const isStaticArtwork = !editFormData.artistEmail && !editFormData.artistId
    const newStock = parseInt(editFormData.stock) || 1
    
    if (isStaticArtwork) {
      // Update stock in staticArtworksStock localStorage
      const artworksData = JSON.parse(localStorage.getItem('staticArtworksStock') || '{}')
      artworksData[editingArtwork] = {
        stock: newStock,
        soldCount: editFormData.soldCount || 0
      }
      localStorage.setItem('staticArtworksStock', JSON.stringify(artworksData))
    } else {
      // Update database artwork
      const updatedData = {
        ...editFormData,
        stock: newStock
      }
      artworksDB.update(editingArtwork, updatedData)
      loadArtworks()
    }
    
    // Close edit mode
    setEditingArtwork(null)
    setEditFormData({})
    
    // Force re-render by updating stock tracking
    loadStockTracking()
    
    alert('Stock updated successfully!')
  }

  const handleDelete = (artworkId, e) => {
    e.preventDefault()
    if (window.confirm('Are you sure you want to delete this artwork?')) {
      artworksDB.delete(artworkId)
      loadArtworks()
      alert('Artwork deleted successfully!')
    }
  }

  const canEditDelete = (artwork) => {
    // Only admin can edit/delete artworks in gallery
    // Check if user is admin and artwork is from database
    const isAdmin = user?.role === 'admin'
    const isDatabaseArtwork = artwork.artistEmail || artwork.artistId
    return isAdmin && isDatabaseArtwork
  }

  // Combine static artworks with database artworks
  const allArtworks = [...artworks, ...dbArtworks]

  const filteredArtworks = allArtworks.filter(artwork => {
    const matchesArtist = selectedArtist === 'all' || artwork.artist === selectedArtist
    const matchesCategory = selectedCategory === 'all' || artwork.category === selectedCategory
    const matchesSearch = artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artwork.artist.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesArtist && matchesCategory && matchesSearch
  })

  const categories = ['all', ...new Set(allArtworks.map(art => art.category))]
  const artistNames = ['all', ...new Set(allArtworks.map(art => art.artist))]

  return (
    <div className="gallery-page">
      <div className="gallery-header">
        <h1>Art Gallery</h1>
        <p>Explore our complete collection of masterpieces</p>
        {(user?.role === 'admin' || user?.role === 'artist') && (
          <Link 
            to={user.role === 'admin' ? '/admin' : '/artist-dashboard'} 
            className="btn btn-primary add-artwork-btn"
          >
            + Add Artwork
          </Link>
        )}
      </div>

      <div className="container">
        <div className="filters-section">
          <div className="filter-group">
            <label htmlFor="search">Search:</label>
            <input
              type="text"
              id="search"
              placeholder="Search by title or artist..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="artist-filter">Artist:</label>
            <select
              id="artist-filter"
              value={selectedArtist}
              onChange={(e) => setSelectedArtist(e.target.value)}
              className="filter-select"
            >
              {artistNames.map(artist => (
                <option key={artist} value={artist}>
                  {artist === 'all' ? 'All Artists' : artist}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="category-filter">Category:</label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="results-info">
          <p>Showing {filteredArtworks.length} of {allArtworks.length} artworks</p>
        </div>

        <div className="gallery-grid" key={refreshKey}>
          {filteredArtworks.map(artwork => {
            // Get fresh stock data for each artwork on every render
            const staticStock = JSON.parse(localStorage.getItem('staticArtworksStock') || '{}')
            const artworkStockData = staticStock[artwork.id]
            const displayStock = artworkStockData?.stock ?? artwork.stock ?? 1
            const displaySoldCount = artworkStockData?.soldCount ?? artwork.soldCount ?? 0
            
            return (
            <div key={`${artwork.id}-${refreshKey}`} className="artwork-card">
              {editingArtwork === artwork.id ? (
                // Edit Mode
                <div className="artwork-edit-mode">
                  {user?.role === 'artist' ? (
                    // Artist: Stock Only
                    <div className="edit-form">
                      <div className="edit-image-preview">
                        <img src={editFormData.imageUrl} alt={editFormData.title} />
                      </div>
                      <h3>{editFormData.title}</h3>
                      <p style={{color: '#666', marginBottom: '15px'}}>by {editFormData.artist}</p>
                      <div className="edit-input-group">
                        <label>Stock Quantity</label>
                        <input
                          type="number"
                          value={editFormData.stock || 1}
                          onChange={(e) => setEditFormData({ ...editFormData, stock: parseInt(e.target.value) || 0 })}
                          placeholder="Stock"
                          className="edit-input"
                          min="0"
                        />
                        <small>Sold: {editFormData.soldCount || 0} | Available: {(parseInt(editFormData.stock) || 1) - (editFormData.soldCount || 0)}</small>
                      </div>
                      <div className="edit-actions">
                        <button onClick={handleSaveEdit} className="btn btn-success btn-small">
                          Save Stock
                        </button>
                        <button onClick={handleCancelEdit} className="btn btn-secondary btn-small">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Admin: Full Edit
                    <div className="edit-form">
                      <div className="edit-image-preview">
                        <img src={editFormData.imageUrl} alt={editFormData.title} />
                      </div>
                      <input
                        type="text"
                        value={editFormData.title}
                        onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                        placeholder="Title"
                        className="edit-input"
                      />
                      <input
                        type="text"
                        value={editFormData.artist}
                        onChange={(e) => setEditFormData({ ...editFormData, artist: e.target.value })}
                        placeholder="Artist"
                        className="edit-input"
                      />
                      <input
                        type="number"
                        value={editFormData.price}
                        onChange={(e) => setEditFormData({ ...editFormData, price: parseFloat(e.target.value) })}
                        placeholder="Price"
                        className="edit-input"
                      />
                      <input
                        type="text"
                        value={editFormData.year}
                        onChange={(e) => setEditFormData({ ...editFormData, year: e.target.value })}
                        placeholder="Year"
                        className="edit-input"
                      />
                      <input
                        type="url"
                        value={editFormData.imageUrl}
                        onChange={(e) => setEditFormData({ ...editFormData, imageUrl: e.target.value })}
                        placeholder="Image URL"
                        className="edit-input"
                      />
                      <div className="edit-actions">
                        <button onClick={handleSaveEdit} className="btn btn-success btn-small">
                          Save
                        </button>
                        <button onClick={handleCancelEdit} className="btn btn-secondary btn-small">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // View Mode
                <>
                  <div className="artwork-image-wrapper">
                    <img src={artwork.imageUrl} alt={artwork.title} />
                    <div className="artwork-hover-overlay">
                      <Link to={`/artwork/${artwork.id}`} className="details-btn">
                        View Details
                      </Link>
                    </div>
                    {canEditDelete(artwork) && (
                      <div className="artwork-actions">
                        <button 
                          onClick={(e) => handleEdit(artwork, e)} 
                          className="action-icon-btn edit-btn"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={(e) => handleDelete(artwork.id, e)} 
                          className="action-icon-btn delete-btn"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="artwork-details">
                    <h3>{artwork.title}</h3>
                    <p className="artwork-artist">{artwork.artist}</p>
                    <p className="artwork-year">{artwork.year}</p>
                    <div className="price-container">
                      <p className="artwork-price">${artwork.price}</p>
                      {(() => {
                        // Use the stock data we already calculated at the top of map
                        const available = displayStock - displaySoldCount
                        const isSoldOut = artwork.sold || available <= 0
                        
                        return isSoldOut ? (
                          <span className="sold-badge-small">OUT OF STOCK</span>
                        ) : (
                          <span className="stock-badge">{available} available</span>
                        )
                      })()}
                    </div>
                    {user?.role === 'artist' && (
                      <button 
                        onClick={(e) => { e.preventDefault(); handleEdit(artwork, e); }} 
                        className="btn btn-small btn-edit-stock"
                        style={{marginTop: '10px', background: '#667eea', color: 'white'}}
                      >
                        📦 Manage Stock
                      </button>
                    )}
                    <Link to={`/artwork/${artwork.id}`} className="btn btn-small">
                      View Details
                    </Link>
                  </div>
                </>
              )}
            </div>
          )})}
        </div>

        {filteredArtworks.length === 0 && (
          <div className="no-results">
            <h3>No artworks found</h3>
            <p>Try adjusting your filters or search term</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Gallery
