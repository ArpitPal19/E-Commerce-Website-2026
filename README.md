# 🛒 E-Commerce Website

A full-stack e-commerce website built using the MERN stack, featuring user authentication, product management, category and price filtering, shopping cart, checkout, Braintree sandbox payments, order management, and separate user/admin functionality.

## 🚀 Features

### 👤 User Features

- User registration and login
- Secure authentication using JWT
- Forgot password functionality
- User profile management
- Browse all products
- Browse products by category
- Filter products by price
- Search products
- View detailed product information
- Add products to cart
- Manage shopping cart
- Checkout with delivery address
- Braintree sandbox payment
- View personal orders
- Track order status
- Responsive user interface

### 👨‍💼 Admin Features

- Admin authentication and protected dashboard
- Create, update, and delete categories
- Create, update, and delete products
- Upload product images
- View all products
- View registered users
- View all customer orders
- Update order status
- Manage inventory information

## 🛠️ Tech Stack

### Frontend

- React.js
- React Router
- Axios
- Bootstrap
- Ant Design
- React Hot Toast
- Vite

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- Express Formidable

### Payment

- Braintree Sandbox

## 📂 Project Structure

```text
E-Commerce-Website/
│
├── client/                 # React frontend
│   ├── public/             # Images and public assets
│   └── src/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── pages/
│       ├── styles/
│       ├── App.jsx
│       └── main.jsx
│
├── config/                 # Database configuration
├── controllers/            # Backend controllers
├── helpers/                # Helper functions
├── middlewares/            # Authentication middleware
├── models/                 # MongoDB/Mongoose models
├── routes/                 # API routes
├── server.js               # Backend entry point
├── package.json
└── README.md



⚙️ Installation & Setup

1. Clone the repository
    git clone https://github.com/ArpitPal19/E-Commerce-Website-2026.git

2. Open the project

    cd E-Commerce-Website-2026

3. Install backend dependencies
    npm install

4. Install frontend dependencies
    cd client
    npm install

🔐 Environment Variables

Create a .env file in the backend root directory.

Example:

PORT=8080
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

BRAINTREE_MERCHANT_ID=your_braintree_merchant_id
BRAINTREE_PUBLIC_KEY=your_braintree_public_key
BRAINTREE_PRIVATE_KEY=your_braintree_private_key

Never commit your .env file or expose your private credentials publicly.

▶️ Running the Project

Start the backend

From the project root:

npm run server

Backend:

http://localhost:8080
Start the frontend

Open another terminal:

cd client
npm run dev

Frontend:

http://localhost:5173

💳 Payment Integration

This project uses Braintree Sandbox for payment testing.

The payment flow includes:

1. Checkout
2. Braintree payment form
3. Payment processing
4. Order creation
5. Cart clearing after successful payment
6. Order history

The project uses the Braintree sandbox environment, so no real payment is processed during testing.

🔒 Security

1. Passwords are hashed before storage.
2. JWT is used for authentication.
3. Protected routes are used for authenticated users.
4. Admin routes use role-based authorization.
5. Sensitive environment variables are stored in .env.
6.  .env is excluded from Git.
7. node_modules is excluded from Git.

📱 Responsive Design

The website is designed to work across:

1. Desktop
2. Laptop
3. Tablet
4. Mobile

🔮 Future Improvements

1. Product reviews and ratings
2. Wishlist functionality
3. Advanced admin analytics
4. Product stock alerts
5. Order cancellation
6. Email notifications
7. Production payment integration
8. Cloud image storage
9. Cloud deployment

👨‍💻 Author

Arpit Pal

GitHub:
https://github.com/ArpitPal19

📄 License

This project is created for learning, development, and portfolio purposes.
```
