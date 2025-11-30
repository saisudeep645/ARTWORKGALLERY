import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Pages
import Home from './pages/Home'
import Gallery from './pages/Gallery'
import ArtworkDetail from './pages/ArtworkDetail'
import Artists from './pages/Artists'
import ArtistProfile from './pages/ArtistProfile'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import AdminDashboard from './pages/AdminDashboard'
import ArtistDashboard from './pages/ArtistDashboard'
import CuratorDashboard from './pages/CuratorDashboard'
import MyArtistProfile from './pages/MyArtistProfile'
import Profile from './pages/Profile'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/artwork/:id" element={<ArtworkDetail />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/artist/:id" element={<ArtistProfile />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/artist-dashboard" element={<ArtistDashboard />} />
          <Route path="/curator-dashboard" element={<CuratorDashboard />} />
          <Route path="/artist-profile" element={<MyArtistProfile />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
