import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ordersDB, cartDB, artworksDB } from '../utils/database'
import './Checkout.css'

function Checkout() {
  const navigate = useNavigate()
  
  // Get user and cart data
  const user = JSON.parse(localStorage.getItem('user'))
  const initialCart = cartDB.getAll()
  
  // All hooks must be called before any conditional returns
  const [step, setStep] = useState(1) // 1: Shipping, 2: Payment, 3: Review, 4: Success
  const [cart, setCart] = useState(initialCart) // Use state for cart
  const [orderNotes, setOrderNotes] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  
  // Shipping Information
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.profile?.phone || '',
    address: user?.profile?.address || '',
    city: user?.profile?.city || '',
    state: user?.profile?.state || '',
    zipCode: user?.profile?.zipCode || '',
    country: user?.profile?.country || 'USA'
  })

  // Payment Information
  const [paymentInfo, setPaymentInfo] = useState({
    method: 'card', // card, paypal, bank
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    saveCard: false
  })

  // Redirect if not logged in
  if (!user) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="access-denied">
            <h2>Please Login</h2>
            <p>You need to be logged in to checkout.</p>
            <button onClick={() => navigate('/login')} className="btn btn-primary">
              Go to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Redirect if cart is empty AND not on success step
  if (cart.length === 0 && step !== 4) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="empty-cart">
            <h2>Your Cart is Empty</h2>
            <p>Add some artworks to your cart before checkout.</p>
            <button onClick={() => navigate('/gallery')} className="btn btn-primary">
              Browse Gallery
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = subtotal > 5000 ? 0 : 150 // Free shipping over $5000
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + shipping + tax

  const handleShippingChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    })
  }

  const handlePaymentChange = (e) => {
    const { name, value, type, checked } = e.target
    setPaymentInfo({
      ...paymentInfo,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleNextStep = () => {
    if (step === 1) {
      // Validate shipping info
      if (!shippingInfo.fullName || !shippingInfo.email || !shippingInfo.phone || 
          !shippingInfo.address || !shippingInfo.city || !shippingInfo.zipCode) {
        alert('Please fill in all shipping information')
        return
      }
    } else if (step === 2) {
      // Validate payment info
      if (paymentInfo.method === 'card') {
        if (!paymentInfo.cardNumber || !paymentInfo.cardName || 
            !paymentInfo.expiryDate || !paymentInfo.cvv) {
          alert('Please fill in all payment information')
          return
        }
      }
    }
    setStep(step + 1)
  }

  const handlePreviousStep = () => {
    setStep(step - 1)
  }

  const handlePlaceOrder = () => {
    if (!agreedToTerms) {
      alert('Please agree to the terms and conditions')
      return
    }

    // Create order using database
    const orderData = {
      userId: user.id || user.email,
      userName: user.name || shippingInfo.fullName,
      userEmail: user.email,
      items: cart.map(item => ({
        id: item.id,
        title: item.title,
        artist: item.artist,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl,
        total: item.price * item.quantity
      })),
      shippingInfo: {
        fullName: shippingInfo.fullName,
        email: shippingInfo.email,
        phone: shippingInfo.phone,
        address: shippingInfo.address,
        city: shippingInfo.city,
        state: shippingInfo.state,
        zipCode: shippingInfo.zipCode,
        country: shippingInfo.country
      },
      paymentInfo: {
        method: paymentInfo.method,
        last4: paymentInfo.method === 'card' ? paymentInfo.cardNumber.slice(-4) : null
      },
      pricing: {
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        total: total
      },
      subtotal,
      shipping,
      tax,
      total,
      orderNotes,
      status: 'pending',
      paymentStatus: paymentInfo.method === 'card' ? 'paid' : 'pending'
    }

    // Save order to database
    const newOrder = ordersDB.create(orderData)

    // Reduce stock for each artwork in cart
    initialCart.forEach(item => {
      // Try to reduce stock in database first
      const dbArtwork = artworksDB.getById(item.id)
      if (dbArtwork) {
        artworksDB.reduceStock(item.id, item.quantity || 1)
      } else {
        // Update static artworks in a separate storage for stock tracking
        const stockTracking = JSON.parse(localStorage.getItem('artworkStockTracking') || '{}')
        if (!stockTracking[item.id]) {
          stockTracking[item.id] = { soldCount: 0 }
        }
        stockTracking[item.id].soldCount += (item.quantity || 1)
        localStorage.setItem('artworkStockTracking', JSON.stringify(stockTracking))
      }
    })

    // Clear cart using database method
    cartDB.clear()

    // Set order number and move to success
    setOrderNumber(newOrder.orderNumber)
    setStep(4)
  }

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <h1>Checkout</h1>
        <div className="checkout-steps">
          <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Shipping</span>
          </div>
          <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Payment</span>
          </div>
          <div className={`step ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Review</span>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="checkout-content">
          <div className="checkout-main">
            {/* Step 1: Shipping Information */}
            {step === 1 && (
              <div className="checkout-section">
                <h2>Shipping Information</h2>
                <form className="checkout-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={shippingInfo.fullName}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={shippingInfo.email}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Street Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>City *</label>
                      <input
                        type="text"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>State</label>
                      <input
                        type="text"
                        name="state"
                        value={shippingInfo.state}
                        onChange={handleShippingChange}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>ZIP Code *</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={shippingInfo.zipCode}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Country *</label>
                      <input
                        type="text"
                        name="country"
                        value={shippingInfo.country}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                  </div>
                </form>

                <div className="checkout-actions">
                  <button onClick={() => navigate('/cart')} className="btn btn-secondary">
                    Back to Cart
                  </button>
                  <button onClick={handleNextStep} className="btn btn-primary">
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment Information */}
            {step === 2 && (
              <div className="checkout-section">
                <h2>Payment Method</h2>
                
                <div className="payment-methods">
                  <label className={`payment-method-card ${paymentInfo.method === 'card' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="method"
                      value="card"
                      checked={paymentInfo.method === 'card'}
                      onChange={handlePaymentChange}
                    />
                    <div className="payment-method-content">
                      <span className="payment-icon">💳</span>
                      <span>Credit/Debit Card</span>
                    </div>
                  </label>

                  <label className={`payment-method-card ${paymentInfo.method === 'paypal' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="method"
                      value="paypal"
                      checked={paymentInfo.method === 'paypal'}
                      onChange={handlePaymentChange}
                    />
                    <div className="payment-method-content">
                      <span className="payment-icon">💰</span>
                      <span>PayPal</span>
                    </div>
                  </label>

                  <label className={`payment-method-card ${paymentInfo.method === 'bank' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="method"
                      value="bank"
                      checked={paymentInfo.method === 'bank'}
                      onChange={handlePaymentChange}
                    />
                    <div className="payment-method-content">
                      <span className="payment-icon">🏦</span>
                      <span>Bank Transfer</span>
                    </div>
                  </label>
                </div>

                {paymentInfo.method === 'card' && (
                  <form className="checkout-form payment-form">
                    <div className="form-group">
                      <label>Card Number *</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={paymentInfo.cardNumber}
                        onChange={handlePaymentChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Cardholder Name *</label>
                      <input
                        type="text"
                        name="cardName"
                        value={paymentInfo.cardName}
                        onChange={handlePaymentChange}
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Expiry Date *</label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={paymentInfo.expiryDate}
                          onChange={handlePaymentChange}
                          placeholder="MM/YY"
                          maxLength="5"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>CVV *</label>
                        <input
                          type="text"
                          name="cvv"
                          value={paymentInfo.cvv}
                          onChange={handlePaymentChange}
                          placeholder="123"
                          maxLength="4"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-checkbox">
                      <label>
                        <input
                          type="checkbox"
                          name="saveCard"
                          checked={paymentInfo.saveCard}
                          onChange={handlePaymentChange}
                        />
                        <span>Save card for future purchases</span>
                      </label>
                    </div>
                  </form>
                )}

                {paymentInfo.method === 'paypal' && (
                  <div className="payment-info-box">
                    <p>You will be redirected to PayPal to complete your payment.</p>
                  </div>
                )}

                {paymentInfo.method === 'bank' && (
                  <div className="payment-info-box">
                    <p><strong>Bank Details:</strong></p>
                    <p>Bank Name: Art Gallery Bank</p>
                    <p>Account Number: 1234567890</p>
                    <p>Routing Number: 987654321</p>
                    <p>Please include your order number in the transfer reference.</p>
                  </div>
                )}

                <div className="checkout-actions">
                  <button onClick={handlePreviousStep} className="btn btn-secondary">
                    Back
                  </button>
                  <button onClick={handleNextStep} className="btn btn-primary">
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review Order */}
            {step === 3 && (
              <div className="checkout-section">
                <h2>Review Your Order</h2>

                <div className="review-section">
                  <h3>Shipping Address</h3>
                  <div className="review-info">
                    <p><strong>{shippingInfo.fullName}</strong></p>
                    <p>{shippingInfo.address}</p>
                    <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                    <p>{shippingInfo.country}</p>
                    <p>Phone: {shippingInfo.phone}</p>
                    <p>Email: {shippingInfo.email}</p>
                  </div>
                  <button onClick={() => setStep(1)} className="edit-btn">Edit</button>
                </div>

                <div className="review-section">
                  <h3>Payment Method</h3>
                  <div className="review-info">
                    {paymentInfo.method === 'card' && <p>💳 Credit/Debit Card ending in {paymentInfo.cardNumber.slice(-4)}</p>}
                    {paymentInfo.method === 'paypal' && <p>💰 PayPal</p>}
                    {paymentInfo.method === 'bank' && <p>🏦 Bank Transfer</p>}
                  </div>
                  <button onClick={() => setStep(2)} className="edit-btn">Edit</button>
                </div>

                <div className="review-section">
                  <h3>Order Items</h3>
                  <div className="review-items">
                    {cart.map(item => (
                      <div key={item.id} className="review-item">
                        <img src={item.imageUrl} alt={item.title} />
                        <div className="review-item-info">
                          <h4>{item.title}</h4>
                          <p>by {item.artist}</p>
                          <p>Quantity: {item.quantity}</p>
                        </div>
                        <div className="review-item-price">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="order-notes">
                  <label>Order Notes (Optional)</label>
                  <textarea
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Special instructions for your order..."
                    rows="4"
                  ></textarea>
                </div>

                <div className="terms-agreement">
                  <label>
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      required
                    />
                    <span>I agree to the <a href="/terms">Terms & Conditions</a> and <a href="/privacy">Privacy Policy</a></span>
                  </label>
                </div>

                <div className="checkout-actions">
                  <button onClick={handlePreviousStep} className="btn btn-secondary">
                    Back
                  </button>
                  <button onClick={handlePlaceOrder} className="btn btn-success btn-large">
                    Place Order - ${total.toFixed(2)}
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Order Success */}
            {step === 4 && (
              <div className="checkout-section order-success">
                <div className="success-icon">✅</div>
                <h2>Order Placed Successfully!</h2>
                <p className="order-number">Order Number: <strong>{orderNumber}</strong></p>
                <p>Thank you for your purchase! We've sent a confirmation email to {shippingInfo.email}</p>
                
                <div className="order-tracking-info">
                  <h3>📦 Order Tracking & Delivery Status</h3>
                  
                  {/* Visual Progress Tracker */}
                  <div className="tracking-progress">
                    <div className="progress-step active completed">
                      <div className="progress-circle">
                        <span className="progress-icon">✓</span>
                      </div>
                      <div className="progress-label">
                        <strong>Order Placed</strong>
                        <span className="progress-time">Just now</span>
                        <span className="progress-location">🏢 Processing Center</span>
                      </div>
                    </div>
                    
                    <div className="progress-line"></div>
                    
                    <div className="progress-step">
                      <div className="progress-circle">
                        <span className="progress-icon">📋</span>
                      </div>
                      <div className="progress-label">
                        <strong>Processing</strong>
                        <span className="progress-time">Within 24 hours</span>
                        <span className="progress-location">🏭 Warehouse</span>
                      </div>
                    </div>
                    
                    <div className="progress-line"></div>
                    
                    <div className="progress-step">
                      <div className="progress-circle">
                        <span className="progress-icon">📦</span>
                      </div>
                      <div className="progress-label">
                        <strong>Shipped</strong>
                        <span className="progress-time">1-2 days</span>
                        <span className="progress-location">🚚 In Transit</span>
                      </div>
                    </div>
                    
                    <div className="progress-line"></div>
                    
                    <div className="progress-step">
                      <div className="progress-circle">
                        <span className="progress-icon">🚚</span>
                      </div>
                      <div className="progress-label">
                        <strong>Out for Delivery</strong>
                        <span className="progress-time">3-4 days</span>
                        <span className="progress-location">🚛 Local Hub</span>
                      </div>
                    </div>
                    
                    <div className="progress-line"></div>
                    
                    <div className="progress-step">
                      <div className="progress-circle">
                        <span className="progress-icon">🏠</span>
                      </div>
                      <div className="progress-label">
                        <strong>Delivered</strong>
                        <span className="progress-time">3-5 days</span>
                        <span className="progress-location">📍 {shippingInfo.city}, {shippingInfo.state}</span>
                      </div>
                    </div>
                  </div>

                  <div className="tracking-details">
                    <div className="tracking-item">
                      <span className="tracking-label">📍 Delivery Address:</span>
                      <span className="tracking-value">
                        {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}, {shippingInfo.country}
                      </span>
                    </div>
                    <div className="tracking-item">
                      <span className="tracking-label">⏰ Estimated Delivery:</span>
                      <span className="tracking-value">3-5 Business Days</span>
                    </div>
                    <div className="tracking-item">
                      <span className="tracking-label">💳 Payment Status:</span>
                      <span className="tracking-value status-paid">✅ {paymentInfo.method === 'card' ? 'Paid' : 'Pending'}</span>
                    </div>
                    <div className="tracking-item">
                      <span className="tracking-label">📧 Contact:</span>
                      <span className="tracking-value">{shippingInfo.email}</span>
                    </div>
                  </div>
                  
                  <div className="tracking-note">
                    <p>🔔 <strong>Stay Updated:</strong> We'll send you email notifications at each stage of delivery.</p>
                    <p>📱 Track your order anytime in the "My Orders" section for real-time updates and tracking number.</p>
                  </div>
                </div>
                
                <div className="success-actions">
                  <button onClick={() => navigate('/orders')} className="btn btn-primary">
                    Track My Order
                  </button>
                  <button onClick={() => navigate('/gallery')} className="btn btn-outline">
                    Continue Shopping
                  </button>
                  <button onClick={() => navigate('/')} className="btn btn-outline">
                    Back to Home
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          {step < 4 && (
            <div className="checkout-sidebar">
              <div className="order-summary">
                <h3>Order Summary</h3>
                
                <div className="summary-items">
                  {cart.map(item => (
                    <div key={item.id} className="summary-item">
                      <img src={item.imageUrl} alt={item.title} />
                      <div className="summary-item-info">
                        <p className="item-title">{item.title}</p>
                        <p className="item-quantity">Qty: {item.quantity}</p>
                      </div>
                      <p className="item-price">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="summary-totals">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping:</span>
                    <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="summary-row">
                    <span>Tax (8%):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {shipping === 0 && (
                  <div className="free-shipping-badge">
                    🎉 You got FREE shipping!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Checkout
