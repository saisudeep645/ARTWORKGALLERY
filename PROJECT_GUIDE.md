# 🎨 Art Gallery - Complete Project Guide

## 📋 Project Overview

A modern, full-featured art gallery web application built with **React + Vite**. Features include role-based authentication, artwork management, e-commerce functionality, order tracking, and OTP verification.

---

## 🎨 Design System

### Color Palette

#### Primary Colors
- **Purple**: `#667eea` - Primary brand color
- **Dark Purple**: `#764ba2` - Gradients and accents
- **Light Purple**: `#8a94f7` - Hover states

#### Accent Colors
- **Gold**: `#f6d365` - Highlights
- **Orange**: `#fda085` - Call-to-action
- **Pink**: `#fa709a` - Featured items
- **Blue**: `#30cfd0` - Information

#### Neutral Colors
- **Gray Scale**: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900
- **White**: `#ffffff`
- **Black**: `#1a1a1a`

#### Status Colors
- **Success**: `#10b981` (Green)
- **Warning**: `#f59e0b` (Orange)
- **Error**: `#ef4444` (Red)
- **Info**: `#3b82f6` (Blue)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800, 900

### Shadows
- Small: `0 1px 2px rgba(0, 0, 0, 0.05)`
- Medium: `0 4px 6px rgba(0, 0, 0, 0.1)`
- Large: `0 10px 15px rgba(0, 0, 0, 0.1)`
- Extra Large: `0 20px 25px rgba(0, 0, 0, 0.1)`
- 2XL: `0 25px 50px rgba(0, 0, 0, 0.25)`

### Border Radius
- Small: `0.375rem`
- Medium: `0.5rem`
- Large: `0.75rem`
- XL: `1rem`
- 2XL: `1.5rem`
- Full: `9999px`

---

## 🚀 Features

### 1. **Authentication System**
- ✅ Login with OTP verification (6-digit code)
- ✅ User registration
- ✅ Role-based access control (Admin, Artist, User)
- ✅ Persistent sessions with localStorage

### 2. **Role-Based Features**

#### Admin
- Full dashboard with overview statistics
- Manage Artworks (view, edit, delete)
- Manage Artists (view, edit, delete)
- Add new artworks and artists
- **Dedicated Edit Artworks tab** - Card-based editing interface
- **Dedicated Delete Artworks tab** - Safe deletion with confirmations
- Edit/delete artworks directly in Gallery (admin only)

#### Artist
- Personal dashboard
- Add their own artworks
- View and manage their portfolio
- Access to shopping cart
- Order tracking

#### User/Visitor
- Browse gallery and artists
- Add items to cart and wishlist
- Complete checkout process
- Track orders
- View artworks (cannot edit/delete)

### 3. **Art Gallery**
- Browse all artworks (static + database)
- Filter by artist and category
- Search functionality
- Admin-only edit/delete buttons (hover to see)
- Inline editing for database artworks
- Protected static artworks

### 4. **E-Commerce**
- Shopping cart with add/remove items
- Wishlist functionality
- 3-step checkout process:
  1. Shipping information
  2. Payment method (Credit Card, PayPal, Bank Transfer)
  3. Order review
- Success page with order confirmation

### 5. **Order Management**
- Order history (My Orders page)
- 5-stage delivery tracking:
  - Order Placed
  - Processing
  - Shipped
  - Out for Delivery
  - Delivered
- Visual progress timeline with location updates
- Track Order modal with detailed status

### 6. **Database Systems**
- **artworksDB**: Full CRUD operations for artworks
- **artistsDB**: Full CRUD operations for artists
- **ordersDB**: Order creation, tracking, status updates
- **accountDB**: User authentication and profile management
- All data persists in localStorage

---

## 📁 Project Structure

