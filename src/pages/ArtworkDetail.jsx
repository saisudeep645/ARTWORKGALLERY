import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { artworks } from '../data/artworks'
import { artworksDB, cartDB, wishlistDB } from '../utils/database'
import './ArtworkDetail.css'

function ArtworkDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const artwork = artworks.find(art => art.id === parseInt(id))
  const [quantity, setQuantity] = useState(1)
  
  // Get stock tracking from localStorage
  const stockTracking = JSON.parse(localStorage.getItem('artworkStockTracking') || '{}')
  const tracking = stockTracking[parseInt(id)] || { soldCount: 0 }
  const currentSoldCount = artwork ? (artwork.soldCount || tracking.soldCount || 0) : 0
  const currentStock = artwork ? (artwork.stock || 1) : 0
  const availableStock = currentStock - currentSoldCount
  const isInStock = artwork ? (!artwork.sold && availableStock > 0) : false

  if (!artwork) {
    return (
      <div className="artwork-detail-page">
        <div className="container">
          <div className="not-found">
            <h2>Artwork Not Found</h2>
            <p>The artwork you're looking for doesn't exist.</p>
            <Link to="/gallery" className="btn btn-primary">Back to Gallery</Link>
          </div>
        </div>
      </div>
    )
  }

  const relatedArtworks = artworks.filter(art => 
    art.artist === artwork.artist && art.id !== artwork.id
  ).slice(0, 3)

  const handleAddToCart = () => {
    cartDB.add(artwork, quantity)
    alert(`Added ${artwork.title} to cart!`)
  }

  const handleAddToWishlist = () => {
    const wishlist = wishlistDB.getAll()
    
    if (!wishlist.find(item => item.id === artwork.id)) {
      wishlistDB.add(artwork)
      alert(`Added ${artwork.title} to wishlist!`)
    } else {
      alert('Already in wishlist!')
    }
  }

  return (
    <div className="artwork-detail-page">
      <div className="container">
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back
        </button>

        <div className="artwork-detail-grid">
          <div className="artwork-image-section">
            <img src={artwork.imageUrl} alt={artwork.title} className="detail-image" />
          </div>

          <div className="artwork-info-section">
            <h1>{artwork.title}</h1>
            
            <div className="artist-info">
              <Link to={`/artist/${artwork.artistId}`} className="artist-link">
                {artwork.artist}
              </Link>
            </div>

            <div className="artwork-meta">
              <div className="meta-item">
                <span className="meta-label">Year:</span>
                <span className="meta-value">{artwork.year}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Medium:</span>
                <span className="meta-value">{artwork.medium}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Category:</span>
                <span className="meta-value">{artwork.category}</span>
              </div>
            </div>

            <div className="price-section">
              <span className="price-label">Price:</span>
              <span className="price-value">${artwork.price}</span>
              {!isInStock ? (
                <span className="sold-badge">OUT OF STOCK</span>
              ) : (
                <span className="stock-info">{availableStock} in stock</span>
              )}
            </div>

            <div className="description-section">
              <h3>Description</h3>
              <p>{artwork.description}</p>
            </div>

            {isInStock && (
              <div className="quantity-section">
                <label htmlFor="quantity">Quantity:</label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  max={availableStock}
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1
                    setQuantity(Math.min(availableStock, Math.max(1, val)))
                  }}
                />
              </div>
            )}

            <div className="action-buttons">
              {isInStock ? (
                <>
                  <button onClick={handleAddToCart} className="btn btn-primary btn-large">
                    Add to Cart
                  </button>
                  <button onClick={handleAddToWishlist} className="btn btn-secondary btn-large">
                    ❤️ Add to Wishlist
                  </button>
                </>
              ) : (
                <div className="sold-message">
                  <p>This artwork is currently out of stock.</p>
                  <Link to="/gallery" className="btn btn-primary">Browse Available Artworks</Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {relatedArtworks.length > 0 && (
          <div className="related-section">
            <h2>More from {artwork.artist}</h2>
            <div className="related-grid">
              {relatedArtworks.map(art => (
                <Link to={`/artwork/${art.id}`} key={art.id} className="related-card">
                  <img src={art.imageUrl} alt={art.title} />
                  <div className="related-info">
                    <h4>{art.title}</h4>
                    <p>{art.year}</p>
                    <p className="related-price">${art.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ArtworkDetail
