# Oshxona - Restaurant Management System

Modern React frontend for a restaurant management system with Uzbek cuisine focus.

## Features

- 🍽️ **Menu Management** - Browse and search through delicious Uzbek dishes
- 🛒 **Shopping Cart** - Add items to cart and manage quantities
- 👤 **User Authentication** - Register, login, and profile management
- 🔐 **Admin Panel** - Manage recipes, orders, and users
- 📱 **Responsive Design** - Works perfectly on all devices
- 🎨 **Modern UI** - Beautiful interface with Tailwind CSS

## Tech Stack

- **React 19** - Latest React with modern features
- **React Router DOM** - Client-side routing
- **Redux Toolkit** - State management
- **React Query (TanStack Query)** - Server state management
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework

## Project Structure

```
src/
├── api/
│   ├── hooks/           # Custom React Query hooks
│   │   ├── useAdmin.js
│   │   ├── useRecipe.js
│   │   ├── useFoydalanuvchi.js
│   │   ├── useOrders.js
│   │   └── useCart.js
│   └── index.jsx        # Axios configuration
├── components/          # Reusable UI components
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── RecipeCard.jsx
│   ├── Modal.jsx
│   ├── Button.jsx
│   └── LoadingSpinner.jsx
├── pages/               # Page components
│   ├── Home.jsx
│   ├── Menu.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Cart.jsx
│   ├── Profile.jsx
│   ├── Admin.jsx
│   ├── About.jsx
│   ├── Contact.jsx
│   └── index.jsx        # Route configuration
├── redux/
│   ├── features/        # Redux slices
│   │   ├── authSlice.js
│   │   ├── cartSlice.js
│   │   └── menuSlice.js
│   └── store.js         # Redux store configuration
├── App.jsx              # Main app component
├── main.jsx             # App entry point
└── index.css            # Global styles
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build for Production

```bash
npm run build
```

## API Integration

The frontend is configured to work with a backend API running on `http://localhost:3001/api`. Make sure your backend server is running and provides the following endpoints:

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `POST /api/admin/login` - Admin login

### Recipes (Ovqatlar)
- `GET /api/recipes` - Get all recipes
- `GET /api/recipes/:id` - Get single recipe
- `POST /api/recipes` - Create recipe (admin only)
- `PUT /api/recipes/:id` - Update recipe (admin only)
- `DELETE /api/recipes/:id` - Delete recipe (admin only)

### Orders
- `GET /api/orders` - Get all orders (admin only)
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status (admin only)

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user

## Features Overview

### For Customers
- Browse menu with search and filtering
- Add items to shopping cart
- User registration and authentication
- Order placement and history
- Profile management

### For Admins
- Complete menu management (CRUD operations)
- Order management and status updates
- User management
- Dashboard with statistics

## Authentication

The app supports two types of users:
- **Regular Users** - Can browse menu, place orders, manage profile
- **Admin Users** - Full access to admin panel for managing the restaurant

### Default Admin Credentials
- Username: `admin`
- Password: `12345`

## State Management

The app uses Redux Toolkit for client-side state management:

- **Auth Slice** - User authentication and profile data
- **Cart Slice** - Shopping cart items and totals
- **Menu Slice** - Menu items and filters

Server state is managed with React Query for efficient data fetching and caching.

## Styling

The app uses Tailwind CSS for styling with a custom color palette focused on orange/red tones to represent Uzbek cuisine. The design is fully responsive and follows modern UI/UX principles.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.