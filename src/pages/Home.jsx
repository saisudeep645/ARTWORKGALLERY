import React from 'react'
import { Link } from 'react-router-dom'
import { artworks } from '../data/artworks'
import './Home.css'

function Home() {
  const featuredArtworks = artworks.filter(art => art.featured)

  return (
    <div className="home">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Our Art Gallery</h1>
          <p className="hero-subtitle">Discover Masterpieces from World-Renowned Artists</p>
          <div className="hero-buttons">
            <Link to="/gallery" className="btn btn-primary">Explore Gallery</Link>
            <Link to="/artists" className="btn btn-secondary">Meet Artists</Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="home-about">
        <div className="container">
          <h2>About Our Gallery</h2>
          <p>
            We are a premier art gallery dedicated to showcasing exceptional artworks from 
            both classical masters and contemporary artists. Our collection spans multiple 
            centuries and styles, offering something for every art enthusiast.
          </p>
          <p>
            Whether you're a seasoned collector or just beginning your journey into the art 
            world, our curated selection provides an immersive experience into the beauty and 
            diversity of human creativity.
          </p>
          <Link to="/about" className="btn btn-outline">Learn More About Us</Link>
        </div>
      </section>

      {/* Featured Artworks */}
      <section className="featured-section">
        <div className="container">
          <h2>Featured Artworks</h2>
          <p className="section-subtitle">Handpicked masterpieces from our collection</p>
          
          <div className="featured-grid">
            {featuredArtworks.map(artwork => (
              <div key={artwork.id} className="featured-card">
                <div className="featured-image-container">
                  <img src={artwork.imageUrl} alt={artwork.title} />
                  <div className="featured-overlay">
                    <Link to={`/artwork/${artwork.id}`} className="view-btn">
                      View Details
                    </Link>
                  </div>
                </div>
                <div className="featured-info">
                  <h3>{artwork.title}</h3>
                  <p className="artist-name">{artwork.artist}</p>
                  <p className="artwork-year">{artwork.year}</p>
                  <p className="artwork-price">${artwork.price}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="view-all-container">
            <Link to="/gallery" className="btn btn-primary">View All Artworks</Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{artworks.length}+</div>
              <div className="stat-label">Artworks</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">7+</div>
              <div className="stat-label">Artists</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">100+</div>
              <div className="stat-label">Happy Collectors</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">50+</div>
              <div className="stat-label">Years Combined Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Start Your Collection Today</h2>
          <p>Browse our extensive gallery and find the perfect piece for your space</p>
          <Link to="/gallery" className="btn btn-primary btn-large">Browse Gallery</Link>
        </div>
      </section>
    </div>
  )
}

export default Home
