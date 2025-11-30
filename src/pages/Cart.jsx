import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { cartDB, wishlistDB } from '../utils/database'
import './Cart.css'

function Cart() {
  const navigate = useNavigate()
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])

  useEffect(() => {
    loadCart()
    loadWishlist()
  }, [])

  const loadCart = () => {
    const cartData = cartDB.getAll()
    setCart(cartData)
  }

  const loadWishlist = () => {
    const wishlistData = wishlistDB.getAll()
    setWishlist(wishlistData)
  }

  const removeFromCart = (id) => {
    cartDB.remove(id)
    loadCart()
  }

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return
    cartDB.updateQuantity(id, newQuantity)
    loadCart()
  }

  const removeFromWishlist = (id) => {
    wishlistDB.remove(id)
    loadWishlist()
  }

  const moveToCart = (artwork) => {
    const existingItem = cart.find(item => item.id === artwork.id)
    if (existingItem) {
      alert('Already in cart!')
      return
    }
    cartDB.add(artwork, 1)
    wishlistDB.remove(artwork.id)
    loadCart()
    loadWishlist()
  }

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!')
      return
    }
    navigate('/checkout')
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Shopping Cart & Wishlist</h1>
      </div>

      <div className="container">
        {/* Cart Section */}
        <section className="cart-section">
          <h2>Shopping Cart ({cart.length})</h2>
          
          {cart.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
              <Link to="/gallery" className="btn btn-primary">Browse Gallery</Link>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <img src={item.imageUrl} alt={item.title} className="cart-item-image" />
                    <div className="cart-item-details">
                      <h3>{item.title}</h3>
                      <p className="cart-item-artist">{item.artist}</p>
                      <p className="cart-item-price">${item.price}</p>
                    </div>
                    <div className="cart-item-quantity">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <div className="cart-item-total">
                      ${item.price * item.quantity}
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="remove-btn">
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>${calculateTotal()}</span>
                </div>
                <div className="summary-row">
                  <span>Tax (10%):</span>
                  <span>${(calculateTotal() * 0.1).toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>${(calculateTotal() * 1.1).toFixed(2)}</span>
                </div>
                <button onClick={handleCheckout} className="btn btn-primary btn-large btn-full">
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </section>

        {/* Wishlist Section */}
        <section className="wishlist-section">
          <h2>Wishlist ({wishlist.length})</h2>
          
          {wishlist.length === 0 ? (
            <div className="empty-wishlist">
              <p>Your wishlist is empty</p>
            </div>
          ) : (
            <div className="wishlist-grid">
              {wishlist.map(item => (
                <div key={item.id} className="wishlist-item">
                  <img src={item.imageUrl} alt={item.title} />
                  <div className="wishlist-item-info">
                    <h4>{item.title}</h4>
                    <p className="wishlist-artist">{item.artist}</p>
                    <p className="wishlist-price">${item.price}</p>
                    <div className="wishlist-actions">
                      <button onClick={() => moveToCart(item)} className="btn btn-small">
                        Add to Cart
                      </button>
                      <button onClick={() => removeFromWishlist(item.id)} className="remove-wishlist-btn">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default Cart
