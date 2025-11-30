// Centralized Database Manager for Art Gallery
// This file manages all data storage and retrieval using localStorage

// Database Keys
const DB_KEYS = {
  ARTWORKS: 'gallery_artworks',
  ARTISTS: 'gallery_artists',
  USERS: 'gallery_users',
  CART: 'gallery_cart',
  WISHLIST: 'gallery_wishlist',
  ORDERS: 'gallery_orders',
  CURRENT_USER: 'gallery_current_user',
  ARTIST_ARTWORKS: 'gallery_artist_artworks',
  REVIEWS: 'gallery_reviews',
  MESSAGES: 'gallery_messages'
}

// Initialize Database with default data
export const initializeDatabase = () => {
  // Check if database is already initialized
  if (!localStorage.getItem('gallery_initialized')) {
    // Initialize with empty collections
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify([]))
    localStorage.setItem(DB_KEYS.CART, JSON.stringify([]))
    localStorage.setItem(DB_KEYS.WISHLIST, JSON.stringify([]))
    localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify([]))
    localStorage.setItem(DB_KEYS.ARTIST_ARTWORKS, JSON.stringify([]))
    localStorage.setItem(DB_KEYS.REVIEWS, JSON.stringify([]))
    localStorage.setItem(DB_KEYS.MESSAGES, JSON.stringify([]))
    localStorage.setItem('gallery_initialized', 'true')
  }
}

// ==================== ARTWORKS ====================
export const artworksDB = {
  // Get all artworks (static + artist-added)
  getAll: () => {
    const artistArtworks = JSON.parse(localStorage.getItem(DB_KEYS.ARTIST_ARTWORKS) || '[]')
    return artistArtworks
  },

  // Get artwork by ID
  getById: (id) => {
    const artworks = artworksDB.getAll()
    return artworks.find(art => art.id === id)
  },

  // Add new artwork
  add: (artwork) => {
    const artworks = artworksDB.getAll()
    const newArtwork = {
      ...artwork,
      id: Date.now(),
      stock: artwork.stock || 1, // Default stock is 1 for unique artworks
      soldCount: 0, // Track how many have been sold
      createdAt: new Date().toISOString()
    }
    artworks.push(newArtwork)
    localStorage.setItem(DB_KEYS.ARTIST_ARTWORKS, JSON.stringify(artworks))
    return newArtwork
  },

  // Update artwork
  update: (id, updatedData) => {
    const artworks = artworksDB.getAll()
    const index = artworks.findIndex(art => art.id === id)
    if (index !== -1) {
      artworks[index] = { ...artworks[index], ...updatedData, updatedAt: new Date().toISOString() }
      localStorage.setItem(DB_KEYS.ARTIST_ARTWORKS, JSON.stringify(artworks))
      return artworks[index]
    }
    return null
  },

  // Delete artwork
  delete: (id) => {
    const artworks = artworksDB.getAll()
    const filtered = artworks.filter(art => art.id !== id)
    localStorage.setItem(DB_KEYS.ARTIST_ARTWORKS, JSON.stringify(filtered))
    return true
  },

  // Get artworks by artist email
  getByArtist: (artistEmail) => {
    const artworks = artworksDB.getAll()
    return artworks.filter(art => art.artistEmail === artistEmail)
  },

  // Get featured artworks
  getFeatured: () => {
    const artworks = artworksDB.getAll()
    return artworks.filter(art => art.featured)
  },

  // Search artworks
  search: (query) => {
    const artworks = artworksDB.getAll()
    const lowerQuery = query.toLowerCase()
    return artworks.filter(art => 
      art.title.toLowerCase().includes(lowerQuery) ||
      art.artist.toLowerCase().includes(lowerQuery) ||
      art.description.toLowerCase().includes(lowerQuery)
    )
  },

  // Check if artwork is in stock
  isInStock: (id) => {
    const artwork = artworksDB.getById(id)
    if (!artwork) return false
    const stock = artwork.stock || 1
    const soldCount = artwork.soldCount || 0
    return soldCount < stock
  },

  // Get available stock
  getAvailableStock: (id) => {
    const artwork = artworksDB.getById(id)
    if (!artwork) return 0
    const stock = artwork.stock || 1
    const soldCount = artwork.soldCount || 0
    return Math.max(0, stock - soldCount)
  },

  // Reduce stock when item is purchased
  reduceStock: (id, quantity = 1) => {
    const artworks = artworksDB.getAll()
    const index = artworks.findIndex(art => art.id === id)
    if (index !== -1) {
      const currentSold = artworks[index].soldCount || 0
      artworks[index].soldCount = currentSold + quantity
      artworks[index].updatedAt = new Date().toISOString()
      
      // Mark as sold if all stock is gone
      const stock = artworks[index].stock || 1
      if (artworks[index].soldCount >= stock) {
        artworks[index].sold = true
        artworks[index].soldAt = new Date().toISOString()
      }
      
      localStorage.setItem(DB_KEYS.ARTIST_ARTWORKS, JSON.stringify(artworks))
      return artworks[index]
    }
    return null
  }
}

