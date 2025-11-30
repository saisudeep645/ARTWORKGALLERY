// Account Details Database Manager
// Manages user accounts, profiles, and authentication

const ACCOUNT_DB_KEY = 'gallery_accounts'
const CURRENT_SESSION_KEY = 'gallery_session'

// Account Schema
const createAccountSchema = (data) => ({
  id: data.id || Date.now(),
  email: data.email,
  password: data.password,
  name: data.name,
  role: data.role || 'user', // 'admin', 'artist', 'user'
  status: data.status || 'active', // 'active', 'inactive', 'suspended'
  
  // Profile Information
  profile: {
    phone: data.profile?.phone || '',
    address: data.profile?.address || '',
    city: data.profile?.city || '',
    state: data.profile?.state || '',
    zipCode: data.profile?.zipCode || '',
    country: data.profile?.country || '',
    bio: data.profile?.bio || '',
    avatar: data.profile?.avatar || '',
    website: data.profile?.website || '',
    instagram: data.profile?.instagram || '',
    facebook: data.profile?.facebook || '',
    twitter: data.profile?.twitter || '',
    
    // Artist-specific fields
    specialization: data.profile?.specialization || '',
    birthYear: data.profile?.birthYear || '',
    nationality: data.profile?.nationality || '',
    education: data.profile?.education || '',
    exhibitions: data.profile?.exhibitions || [],
    awards: data.profile?.awards || [],
    
    // Preferences
    newsletter: data.profile?.newsletter || false,
    notifications: data.profile?.notifications || true,
    language: data.profile?.language || 'en',
    currency: data.profile?.currency || 'USD'
  },
  
  // Metadata
  createdAt: data.createdAt || new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  lastLogin: data.lastLogin || null,
  loginCount: data.loginCount || 0,
  
  // Security
  emailVerified: data.emailVerified || false,
  twoFactorEnabled: data.twoFactorEnabled || false,
  
  // Statistics
  stats: {
    artworksCreated: data.stats?.artworksCreated || 0,
    artworksSold: data.stats?.artworksSold || 0,
    totalRevenue: data.stats?.totalRevenue || 0,
    ordersPlaced: data.stats?.ordersPlaced || 0,
    reviewsGiven: data.stats?.reviewsGiven || 0,
    wishlistItems: data.stats?.wishlistItems || 0
  }
})

// Initialize accounts database
const initAccountsDB = () => {
  if (!localStorage.getItem(ACCOUNT_DB_KEY)) {
    // Create default admin account
    const defaultAdmin = createAccountSchema({
      email: 'admin@gallery.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'admin',
      emailVerified: true
    })
    
    // Create default artist account
    const defaultArtist = createAccountSchema({
      email: 'artist@gallery.com',
      password: 'artist123',
      name: 'Demo Artist',
      role: 'artist',
      emailVerified: true,
      profile: {
        specialization: 'Contemporary Art',
        bio: 'Professional artist specializing in contemporary abstract art.'
      }
    })
    
    // Create default curator account
    const defaultCurator = createAccountSchema({
      email: 'curator@gallery.com',
      password: 'curator123',
      name: 'Art Curator',
      role: 'curator',
      emailVerified: true,
      profile: {
        specialization: 'Modern & Contemporary Art',
        bio: 'Professional art curator with 8+ years of experience in evaluating and curating contemporary artworks.'
      }
    })
    
    localStorage.setItem(ACCOUNT_DB_KEY, JSON.stringify([defaultAdmin, defaultArtist, defaultCurator]))
  }
}

