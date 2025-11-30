import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { artists } from '../data/artists'
import { artworks } from '../data/artworks'
import './ArtistProfile.css'

function ArtistProfile() {
  const { id } = useParams()
  const artist = artists.find(a => a.id === parseInt(id))
  
  if (!artist) {
    return (
      <div className="artist-profile-page">
        <div className="container">
          <div className="not-found">
            <h2>Artist Not Found</h2>
            <p>The artist you're looking for doesn't exist.</p>
            <Link to="/artists" className="btn btn-primary">Back to Artists</Link>
          </div>
        </div>
      </div>
    )
  }

  const artistArtworks = artworks.filter(art => art.artistId === artist.id)

  return (
    <div className="artist-profile-page">
      <div className="artist-hero">
        <div className="artist-hero-image">
          <img src={artist.imageUrl} alt={artist.name} />
        </div>
        <div className="artist-hero-info">
          <h1>{artist.name}</h1>
          <p className="hero-nationality">{artist.nationality}</p>
          <p className="hero-years">{artist.birthYear} - {artist.deathYear}</p>
        </div>
      </div>

      <div className="container">
        <div className="artist-details-section">
          <div className="detail-card">
            <h2>Biography</h2>
            <p className="short-bio">{artist.bio}</p>
            <p className="full-bio">{artist.fullBio}</p>
          </div>

          <div className="detail-card specialization-card">
            <h2>Specialization</h2>
            <div className="specialization-tags">
              {artist.specialization.split(', ').map((spec, index) => (
                <span key={index} className="spec-tag">{spec}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="artworks-section">
          <h2>Artworks by {artist.name}</h2>
          
          {artistArtworks.length > 0 ? (
            <div className="artworks-grid">
              {artistArtworks.map(artwork => (
                <Link to={`/artwork/${artwork.id}`} key={artwork.id} className="artwork-card">
                  <div className="artwork-image">
                    <img src={artwork.imageUrl} alt={artwork.title} />
                    <div className="artwork-overlay">
                      <span>View Details</span>
                    </div>
                  </div>
                  <div className="artwork-info">
                    <h3>{artwork.title}</h3>
                    <p className="artwork-year">{artwork.year}</p>
                    <p className="artwork-medium">{artwork.medium}</p>
                    <p className="artwork-price">${artwork.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="no-artworks">No artworks available from this artist in our collection.</p>
          )}
        </div>

        <div className="back-to-artists">
          <Link to="/artists" className="btn btn-outline">← Back to All Artists</Link>
        </div>
      </div>
    </div>
  )
}

export default ArtistProfile
