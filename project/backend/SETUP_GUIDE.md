# Backend Setup Guide for Goa Project

## 1. Install XAMPP and Start MySQL
- Download and install XAMPP from https://www.apachefriends.org/download.html
- Open XAMPP Control Panel and start **Apache** and **MySQL** services
- Open phpMyAdmin at http://localhost/phpmyadmin

## 2. Create Database and Tables
- In phpMyAdmin, create a new database named `goa_db`
- Select the `goa_db` database
- Open the SQL tab and paste the contents of `sql-schema.sql` file
- Run the SQL to create tables (`users`, `bookings`, `wishlist`, etc.)

## 3. Setup Backend Server
- Open terminal and navigate to `project/backend`
- Run `npm install` to install dependencies
- Create a `.env` file in `project/backend` with the following content:
  ```
  DB_HOST=localhost
  DB_USER=root
  DB_PASSWORD=your_mysql_password
  DB_NAME=goa_db
  PORT=5000
  ```
- Replace `your_mysql_password` with your MySQL root password (leave blank if none)

## 4. Run Backend Server
- In terminal, run `npm run dev` to start the backend server with nodemon
- You should see "Server is running on port 5000" and "Connected to MySQL database" messages

## 5. Connect React Frontend to Backend
- Update your React app to make API calls to `http://localhost:5000` for data operations
- Example: Use `fetch` or `axios` to call backend endpoints for user login, bookings, wishlist, etc.

## 6. Next Steps
- Implement backend API routes for authentication, bookings, wishlist, etc.
- Secure your API with authentication (e.g., JWT)
- Update frontend components to use backend API

---

If you want, I can help you implement the backend API routes and frontend integration next.