```
FEDF PROJECT 1/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Navigation with role-based links
│   │   └── Navbar.css          # Enhanced navbar styling
│   ├── data/
│   │   ├── artworks.js         # Static artwork data
│   │   └── artists.js          # Static artist data
│   ├── pages/
│   │   ├── Home.jsx            # Landing page
│   │   ├── Gallery.jsx         # Gallery with admin edit/delete
│   │   ├── Artists.jsx         # Artist showcase
│   │   ├── Login.jsx           # Login with OTP
│   │   ├── Register.jsx        # User registration
│   │   ├── Cart.jsx            # Shopping cart
│   │   ├── Checkout.jsx        # 3-step checkout
│   │   ├── Orders.jsx          # Order history + tracking
│   │   ├── AdminDashboard.jsx  # Admin control panel
│   │   ├── ArtistDashboard.jsx # Artist management
│   │   └── [All CSS files]     # Page-specific styles
│   ├── utils/
│   │   ├── database.js         # Main database (artworks, orders, etc.)
│   │   └── accountDatabase.js  # User accounts database
│   ├── App.jsx                 # Main app with routing
│   ├── main.jsx                # React entry point
│   └── index.css               # Global styles with CSS variables
├── index.html                  # HTML template with Inter font
├── package.json                # Dependencies
├── vite.config.js              # Vite configuration
└── PROJECT_GUIDE.md            # This file
```

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   ```
   http://localhost:5173
   ```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

---

## 👤 Demo Credentials

### Admin Account
- **Email**: admin@gallery.com
- **Password**: admin123
- **Access**: Full dashboard, manage all artworks/artists, edit/delete in gallery

### Artist Account
- **Email**: artist@gallery.com
- **Password**: artist123
- **Access**: Artist dashboard, add artworks, shopping cart

### User Account
- **Email**: Any email
- **Password**: Any password (6+ characters)
- **Access**: Browse, shop, track orders

---

## 🎯 Key Pages & Routes

| Route | Page | Access | Description |
|-------|------|--------|-------------|
| `/` | Home | Public | Landing page with hero banner |
| `/gallery` | Gallery | Public | Browse all artworks (admin can edit/delete) |
| `/artists` | Artists | Public | View all artists |
| `/login` | Login | Public | Login with OTP verification |
| `/register` | Register | Public | User registration |
| `/cart` | Cart | User/Artist | Shopping cart |
| `/checkout` | Checkout | User/Artist | 3-step checkout process |
| `/orders` | My Orders | User/Artist | Order history + tracking |
| `/admin` | Admin Dashboard | Admin Only | Full management dashboard |
| `/artist-dashboard` | Artist Dashboard | Artist Only | Artist management panel |

---

## 🎨 Admin Dashboard Features

### Tabs Overview
1. **Overview** - Statistics and recent activity
2. **Manage Artworks** - Table view with inline edit/delete
3. **Manage Artists** - Table view with inline edit/delete
4. **Add Artwork** - Form to add new artwork
5. **Edit Artworks** ✨ NEW - Card-based artwork editing
6. **Delete Artworks** ✨ NEW - Safe artwork deletion
7. **Add Artist** - Form to add new artist

### Edit Artworks Tab
- Grid layout with artwork cards
- Click "✏️ Edit Artwork" to edit inline
- See image preview while editing
- Edit: Title, Artist, Price, Year, Image URL
- Save or Cancel changes

### Delete Artworks Tab
- Grid layout showing all artworks
- Click "🗑️ Delete Artwork" with confirmation
- Permanent deletion from database

---

## 🛒 Checkout Process

### Step 1: Shipping Information
- Full name, email, phone
- Complete address with state and zip
- Validation for all fields

### Step 2: Payment Method
- Credit/Debit Card
- PayPal
- Bank Transfer
- Visual selection with icons

### Step 3: Order Review
- Review all items
- See total amount
- Confirm shipping and payment details
- Place order

### Success Page
- Order confirmation with order number
- 5-stage visual tracking timeline:
  1. Order Placed ✓
  2. Processing (with location)
  3. Shipped (with location)
  4. Out for Delivery (with location)
  5. Delivered (final location)
- Horizontal progress tracker with animations

---

## 📦 Order Tracking

### My Orders Page
- List of all orders with status
- Order date, total amount, items count
- "Track Order" button for each order