// Account Database Operations
export const accountsDB = {
  // Get all accounts
  getAll: () => {
    return JSON.parse(localStorage.getItem(ACCOUNT_DB_KEY) || '[]')
  },

  // Get account by ID
  getById: (id) => {
    const accounts = accountsDB.getAll()
    return accounts.find(acc => acc.id === id)
  },

  // Get account by email
  getByEmail: (email) => {
    const accounts = accountsDB.getAll()
    return accounts.find(acc => acc.email.toLowerCase() === email.toLowerCase())
  },

  // Check if email exists
  emailExists: (email) => {
    return accountsDB.getByEmail(email) !== undefined
  },

  // Create new account
  create: (accountData) => {
    const accounts = accountsDB.getAll()
    
    // Check if email already exists
    if (accountsDB.emailExists(accountData.email)) {
      throw new Error('Email already exists')
    }
    
    const newAccount = createAccountSchema(accountData)
    accounts.push(newAccount)
    localStorage.setItem(ACCOUNT_DB_KEY, JSON.stringify(accounts))
    
    return { ...newAccount, password: undefined } // Don't return password
  },

  // Update account
  update: (id, updateData) => {
    const accounts = accountsDB.getAll()
    const index = accounts.findIndex(acc => acc.id === id)
    
    if (index === -1) {
      throw new Error('Account not found')
    }
    
    // Merge updates
    accounts[index] = {
      ...accounts[index],
      ...updateData,
      id: accounts[index].id, // Preserve ID
      email: accounts[index].email, // Preserve email
      createdAt: accounts[index].createdAt, // Preserve creation date
      updatedAt: new Date().toISOString()
    }
    
    localStorage.setItem(ACCOUNT_DB_KEY, JSON.stringify(accounts))
    
    // Update session if current user
    const session = sessionDB.get()
    if (session && session.id === id) {
      sessionDB.set(accounts[index])
    }
    
    return { ...accounts[index], password: undefined }
  },

  // Update profile
  updateProfile: (id, profileData) => {
    const accounts = accountsDB.getAll()
    const index = accounts.findIndex(acc => acc.id === id)
    
    if (index === -1) {
      throw new Error('Account not found')
    }
    
    accounts[index].profile = {
      ...accounts[index].profile,
      ...profileData
    }
    accounts[index].updatedAt = new Date().toISOString()
    
    localStorage.setItem(ACCOUNT_DB_KEY, JSON.stringify(accounts))
    
    // Update session
    const session = sessionDB.get()
    if (session && session.id === id) {
      sessionDB.set(accounts[index])
    }
    
    return { ...accounts[index], password: undefined }
  },

  // Update statistics
  updateStats: (id, statsUpdate) => {
    const accounts = accountsDB.getAll()
    const index = accounts.findIndex(acc => acc.id === id)
    
    if (index !== -1) {
      accounts[index].stats = {
        ...accounts[index].stats,
        ...statsUpdate
      }
      localStorage.setItem(ACCOUNT_DB_KEY, JSON.stringify(accounts))
    }
  },

  // Change password
  changePassword: (id, oldPassword, newPassword) => {
    const accounts = accountsDB.getAll()
    const index = accounts.findIndex(acc => acc.id === id)
    
    if (index === -1) {
      throw new Error('Account not found')
    }
    
    if (accounts[index].password !== oldPassword) {
      throw new Error('Incorrect current password')
    }
    
    accounts[index].password = newPassword
    accounts[index].updatedAt = new Date().toISOString()
    localStorage.setItem(ACCOUNT_DB_KEY, JSON.stringify(accounts))
    
    return true
  },

  // Delete account
  delete: (id) => {
    const accounts = accountsDB.getAll()
    const filtered = accounts.filter(acc => acc.id !== id)
    localStorage.setItem(ACCOUNT_DB_KEY, JSON.stringify(filtered))
    
    // Clear session if deleted user is current user
    const session = sessionDB.get()
    if (session && session.id === id) {
      sessionDB.clear()
    }
    
    return true
  },

  // Get accounts by role
  getByRole: (role) => {
    const accounts = accountsDB.getAll()
    return accounts.filter(acc => acc.role === role).map(acc => ({ ...acc, password: undefined }))
  },

  // Search accounts
  search: (query) => {
    const accounts = accountsDB.getAll()
    const lowerQuery = query.toLowerCase()
    
    return accounts.filter(acc => 
      acc.name.toLowerCase().includes(lowerQuery) ||
      acc.email.toLowerCase().includes(lowerQuery) ||
      acc.profile.bio.toLowerCase().includes(lowerQuery)
    ).map(acc => ({ ...acc, password: undefined }))
  },

  // Get account statistics summary
  getAccountStats: (id) => {
    const account = accountsDB.getById(id)
    return account ? account.stats : null
  }
}

// Session Management
export const sessionDB = {
  // Get current session
  get: () => {
    const sessionStr = localStorage.getItem(CURRENT_SESSION_KEY)
    return sessionStr ? JSON.parse(sessionStr) : null
  },

  // Set session (login)
  set: (account) => {
    const sessionData = { ...account, password: undefined }
    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(sessionData))
    
    // Update last login
    const accounts = accountsDB.getAll()
    const index = accounts.findIndex(acc => acc.id === account.id)
    if (index !== -1) {
      accounts[index].lastLogin = new Date().toISOString()
      accounts[index].loginCount += 1
      localStorage.setItem(ACCOUNT_DB_KEY, JSON.stringify(accounts))
    }
  },

  // Clear session (logout)
  clear: () => {
    localStorage.removeItem(CURRENT_SESSION_KEY)
  },

  // Check if logged in
  isLoggedIn: () => {
    return sessionDB.get() !== null
  },

  // Get current user role
  getRole: () => {
    const session = sessionDB.get()
    return session ? session.role : null
  },

  // Check if current user has role
  hasRole: (role) => {
    const session = sessionDB.get()
    return session && session.role === role
  },

  // Check if current user is admin
  isAdmin: () => {
    return sessionDB.hasRole('admin')
  },

  // Check if current user is artist
  isArtist: () => {
    return sessionDB.hasRole('artist')
  }
}

// Authentication
export const authDB = {
  // Login
  login: (email, password) => {
    const account = accountsDB.getByEmail(email)
    
    if (!account) {
      throw new Error('Invalid email or password')
    }
    
    if (account.password !== password) {
      throw new Error('Invalid email or password')
    }
    
    if (account.status !== 'active') {
      throw new Error('Account is inactive or suspended')
    }
    
    sessionDB.set(account)
    return { ...account, password: undefined }
  },

  // Register
  register: (registrationData) => {
    const newAccount = accountsDB.create(registrationData)
    sessionDB.set(newAccount)
    return newAccount
  },

  // Logout
  logout: () => {
    sessionDB.clear()
  },

  // Get current user
  getCurrentUser: () => {
    return sessionDB.get()
  },

  // Update current user profile
  updateCurrentUserProfile: (profileData) => {
    const currentUser = sessionDB.get()
    if (!currentUser) {
      throw new Error('No user logged in')
    }
    return accountsDB.updateProfile(currentUser.id, profileData)
  }
}

// Initialize on import
initAccountsDB()

// Export main object
const accountDatabase = {
  accounts: accountsDB,
  session: sessionDB,
  auth: authDB
}

export default accountDatabase