// ==================== ARTISTS ====================
export const artistsDB = {
  // Get all artists
  getAll: () => {
    return JSON.parse(localStorage.getItem(DB_KEYS.ARTISTS) || '[]')
  },

  // Get artist by ID
  getById: (id) => {
    const artists = artistsDB.getAll()
    return artists.find(artist => artist.id === id)
  },

  // Add new artist
  add: (artist) => {
    const artists = artistsDB.getAll()
    const newArtist = {
      ...artist,
      id: Date.now(),
      createdAt: new Date().toISOString()
    }
    artists.push(newArtist)
    localStorage.setItem(DB_KEYS.ARTISTS, JSON.stringify(artists))
    return newArtist
  },

  // Update artist
  update: (id, updatedData) => {
    const artists = artistsDB.getAll()
    const index = artists.findIndex(artist => artist.id === id)
    if (index !== -1) {
      artists[index] = { ...artists[index], ...updatedData, updatedAt: new Date().toISOString() }
      localStorage.setItem(DB_KEYS.ARTISTS, JSON.stringify(artists))
      return artists[index]
    }
    return null
  },

  // Delete artist
  delete: (id) => {
    const artists = artistsDB.getAll()
    const filtered = artists.filter(artist => artist.id !== id)
    localStorage.setItem(DB_KEYS.ARTISTS, JSON.stringify(filtered))
    return true
  }
}

// ==================== USERS ====================
export const usersDB = {
  // Get all users
  getAll: () => {
    return JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]')
  },

  // Get user by email
  getByEmail: (email) => {
    const users = usersDB.getAll()
    return users.find(user => user.email === email)
  },

  // Add new user (registration)
  add: (user) => {
    const users = usersDB.getAll()
    const newUser = {
      ...user,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      profile: {}
    }
    users.push(newUser)
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users))
    return newUser
  },

  // Update user
  update: (email, updatedData) => {
    const users = usersDB.getAll()
    const index = users.findIndex(user => user.email === email)
    if (index !== -1) {
      users[index] = { ...users[index], ...updatedData, updatedAt: new Date().toISOString() }
      localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users))
      
      // Update current user if it's the same
      const currentUser = getCurrentUser()
      if (currentUser && currentUser.email === email) {
        setCurrentUser(users[index])
      }
      
      return users[index]
    }
    return null
  },

  // Delete user
  delete: (email) => {
    const users = usersDB.getAll()
    const filtered = users.filter(user => user.email !== email)
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(filtered))
    return true
  },

  // Login user
  login: (email, password) => {
    const user = usersDB.getByEmail(email)
    if (user && user.password === password) {
      setCurrentUser(user)
      return user
    }
    return null
  }
}

// ==================== CURRENT USER ====================
export const getCurrentUser = () => {
  const userStr = localStorage.getItem(DB_KEYS.CURRENT_USER)
  return userStr ? JSON.parse(userStr) : null
}

export const setCurrentUser = (user) => {
  if (user) {
    localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(user))
  } else {
    localStorage.removeItem(DB_KEYS.CURRENT_USER)
  }
}

export const logout = () => {
  localStorage.removeItem(DB_KEYS.CURRENT_USER)
}

// ==================== CART ====================
export const cartDB = {
  // Get current user's email
  getCurrentUserEmail: () => {
    const user = JSON.parse(localStorage.getItem('user'))
    return user?.email || 'guest'
  },

  // Get cart key for current user
  getCartKey: () => {
    return `cart_${cartDB.getCurrentUserEmail()}`
  },

  // Get cart items for current user
  getAll: () => {
    return JSON.parse(localStorage.getItem(cartDB.getCartKey()) || '[]')
  },

  // Add item to cart
  add: (artwork, quantity = 1) => {
    const cart = cartDB.getAll()
    const existingIndex = cart.findIndex(item => item.id === artwork.id)
    
    if (existingIndex !== -1) {
      cart[existingIndex].quantity += quantity
    } else {
      cart.push({ ...artwork, quantity, addedAt: new Date().toISOString() })
    }
    
    localStorage.setItem(cartDB.getCartKey(), JSON.stringify(cart))
    return cart
  },

  // Update quantity
  updateQuantity: (id, quantity) => {
    const cart = cartDB.getAll()
    const index = cart.findIndex(item => item.id === id)
    if (index !== -1) {
      cart[index].quantity = quantity
      localStorage.setItem(cartDB.getCartKey(), JSON.stringify(cart))
    }
    return cart
  },

  // Remove item
  remove: (id) => {
    const cart = cartDB.getAll()
    const filtered = cart.filter(item => item.id !== id)
    localStorage.setItem(cartDB.getCartKey(), JSON.stringify(filtered))
    return filtered
  },

  // Clear cart
  clear: () => {
    localStorage.setItem(cartDB.getCartKey(), JSON.stringify([]))
    return []
  },

  // Get total
  getTotal: () => {
    const cart = cartDB.getAll()
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }
}

