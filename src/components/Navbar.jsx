import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('user'))

  const handleLogout = () => {
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const isActive = (path) => {
    return location.pathname === path ? 'active' : ''
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🎨 Art Gallery
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          <div className={isOpen ? 'hamburger open' : 'hamburger'}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <ul className={isOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className={`nav-link ${isActive('/')}`} onClick={() => setIsOpen(false)}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/gallery" className={`nav-link ${isActive('/gallery')}`} onClick={() => setIsOpen(false)}>
              Gallery
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/artists" className={`nav-link ${isActive('/artists')}`} onClick={() => setIsOpen(false)}>
              Artists
            </Link>
          </li>
          {user && user.role !== 'admin' && (
            <li className="nav-item">
              <Link to="/orders" className={`nav-link ${isActive('/orders')}`} onClick={() => setIsOpen(false)}>
                My Orders
              </Link>
            </li>
          )}
          <li className="nav-item">
            <Link to="/about" className={`nav-link ${isActive('/about')}`} onClick={() => setIsOpen(false)}>
              About
            </Link>
          </li>
          {user?.role !== 'admin' && (
            <li className="nav-item">
              <Link to="/contact" className={`nav-link ${isActive('/contact')}`} onClick={() => setIsOpen(false)}>
                Contact
              </Link>
            </li>
          )}
          
          {user ? (
            <>
              {user.role === 'admin' && (
                <li className="nav-item">
                  <Link to="/admin" className={`nav-link ${isActive('/admin')}`} onClick={() => setIsOpen(false)}>
                    Dashboard
                  </Link>
                </li>
              )}
              {user.role === 'artist' && (
                <li className="nav-item">
                  <Link to="/artist-dashboard" className={`nav-link ${isActive('/artist-dashboard')}`} onClick={() => setIsOpen(false)}>
                    My Dashboard
                  </Link>
                </li>
              )}
              {user.role === 'curator' && (
                <li className="nav-item">
                  <Link to="/curator-dashboard" className={`nav-link ${isActive('/curator-dashboard')}`} onClick={() => setIsOpen(false)}>
                    Curator Panel
                  </Link>
                </li>
              )}
              {(user.role === 'user' || user.role === 'artist') && (
                <li className="nav-item">
                  <Link to="/cart" className={`nav-link ${isActive('/cart')}`} onClick={() => setIsOpen(false)}>
                    Cart
                  </Link>
                </li>
              )}
              <li className="nav-item">
                <Link to="/profile" className={`nav-link ${isActive('/profile')}`} onClick={() => setIsOpen(false)}>
                  Profile
                </Link>
              </li>
              <li className="nav-item">
                <button className="nav-link logout-btn" onClick={handleLogout}>
                  Logout ({user.name})
                </button>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <Link to="/login" className={`nav-link ${isActive('/login')}`} onClick={() => setIsOpen(false)}>
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