### Track Order Modal
- Vertical timeline with 5 stages
- Current status highlighted
- Location information for each stage
- Estimated delivery date
- Order items summary

---

## 🎨 Gallery Edit/Delete (Admin)

### How it Works
1. **Login as Admin** (admin@gallery.com / admin123)
2. **Go to Gallery Page**
3. **Hover over database artworks** - See ✏️ and 🗑️ buttons
4. **Click ✏️ Edit** - Inline form appears
5. **Edit fields** - Title, Artist, Price, Year, Image URL
6. **Save or Cancel** - Changes persist in database
7. **Click 🗑️ Delete** - Confirmation dialog, then deletion

### Protected Features
- Static artworks (from `/data/artworks.js`) cannot be edited
- Only database artworks show edit/delete buttons
- Confirmation required before deletion
- Real-time updates after changes

---

## 🔐 OTP Verification

### How OTP Works
1. User enters email and password
2. System generates 6-digit OTP (shown in alert for demo)
3. User enters OTP in 6 separate input boxes
4. System verifies OTP
5. On success, user is logged in and redirected

### OTP Features
- Auto-focus moves to next input
- Backspace moves to previous input
- Resend OTP button
- Back to Login option
- Error handling for invalid OTP

**Note**: In production, OTP would be sent via email/SMS using services like SendGrid or Twilio.

---

## 🎨 Styling Best Practices

### Using CSS Variables
```css
/* Instead of hardcoded colors */
color: var(--primary-purple);
background: var(--white);
box-shadow: var(--shadow-lg);
border-radius: var(--radius-xl);
```

### Button Classes
```jsx
<button className="btn btn-primary btn-large">
  Click Me
</button>
```

### Card Components
```jsx
<div className="card">
  <h3>Card Title</h3>
  <p>Card content</p>
</div>
```

### Animations
```jsx
<div className="fade-in">
  Animated content
</div>
```

---

## 📸 Sample Artwork URLs

Use these high-quality image URLs when adding artworks:

1. `https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800`
2. `https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800`
3. `https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800`
4. `https://images.unsplash.com/photo-1549887534-1541e9326642?w=800`
5. `https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=800`
6. `https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800`
7. `https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800`
8. `https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800`
9. `https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800`
10. `https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=800`

---

## 🐛 Troubleshooting

### PowerShell Script Execution Error
If you get "cannot be loaded because running scripts is disabled":
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Port Already in Use
Change the port in `vite.config.js`:
```js
export default defineConfig({
  server: {
    port: 3000 // Change to any available port
  }
})
```

### Database Not Persisting
- Check browser console for localStorage errors
- Clear localStorage and refresh: `localStorage.clear()`
- Ensure browser allows localStorage

---

## 📝 Future Enhancements

- [ ] Email/SMS integration for OTP
- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Real-time order notifications
- [ ] Advanced search with filters
- [ ] Artist profiles with portfolios
- [ ] User reviews and ratings
- [ ] Wishlist sharing
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Export orders to PDF

---

## 📄 License

This project is created for educational purposes.

---

## 👨‍💻 Developer Notes

### CSS Variables Location
All global CSS variables are in `src/index.css`

### Database Functions
All database operations are in:
- `src/utils/database.js` - Artworks, orders, cart, wishlist
- `src/utils/accountDatabase.js` - User accounts

### Adding New Features
1. Create component in `src/pages/` or `src/components/`
2. Add route in `src/App.jsx`
3. Add navigation link in `src/components/Navbar.jsx`
4. Style using CSS variables from `src/index.css`

---

## 🎉 Project Highlights

✨ **15 Complete Pages**  
🎨 **Modern Design System with CSS Variables**  
🔐 **Secure Authentication with OTP**  
👑 **Role-Based Access Control**  
🛒 **Full E-Commerce Functionality**  
📦 **Visual Order Tracking**  
✏️ **Admin Artwork Management**  
📱 **Responsive Design**  
⚡ **Fast Development with Vite**  
💾 **Persistent Data Storage**

---

**Made with ❤️ using React + Vite**