// ==================== WISHLIST ====================
export const wishlistDB = {
  // Get current user's email
  getCurrentUserEmail: () => {
    const user = JSON.parse(localStorage.getItem('user'))
    return user?.email || 'guest'
  },

  // Get wishlist key for current user
  getWishlistKey: () => {
    return `wishlist_${wishlistDB.getCurrentUserEmail()}`
  },

  // Get wishlist items for current user
  getAll: () => {
    return JSON.parse(localStorage.getItem(wishlistDB.getWishlistKey()) || '[]')
  },

  // Add to wishlist
  add: (artwork) => {
    const wishlist = wishlistDB.getAll()
    const exists = wishlist.find(item => item.id === artwork.id)
    
    if (!exists) {
      wishlist.push({ ...artwork, addedAt: new Date().toISOString() })
      localStorage.setItem(wishlistDB.getWishlistKey(), JSON.stringify(wishlist))
    }
    
    return wishlist
  },

  // Remove from wishlist
  remove: (id) => {
    const wishlist = wishlistDB.getAll()
    const filtered = wishlist.filter(item => item.id !== id)
    localStorage.setItem(wishlistDB.getWishlistKey(), JSON.stringify(filtered))
    return filtered
  },

  // Check if in wishlist
  contains: (id) => {
    const wishlist = wishlistDB.getAll()
    return wishlist.some(item => item.id === id)
  },

  // Clear wishlist
  clear: () => {
    localStorage.setItem(wishlistDB.getWishlistKey(), JSON.stringify([]))
    return []
  }
}

// ==================== ORDERS ====================
export const ordersDB = {
  // Get all orders
  getAll: () => {
    return JSON.parse(localStorage.getItem(DB_KEYS.ORDERS) || '[]')
  },

  // Get orders by user email
  getByUser: (userEmail) => {
    const orders = ordersDB.getAll()
    return orders.filter(order => order.userEmail === userEmail)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  },

  // Get order by ID
  getById: (id) => {
    const orders = ordersDB.getAll()
    return orders.find(order => order.id === id)
  },

  // Get order by order number
  getByOrderNumber: (orderNumber) => {
    const orders = ordersDB.getAll()
    return orders.find(order => order.orderNumber === orderNumber)
  },

  // Create order
  create: (orderData) => {
    const orders = ordersDB.getAll()
    const orderNumber = `ORD${Date.now()}`
    const newOrder = {
      ...orderData,
      id: Date.now(),
      orderNumber: orderNumber,
      status: orderData.status || 'pending',
      paymentStatus: orderData.paymentStatus || 'pending',
      trackingNumber: null,
      estimatedDelivery: null,
      statusHistory: [
        {
          status: 'pending',
          timestamp: new Date().toISOString(),
          note: 'Order placed successfully'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    orders.push(newOrder)
    localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(orders))
    return newOrder
  },

  // Update order
  update: (id, updatedData) => {
    const orders = ordersDB.getAll()
    const index = orders.findIndex(order => order.id === id)
    if (index !== -1) {
      orders[index] = {
        ...orders[index],
        ...updatedData,
        updatedAt: new Date().toISOString()
      }
      localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(orders))
      return orders[index]
    }
    return null
  },

  // Update order status with history tracking
  updateStatus: (id, status, note = '') => {
    const orders = ordersDB.getAll()
    const index = orders.findIndex(order => order.id === id)
    if (index !== -1) {
      const statusUpdate = {
        status: status,
        timestamp: new Date().toISOString(),
        note: note || `Order status changed to ${status}`
      }
      
      orders[index].status = status
      orders[index].statusHistory = orders[index].statusHistory || []
      orders[index].statusHistory.push(statusUpdate)
      orders[index].updatedAt = new Date().toISOString()
      
      localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(orders))
      return orders[index]
    }
    return null
  },

  // Update payment status
  updatePaymentStatus: (id, paymentStatus) => {
    const orders = ordersDB.getAll()
    const index = orders.findIndex(order => order.id === id)
    if (index !== -1) {
      orders[index].paymentStatus = paymentStatus
      orders[index].updatedAt = new Date().toISOString()
      localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(orders))
      return orders[index]
    }
    return null
  },

  // Add tracking information
  addTracking: (id, trackingNumber, carrier, estimatedDelivery) => {
    const orders = ordersDB.getAll()
    const index = orders.findIndex(order => order.id === id)
    if (index !== -1) {
      orders[index].trackingNumber = trackingNumber
      orders[index].carrier = carrier
      orders[index].estimatedDelivery = estimatedDelivery
      orders[index].updatedAt = new Date().toISOString()
      localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(orders))
      return orders[index]
    }
    return null
  },

  // Cancel order
  cancel: (id, reason = '') => {
    return ordersDB.updateStatus(id, 'cancelled', reason || 'Order cancelled by user')
  },

  // Get orders by status
  getByStatus: (status) => {
    const orders = ordersDB.getAll()
    return orders.filter(order => order.status === status)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  },

  // Get recent orders (last N orders)
  getRecent: (limit = 10) => {
    const orders = ordersDB.getAll()
    return orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit)
  },

  // Search orders
  search: (query) => {
    const orders = ordersDB.getAll()
    const lowerQuery = query.toLowerCase()
    return orders.filter(order =>
      order.orderNumber.toLowerCase().includes(lowerQuery) ||
      order.userEmail.toLowerCase().includes(lowerQuery) ||
      order.shippingInfo?.fullName.toLowerCase().includes(lowerQuery)
    )
  },

  // Get order statistics
  getStats: () => {
    const orders = ordersDB.getAll()
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      totalRevenue: orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, order) => sum + (order.total || 0), 0),
      averageOrderValue: orders.length > 0
        ? orders.reduce((sum, order) => sum + (order.total || 0), 0) / orders.length
        : 0
    }
  },

  // Get user order statistics
  getUserStats: (userEmail) => {
    const orders = ordersDB.getByUser(userEmail)
    return {
      totalOrders: orders.length,
      totalSpent: orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, order) => sum + (order.total || 0), 0),
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      completedOrders: orders.filter(o => o.status === 'delivered').length
    }
  },

  // Delete order (admin only)
  delete: (id) => {
    const orders = ordersDB.getAll()
    const filtered = orders.filter(order => order.id !== id)
    localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(filtered))
    return true
  }
}

