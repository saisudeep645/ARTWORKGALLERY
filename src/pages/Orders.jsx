import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ordersDB } from '../utils/database'
import './Orders.css'

function Orders() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [trackingOrder, setTrackingOrder] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user'))
    if (!currentUser) {
      navigate('/login')
      return
    }
    setUser(currentUser)
    loadOrders(currentUser.email)
  }, [navigate])

  const loadOrders = (email) => {
    const userOrders = ordersDB.getByUser(email)
    setOrders(userOrders)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffa500'
      case 'processing': return '#2196f3'
      case 'shipped': return '#9c27b0'
      case 'delivered': return '#4caf50'
      case 'cancelled': return '#f44336'
      default: return '#757575'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '⏳'
      case 'processing': return '📦'
      case 'shipped': return '🚚'
      case 'delivered': return '✅'
      case 'cancelled': return '❌'
      default: return '📋'
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const viewOrderDetails = (order) => {
    setSelectedOrder(order)
    setTrackingOrder(null)
  }

  const viewTracking = (order) => {
    setTrackingOrder(order)
    setSelectedOrder(null)
  }

  const closeModal = () => {
    setSelectedOrder(null)
    setTrackingOrder(null)
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>My Orders</h1>
        <p>Track and manage your orders</p>
      </div>

      <div className="container">
        {orders.length === 0 ? (
          <div className="empty-orders">
            <div className="empty-icon">📦</div>
            <h2>No Orders Yet</h2>
            <p>You haven't placed any orders yet.</p>
            <button onClick={() => navigate('/gallery')} className="btn btn-primary">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-card-header">
                  <div className="order-info">
                    <h3>Order #{order.orderNumber}</h3>
                    <p className="order-date">{formatDate(order.createdAt)}</p>
                  </div>
                  <div 
                    className="order-status" 
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    <span className="status-icon">{getStatusIcon(order.status)}</span>
                    <span className="status-text">{order.status.toUpperCase()}</span>
                  </div>
                </div>

                <div className="order-card-body">
                  <div className="order-items">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div key={index} className="order-item-preview">
                        <img src={item.imageUrl} alt={item.title} />
                        <div className="item-details">
                          <p className="item-title">{item.title}</p>
                          <p className="item-artist">by {item.artist}</p>
                          <p className="item-quantity">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <p className="more-items">+{order.items.length - 3} more items</p>
                    )}
                  </div>

                  <div className="order-summary">
                    <div className="summary-row">
                      <span>Total Items:</span>
                      <span>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                    </div>
                    <div className="summary-row total">
                      <span>Total Amount:</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {order.trackingNumber && (
                    <div className="tracking-info">
                      <p><strong>Tracking Number:</strong> {order.trackingNumber}</p>
                      {order.carrier && <p><strong>Carrier:</strong> {order.carrier}</p>}
                      {order.estimatedDelivery && (
                        <p><strong>Estimated Delivery:</strong> {formatDate(order.estimatedDelivery)}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="order-card-footer">
                  <button 
                    onClick={() => viewOrderDetails(order)} 
                    className="btn btn-outline"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => viewTracking(order)} 
                    className="btn btn-primary"
                  >
                    Track Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details</h2>
              <button className="close-btn" onClick={closeModal}>✕</button>
            </div>

            <div className="modal-body">
              {/* Order Information */}
              <div className="detail-section">
                <h3>Order Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Order Number:</label>
                    <span>{selectedOrder.orderNumber}</span>
                  </div>
                  <div className="detail-item">
                    <label>Order Date:</label>
                    <span>{formatDate(selectedOrder.createdAt)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Status:</label>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(selectedOrder.status) }}
                    >
                      {getStatusIcon(selectedOrder.status)} {selectedOrder.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Payment Status:</label>
                    <span className={`payment-status ${selectedOrder.paymentStatus}`}>
                      {selectedOrder.paymentStatus?.toUpperCase() || 'PENDING'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="detail-section">
                <h3>Shipping Address</h3>
                <div className="shipping-details">
                  <p><strong>{selectedOrder.shippingInfo.fullName}</strong></p>
                  <p>{selectedOrder.shippingInfo.address}</p>
                  <p>{selectedOrder.shippingInfo.city}, {selectedOrder.shippingInfo.state} {selectedOrder.shippingInfo.zipCode}</p>
                  <p>{selectedOrder.shippingInfo.country}</p>
                  <p>Phone: {selectedOrder.shippingInfo.phone}</p>
                  <p>Email: {selectedOrder.shippingInfo.email}</p>
                </div>
              </div>

              {/* Tracking Information */}
              {selectedOrder.trackingNumber && (
                <div className="detail-section tracking-section">
                  <h3>Shipping Tracking</h3>
                  <div className="tracking-details">
                    <div className="tracking-item">
                      <label>Tracking Number:</label>
                      <span className="tracking-number">{selectedOrder.trackingNumber}</span>
                    </div>
                    {selectedOrder.carrier && (
                      <div className="tracking-item">
                        <label>Carrier:</label>
                        <span>{selectedOrder.carrier}</span>
                      </div>
                    )}
                    {selectedOrder.estimatedDelivery && (
                      <div className="tracking-item">
                        <label>Estimated Delivery:</label>
                        <span>{formatDate(selectedOrder.estimatedDelivery)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Status History */}
              {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
                <div className="detail-section">
                  <h3>Order Timeline</h3>
                  <div className="timeline">
                    {selectedOrder.statusHistory.map((history, index) => (
                      <div key={index} className="timeline-item">
                        <div className="timeline-marker" style={{ backgroundColor: getStatusColor(history.status) }}></div>
                        <div className="timeline-content">
                          <p className="timeline-status">
                            {getStatusIcon(history.status)} {history.status.toUpperCase()}
                          </p>
                          <p className="timeline-note">{history.note}</p>
                          <p className="timeline-date">{formatDate(history.timestamp)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div className="detail-section">
                <h3>Order Items</h3>
                <div className="order-items-list">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="order-item-detail">
                      <img src={item.imageUrl} alt={item.title} />
                      <div className="item-info">
                        <h4>{item.title}</h4>
                        <p className="item-artist">by {item.artist}</p>
                        <p className="item-quantity">Quantity: {item.quantity}</p>
                      </div>
                      <div className="item-pricing">
                        <p className="item-price">${item.price.toFixed(2)} each</p>
                        <p className="item-total">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Totals */}
              <div className="detail-section">
                <h3>Order Summary</h3>
                <div className="order-totals">
                  <div className="total-row">
                    <span>Subtotal:</span>
                    <span>${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="total-row">
                    <span>Shipping:</span>
                    <span>{selectedOrder.shipping === 0 ? 'FREE' : `$${selectedOrder.shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="total-row">
                    <span>Tax:</span>
                    <span>${selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="total-row grand-total">
                    <span>Total:</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="detail-section">
                <h3>Payment Method</h3>
                <p className="payment-method">
                  {selectedOrder.paymentInfo?.method === 'card' && '💳 Credit/Debit Card'}
                  {selectedOrder.paymentInfo?.method === 'paypal' && '🅿️ PayPal'}
                  {selectedOrder.paymentInfo?.method === 'bank' && '🏦 Bank Transfer'}
                  {selectedOrder.paymentInfo?.last4 && ` ending in ${selectedOrder.paymentInfo.last4}`}
                </p>
              </div>

              {selectedOrder.orderNotes && (
                <div className="detail-section">
                  <h3>Order Notes</h3>
                  <p className="order-notes">{selectedOrder.orderNotes}</p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button onClick={closeModal} className="btn btn-primary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Tracking Modal */}
      {trackingOrder && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content tracking-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📦 Track Order #{trackingOrder.orderNumber}</h2>
              <button className="close-btn" onClick={closeModal}>✕</button>
            </div>

            <div className="modal-body">
              {/* Visual Progress Tracker */}
              <div className="tracking-progress-vertical">
                <div className={`progress-step-vertical ${trackingOrder.status === 'pending' || trackingOrder.status === 'processing' || trackingOrder.status === 'shipped' || trackingOrder.status === 'delivered' ? 'active completed' : ''}`}>
                  <div className="progress-circle-vertical">
                    <span className="progress-icon-vertical">✓</span>
                  </div>
                  <div className="progress-content-vertical">
                    <strong>Order Placed</strong>
                    <span className="progress-time">{formatDate(trackingOrder.createdAt)}</span>
                    <span className="progress-location">🏢 Processing Center</span>
                  </div>
                </div>

                <div className="progress-connector"></div>

                <div className={`progress-step-vertical ${trackingOrder.status === 'processing' || trackingOrder.status === 'shipped' || trackingOrder.status === 'delivered' ? 'active completed' : trackingOrder.status === 'pending' ? 'active' : ''}`}>
                  <div className="progress-circle-vertical">
                    <span className="progress-icon-vertical">{trackingOrder.status === 'processing' || trackingOrder.status === 'shipped' || trackingOrder.status === 'delivered' ? '✓' : '📋'}</span>
                  </div>
                  <div className="progress-content-vertical">
                    <strong>Processing</strong>
                    <span className="progress-time">
                      {trackingOrder.status === 'processing' || trackingOrder.status === 'shipped' || trackingOrder.status === 'delivered' ? 'Completed' : 'Within 24 hours'}
                    </span>
                    <span className="progress-location">🏭 Warehouse</span>
                  </div>
                </div>

                <div className="progress-connector"></div>

                <div className={`progress-step-vertical ${trackingOrder.status === 'shipped' || trackingOrder.status === 'delivered' ? 'active completed' : trackingOrder.status === 'processing' ? 'active' : ''}`}>
                  <div className="progress-circle-vertical">
                    <span className="progress-icon-vertical">{trackingOrder.status === 'shipped' || trackingOrder.status === 'delivered' ? '✓' : '📦'}</span>
                  </div>
                  <div className="progress-content-vertical">
                    <strong>Shipped</strong>
                    <span className="progress-time">
                      {trackingOrder.status === 'shipped' || trackingOrder.status === 'delivered' ? 'In Transit' : '1-2 days'}
                    </span>
                    <span className="progress-location">🚚 In Transit</span>
                    {trackingOrder.trackingNumber && (
                      <span className="tracking-number-inline">Tracking: {trackingOrder.trackingNumber}</span>
                    )}
                  </div>
                </div>

                <div className="progress-connector"></div>

                <div className={`progress-step-vertical ${trackingOrder.status === 'delivered' ? 'active completed' : trackingOrder.status === 'shipped' ? 'active' : ''}`}>
                  <div className="progress-circle-vertical">
                    <span className="progress-icon-vertical">{trackingOrder.status === 'delivered' ? '✓' : '🚚'}</span>
                  </div>
                  <div className="progress-content-vertical">
                    <strong>Out for Delivery</strong>
                    <span className="progress-time">
                      {trackingOrder.status === 'delivered' ? 'Completed' : '3-4 days'}
                    </span>
                    <span className="progress-location">🚛 Local Hub</span>
                  </div>
                </div>

                <div className="progress-connector"></div>

                <div className={`progress-step-vertical ${trackingOrder.status === 'delivered' ? 'active completed' : ''}`}>
                  <div className="progress-circle-vertical">
                    <span className="progress-icon-vertical">🏠</span>
                  </div>
                  <div className="progress-content-vertical">
                    <strong>Delivered</strong>
                    <span className="progress-time">
                      {trackingOrder.status === 'delivered' ? 'Delivered' : '3-5 days'}
                    </span>
                    <span className="progress-location">📍 {trackingOrder.shippingInfo.city}, {trackingOrder.shippingInfo.state}</span>
                  </div>
                </div>
              </div>

              {/* Tracking Details */}
              <div className="detail-section">
                <h3>Shipping Details</h3>
                <div className="tracking-info-grid">
                  <div className="tracking-info-item">
                    <label>📍 Delivery Address:</label>
                    <span>
                      {trackingOrder.shippingInfo.address}, {trackingOrder.shippingInfo.city}, 
                      {trackingOrder.shippingInfo.state} {trackingOrder.shippingInfo.zipCode}
                    </span>
                  </div>
                  <div className="tracking-info-item">
                    <label>📧 Email:</label>
                    <span>{trackingOrder.shippingInfo.email}</span>
                  </div>
                  <div className="tracking-info-item">
                    <label>📞 Phone:</label>
                    <span>{trackingOrder.shippingInfo.phone}</span>
                  </div>
                  {trackingOrder.trackingNumber && (
                    <>
                      <div className="tracking-info-item">
                        <label>🔢 Tracking Number:</label>
                        <span className="tracking-number">{trackingOrder.trackingNumber}</span>
                      </div>
                      {trackingOrder.carrier && (
                        <div className="tracking-info-item">
                          <label>🚚 Carrier:</label>
                          <span>{trackingOrder.carrier}</span>
                        </div>
                      )}
                    </>
                  )}
                  {trackingOrder.estimatedDelivery && (
                    <div className="tracking-info-item">
                      <label>⏰ Estimated Delivery:</label>
                      <span>{formatDate(trackingOrder.estimatedDelivery)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items Summary */}
              <div className="detail-section">
                <h3>Order Items ({trackingOrder.items.length})</h3>
                <div className="tracking-items">
                  {trackingOrder.items.map((item, index) => (
                    <div key={index} className="tracking-item-card">
                      <img src={item.imageUrl} alt={item.title} />
                      <div className="tracking-item-info">
                        <h4>{item.title}</h4>
                        <p>by {item.artist}</p>
                        <p>Qty: {item.quantity} × ${item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={() => viewOrderDetails(trackingOrder)} className="btn btn-outline">
                View Full Details
              </button>
              <button onClick={closeModal} className="btn btn-primary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders
