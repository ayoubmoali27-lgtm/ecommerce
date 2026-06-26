# 🛍️ NextCom E-Commerce Full-Stack App

A complete full-stack e-commerce application built with **Next.js**, **Node.js/Express**, **SQL Server**, and **MongoDB**.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Setup Instructions](#setup-instructions)
5. [Running the App](#running-the-app)
6. [Features](#features)
7. [Database Schema](#database-schema)
8. [API Documentation](#api-documentation)
9. [User Roles](#user-roles)
10. [Common Issues & Fixes](#common-issues--fixes)
11. [Next Steps](#next-steps)

---

## 🎯 Project Overview

**NextCom** is a full-featured e-commerce platform where:
- **Users** can browse products, add to cart, and place orders
- **Admins** can manage products, view all orders, and manage users
- Products are stored in **MongoDB**, orders in **SQL Server**
- Authentication uses **JWT tokens**

---

## 🔧 Tech Stack

### Frontend
- **Next.js 14** (App Router) - React framework
- **Tailwind CSS** - Styling
- **lucide-react** - Icons
- **Axios** - HTTP requests
- **JavaScript** (not TypeScript)

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **SQL Server** - Orders & users database
- **MongoDB** - Products, categories, reviews, carts
- **JWT** - Authentication
- **bcrypt** - Password hashing

---

## 📁 Project Structure

```
ecommerce/
├── backend/
│   ├── index.js                 # Main server file
│   ├── config.js                # Database config
│   ├── controllers/
│   │   ├── authController.js    # Login, register, users
│   │   ├── productController.js # Products, categories
│   │   ├── cartController.js    # Cart management
│   │   ├── orderController.js   # Orders
│   │   └── reviewController.js  # Reviews
│   ├── routes/
│   │   ├── auth.js              # Auth routes
│   │   ├── product.js           # Product routes
│   │   ├── cart.js              # Cart routes
│   │   ├── order.js             # Order routes
│   │   └── review.js            # Review routes
│   ├── middleware/
│   │   ├── requireAuth.js       # JWT authentication
│   │   └── requireAdmin.js      # Admin check
│   └── models/
│       ├── product.js           # MongoDB product schema
│       ├── cart.js              # MongoDB cart schema
│       └── review.js            # MongoDB review schema
│
└── frontend/
    └── src/
        ├── app/
        │   ├── layout.js              # Root layout
        │   ├── page.js                # Homepage
        │   ├── globals.css            # Global styles
        │   ├── login/page.js          # Login page
        │   ├── products/page.js       # Products listing
        │   ├── products/[slug]/page.js # Product detail
        │   ├── cart/page.js           # Shopping cart
        │   ├── checkout/page.js       # Checkout (optional)
        │   ├── order/[id]/page.js     # Order confirmation
        │   ├── orders/page.js         # Admin: all orders
        │   ├── users/page.js          # Admin: users management
        │   └── account/page.js        # User account
        │
        └── components/
            ├── NavBar.jsx             # Navigation bar (with admin dropdown)
            ├── Footer.jsx             # Footer
            ├── HeroSection.jsx        # Homepage hero
            ├── HeroSlider.jsx         # Image slider
            ├── Category.jsx           # Category component
            ├── NewArrivals.jsx        # New products section
            ├── BestSellers.jsx        # Popular products
            ├── Feedbacks.jsx          # Reviews section
            └── PromoBanners.jsx       # Promotional banners
```

---

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** (v16+) installed
- **SQL Server** installed and running
- **MongoDB Atlas** account (or local MongoDB)
- **Git** (optional)

### 1. Backend Setup

```bash
cd ecommerce

# Install dependencies
npm install

# Create .env file (optional, for environment variables)
touch .env

# Start the backend
npm start
# Server runs on http://localhost:3000
```

**Backend requires:**
- SQL Server connection (default: `sa` user, password `Admin123?`)
- MongoDB connection (Atlas URI in models)

### 2. Frontend Setup

```bash
cd ecommerce/frontend

# Install dependencies
npm install

# Start the frontend
npm run dev
# App runs on http://localhost:3001
```

---

## ▶️ Running the App

### Start Both Services

**Terminal 1 - Backend:**
```bash
cd ecommerce
npm start
```

**Terminal 2 - Frontend:**
```bash
cd ecommerce/frontend
npm run dev
```

**Then open:** `http://localhost:3001`

---

## ✨ Features

### 🛒 Customer Features
- ✅ Browse products by category
- ✅ View product details
- ✅ Add to cart
- ✅ Manage cart (add, remove, change quantity)
- ✅ Checkout and place order
- ✅ View order confirmation
- ✅ View reviews and ratings
- ✅ Search products
- ✅ Filter by category

### 👨‍💼 Admin Features
- ✅ View all orders
- ✅ Update order status (pending → processing → shipped → delivered)
- ✅ View all users
- ✅ Change user role (user ↔ admin)
- ✅ Delete users
- ✅ View order statistics
- ✅ View revenue data

### 🔐 Authentication
- ✅ User registration
- ✅ Login with email/password
- ✅ JWT token storage
- ✅ Protected routes (admin only)
- ✅ Auto-login check

---

## 🗄️ Database Schema

### SQL Server (Orders & Users)

**users table:**
```sql
CREATE TABLE users (
  id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  email NVARCHAR(255) UNIQUE NOT NULL,
  password NVARCHAR(255) NOT NULL,
  name NVARCHAR(255),
  role NVARCHAR(50) DEFAULT 'customer', -- 'customer' or 'admin'
  createdAt DATETIME DEFAULT GETDATE()
)
```

**orders table:**
```sql
CREATE TABLE orders (
  id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  user_id UNIQUEIDENTIFIER NOT NULL,
  status NVARCHAR(50) DEFAULT 'pending',
  total INT, -- price in cents
  created DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (user_id) REFERENCES users(id)
)
```

**order_item table:**
```sql
CREATE TABLE order_item (
  id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  order_id UNIQUEIDENTIFIER NOT NULL,
  product_id NVARCHAR(255),
  product_name NVARCHAR(255),
  quantity INT,
  price INT,
  FOREIGN KEY (order_id) REFERENCES orders(id)
)
```

### MongoDB (Products, Carts, Reviews)

**products collection:**
```javascript
{
  _id: ObjectId,
  name: String,
  slug: String,
  price: Number, // in cents
  description: String,
  image: [String], // array of image URLs
  category_id: ObjectId,
  stock: Number,
  createdAt: Date
}
```

**carts collection:**
```javascript
{
  _id: ObjectId,
  user_id: UUID,
  items: [
    {
      product_id: ObjectId,
      quantity: Number
    }
  ]
}
```

---

## 📡 API Documentation

### Authentication Routes

**POST /api/auth/register**
```json
Request:
{ "email": "user@example.com", "password": "123456", "name": "John" }

Response:
{ "user": { "id": "...", "email": "...", "role": "customer" } }
```

**POST /api/auth/login**
```json
Request:
{ "email": "user@example.com", "password": "123456" }

Response:
{ "token": "jwt...", "user": { "id": "...", "email": "...", "role": "..." } }
```

### Product Routes

**GET /api/products** - Get all products
**GET /api/products/:slug** - Get single product
**GET /api/categories** - Get all categories

### Cart Routes (Protected)

**GET /api/cart** - Get user's cart
**POST /api/cart** - Add to cart
```json
{ "product_id": "...", "quantity": 1 }
```
**DELETE /api/cart/:productId** - Remove from cart

### Order Routes (Protected)

**POST /api/orders** - Create order (from cart)
**GET /api/orders/:id** - Get order details
**GET /api/orders** - Get all orders (admin only)
**PUT /api/orders/:id** - Update order status (admin only)
```json
{ "status": "shipped" }
```

### User Routes (Protected, Admin Only)

**GET /api/users** - Get all users
**PUT /api/users/:id** - Update user role
```json
{ "role": "admin" }
```
**DELETE /api/users/:id** - Delete user

### Review Routes

**GET /api/reviews** - Get recent reviews
**GET /api/reviews/product/:productId** - Get product reviews
**POST /api/reviews** - Create review (protected)

---

## 👥 User Roles

### Customer (default)
- Can browse products
- Can add to cart and checkout
- Can view their own orders
- Can leave reviews

### Admin
- Can see **Admin** dropdown in navbar
- Can access `/orders` page → manage all orders
- Can access `/users` page → manage all users
- Can change order status
- Can change user roles
- Can delete users

---

## 🐛 Common Issues & Fixes

### Issue 1: "CORS error" when frontend calls backend
**Fix:** Make sure backend has `npm install cors` and `app.use(cors())` is before routes in `index.js`

```javascript
const cors = require("cors");
app.use(cors());  // ← must be BEFORE routes
app.use("/api", authRoutes);
```

### Issue 2: "ETIMEDOUT" when connecting to MongoDB
**Fix:** Add your IP to MongoDB Atlas whitelist
- Go to MongoDB Atlas → Network Access
- Click "Add IP Address"
- Add `0.0.0.0/0` (or your specific IP)

### Issue 3: Admin dropdown doesn't appear after login
**Fix:** Make sure you're storing the user in localStorage during login:

```javascript
localStorage.setItem("user", JSON.stringify(res.data.user));
```

And dispatching the login event:
```javascript
window.dispatchEvent(new Event("userLoggedIn"));
```

### Issue 4: Can't log in as admin
**Fix:** Check the user's role in SQL Server:
```sql
SELECT email, role FROM users;
```

Update it if needed:
```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

### Issue 5: Order doesn't show up after checkout
**Fix:** Check that the cart has items (not empty) and the backend `POST /api/orders` returns the order ID correctly

---

## 🎓 Key Learning Points (For Junior Devs)

1. **JWT Authentication** - Token is stored in localStorage and sent with every protected request
2. **Polyglot Persistence** - Using both SQL (relational) and MongoDB (document) for different data
3. **State Management** - Using React hooks (useState, useEffect) for managing component state
4. **API Integration** - Using Axios to make HTTP requests with proper headers
5. **Protected Routes** - Checking user role before rendering admin pages
6. **Password Hashing** - Using bcrypt to never store plain passwords
7. **Error Handling** - Try-catch blocks and proper HTTP status codes

---

## 🔄 How Login Flow Works

```
1. User enters email/password on /login page
   ↓
2. Frontend sends POST /api/auth/login to backend
   ↓
3. Backend checks credentials, creates JWT token
   ↓
4. Frontend stores token + user in localStorage
   ↓
5. Frontend dispatches "userLoggedIn" event
   ↓
6. NavBar updates and shows admin dropdown (if admin)
   ↓
7. Frontend redirects to home page
```

---

## 🛒 How Cart → Order Works

```
1. User adds product to cart
   → POST /api/cart { product_id, quantity }
   ↓
2. Cart items stored in MongoDB
   ↓
3. User clicks "Place Order" on cart page
   → POST /api/orders (creates order in SQL Server)
   ↓
4. Order created with status "pending"
   ↓
5. Cart cleared
   ↓
6. Redirected to /order/{orderId} confirmation page
```

---

## 📦 How to Deploy

### Deploy Backend
- Use **Heroku**, **Railway**, or **AWS EC2**
- Set environment variables for database connections
- Ensure CORS is set to your frontend URL

### Deploy Frontend
- Use **Vercel**, **Netlify**, or **AWS S3 + CloudFront**
- Change API URLs from `localhost:3000` to production URL
- Set environment variable: `NEXT_PUBLIC_API_URL=https://your-backend.com`

---

## 🚀 Next Steps & Improvements

### Easy Additions
- [ ] Add payment gateway (Stripe, PayPal)
- [ ] Add email notifications for orders
- [ ] Add product wishlists
- [ ] Add product filters (price range, ratings)
- [ ] Add pagination for products

### Medium Difficulty
- [ ] Add product inventory management
- [ ] Add discount codes/coupons
- [ ] Add order tracking
- [ ] Add user reviews with ratings
- [ ] Add product variants (size, color)

### Advanced
- [ ] Add analytics dashboard
- [ ] Add image upload (AWS S3)
- [ ] Add real-time notifications (WebSocket)
- [ ] Add recommendation engine
- [ ] Add multi-language support

---

## 📞 Support

If something breaks:
1. Check the browser console (F12) for errors
2. Check the backend terminal for error logs
3. Make sure both frontend and backend are running
4. Verify database connections
5. Check that all routes are properly exported

---

## 📝 Notes for Junior Developers

### Remember:
- **Prices are in cents** — divide by 100 when displaying
- **Images are arrays** — use `product.image[0]` for first image
- **Order IDs are UUIDs** — not simple numbers
- **User IDs are UUIDs** — same format
- **Always send JWT token** with protected requests
- **useEffect empty array `[]`** means run once on mount
- **Optional chaining `user?.role`** prevents crashes if user is null

### File Naming:
- Components: **PascalCase** (`NavBar.jsx`)
- Pages: **lowercase** (`page.js`)
- Utilities: **camelCase** (`formatPrice.js`)

### Always Check:
```javascript
// Check if user exists before accessing properties
const user = JSON.parse(localStorage.getItem("user") || "{}");
if (user?.role === "admin") { ... }

// Check if array has items before mapping
if (items && items.length > 0) {
  items.map(item => ...)
}
```

---

## 📚 Useful Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/)
- [JWT Authentication](https://jwt.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [SQL Server Docs](https://docs.microsoft.com/sql/)

---

## ✅ Checklist Before Deployment

- [ ] Backend routes all working in Postman
- [ ] Frontend calls correct API URLs
- [ ] Admin dropdown shows only for admins
- [ ] Orders page shows all orders correctly
- [ ] Users page shows all users
- [ ] Status updates work on orders
- [ ] Login/logout works properly
- [ ] JWT tokens not expired too quickly
- [ ] CORS configured properly
- [ ] Error messages are helpful

---

**Happy coding! 🚀**

*This app was built by a junior developer. Keep learning, keep building!*
