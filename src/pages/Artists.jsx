import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { artists } from '../data/artists'
import { artistsDB } from '../utils/database'
import './Artists.css'

function Artists() {
  const user = JSON.parse(localStorage.getItem('user'))
  const [dbArtists, setDbArtists] = useState([])

  useEffect(() => {
    // Load artists from database
    const allDbArtists = artistsDB.getAll()
    setDbArtists(allDbArtists)
  }, [])

  // Combine static artists with database artists
  const allArtists = [...artists, ...dbArtists]
  
  return (
    <div className="artists-page">
      <div className="artists-header">
        <h1>Featured Artists</h1>
        <p>Meet the talented artists behind our collection</p>
        {user?.role === 'admin' && (
          <Link to="/admin" className="btn btn-primary add-artist-btn">
            + Add Artist
          </Link>
        )}
      </div>

      <div className="container">
        <div className="artists-grid">
          {allArtists.map(artist => (
            <Link to={`/artist/${artist.id}`} key={artist.id} className="artist-card">
              <div className="artist-image-container">
                <img src={artist.imageUrl} alt={artist.name} />
                <div className="artist-overlay">
                  <span>View Profile</span>
                </div>
              </div>
              <div className="artist-card-info">
                <h3>{artist.name}</h3>
                <p className="artist-nationality">{artist.nationality}</p>
                <p className="artist-years">
                  {artist.birthYear} - {artist.deathYear || 'Present'}
                </p>
                <p className="artist-specialization">{artist.specialization}</p>
                <p className="artist-bio-preview">{artist.bio}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Artists
