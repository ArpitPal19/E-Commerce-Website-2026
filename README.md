\# 🛒 E-Commerce Website



A full-stack e-commerce website built using the MERN stack, featuring user authentication, product management, category and price filtering, shopping cart, checkout, Braintree sandbox payments, order management, and separate user/admin functionality.



\## 🚀 Features



\### 👤 User Features



\- User registration and login

\- Secure authentication using JWT

\- Forgot password functionality

\- User profile management

\- Browse all products

\- Browse products by category

\- Filter products by price

\- Search products

\- View detailed product information

\- Add products to cart

\- Manage shopping cart

\- Checkout with delivery address

\- Braintree sandbox payment

\- View personal orders

\- Track order status

\- Responsive user interface



\### 👨‍💼 Admin Features



\- Admin authentication and protected dashboard

\- Create, update, and delete categories

\- Create, update, and delete products

\- Upload product images

\- View all products

\- View registered users

\- View all customer orders

\- Update order status

\- Manage inventory information



\## 🛠️ Tech Stack



\### Frontend



\- React.js

\- React Router

\- Axios

\- Bootstrap

\- Ant Design

\- React Hot Toast

\- Vite



\### Backend



\- Node.js

\- Express.js

\- MongoDB

\- Mongoose

\- JWT Authentication

\- bcrypt

\- Express Formidable



\### Payment



\- Braintree Sandbox



\## 📂 Project Structure



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