// ==================== REVIEWS ====================
export const reviewsDB = {
  // Get all reviews
  getAll: () => {
    return JSON.parse(localStorage.getItem(DB_KEYS.REVIEWS) || '[]')
  },

  // Get reviews for artwork
  getByArtwork: (artworkId) => {
    const reviews = reviewsDB.getAll()
    return reviews.filter(review => review.artworkId === artworkId)
  },

  // Add review
  add: (review) => {
    const reviews = reviewsDB.getAll()
    const newReview = {
      ...review,
      id: Date.now(),
      createdAt: new Date().toISOString()
    }
    reviews.push(newReview)
    localStorage.setItem(DB_KEYS.REVIEWS, JSON.stringify(reviews))
    return newReview
  },

  // Delete review
  delete: (id) => {
    const reviews = reviewsDB.getAll()
    const filtered = reviews.filter(review => review.id !== id)
    localStorage.setItem(DB_KEYS.REVIEWS, JSON.stringify(filtered))
    return true
  }
}

// ==================== MESSAGES ====================
export const messagesDB = {
  // Get all messages
  getAll: () => {
    return JSON.parse(localStorage.getItem(DB_KEYS.MESSAGES) || '[]')
  },

  // Get message by ID
  getById: (id) => {
    const messages = messagesDB.getAll()
    return messages.find(msg => msg.id === id)
  },

  // Add new message
  add: (messageData) => {
    const messages = messagesDB.getAll()
    const newMessage = {
      id: Date.now(),
      ...messageData,
      status: 'unread',
      createdAt: new Date().toISOString()
    }
    messages.push(newMessage)
    localStorage.setItem(DB_KEYS.MESSAGES, JSON.stringify(messages))
    return newMessage
  },

  // Mark as read
  markAsRead: (id) => {
    const messages = messagesDB.getAll()
    const index = messages.findIndex(msg => msg.id === id)
    if (index !== -1) {
      messages[index].status = 'read'
      localStorage.setItem(DB_KEYS.MESSAGES, JSON.stringify(messages))
      return messages[index]
    }
    return null
  },

  // Delete message
  delete: (id) => {
    const messages = messagesDB.getAll()
    const filtered = messages.filter(msg => msg.id !== id)
    localStorage.setItem(DB_KEYS.MESSAGES, JSON.stringify(filtered))
    return true
  },

  // Get unread count
  getUnreadCount: () => {
    const messages = messagesDB.getAll()
    return messages.filter(msg => msg.status === 'unread').length
  }
}

// Initialize database on import
initializeDatabase()

// Export database object
const database = {
  artworks: artworksDB,
  artists: artistsDB,
  users: usersDB,
  cart: cartDB,
  wishlist: wishlistDB,
  orders: ordersDB,
  reviews: reviewsDB,
  messages: messagesDB,
  getCurrentUser,
  setCurrentUser,
  logout,
  initializeDatabase
}

export default database
