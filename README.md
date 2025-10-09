# E-Clothing Store Frontend

A modern e-commerce clothing store built with React and Vite, featuring user authentication, admin dashboard, shopping cart, and order management.

## ⚠️ ملاحظة مهمة قبل تشغيل المشروع

**قبل تشغيل المشروع:**
1. نفّذ `npm install`
2. إذا ظهرت مشاكل بالإصدارات، احذف `package-lock.json` ثم نفّذ `npm install` مرة أخرى

## Features

- **User Authentication**: Login, register, password reset
- **Shopping Cart**: Add to cart, manage quantities, apply coupons
- **Product Management**: Browse products, view details, filter by categories
- **Admin Dashboard**: Complete admin panel for managing products, categories, users, orders, and coupons
- **Order System**: Place orders, view order history
- **Responsive Design**: Mobile-friendly interface
- **Real-time Updates**: Dynamic content with API integration

## Technologies Used

- **React 18** - Frontend framework
- **Vite** - Build tool and development server
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling framework
- **shadcn/ui** - UI component library
- **React Router** - Client-side routing
- **Context API** - State management
- **Axios** - HTTP client for API calls

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Header.jsx      # Navigation header
│   ├── Footer.jsx      # Site footer
│   └── ...
├── contexts/           # React contexts
│   ├── AuthContext.jsx # Authentication state
│   ├── CartContext.jsx # Shopping cart state
│   └── ThemeContext.jsx # Theme management
├── pages/              # Page components
├── data/               # Static data and mock data
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
└── api.js              # API configuration and endpoints
```

## Admin Features

The admin dashboard includes:
- **Product Management**: CRUD operations for products and specifications
- **Category Management**: Manage product categories
- **User Management**: View and manage user accounts
- **Order Management**: Process and track orders
- **Coupon Management**: Create and manage discount coupons
- **Analytics Dashboard**: Sales overview and statistics

## API Integration

The frontend integrates with a Laravel backend API with the following main endpoints:
- Authentication: `/api/auth/*`
- Products: `/api/products/*`
- Categories: `/api/categories/*`
- Orders: `/api/orders/*`
- Users: `/api/users/*`
- Coupons: `/api/coupons/*`

