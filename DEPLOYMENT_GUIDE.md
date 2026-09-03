# 🌐 Full-Stack Deployment Guide for Sushegaad GOA Tourism Platform

This guide outlines deployment steps for hosting the **Goa Tourism Platform** using modern Cloud Platforms (Vercel, Netlify, Render, Railway, Aiven).

---

## ⚡ Hosting Architecture

| Tier | Recommended Platform | Alternative |
| :--- | :--- | :--- |
| **Frontend** | **Vercel** / **Netlify** | cPanel `public_html` |
| **Backend** | **Render.com** / **Railway** | cPanel Node.js App |
| **Database** | **Aiven MySQL** / **DigitalOcean** | cPanel MySQL |

---

## 📦 1. Frontend Deployment (Vercel / Netlify)

### Vercel (Recommended)
1. Push your repository to GitHub.
2. Go to [Vercel.com](https://vercel.com) and import the project repo.
3. Set **Root Directory** to `project`.
4. Add Environment Variable:
   - `VITE_API_BASE_URL` = `https://your-backend-service.onrender.com/api`
   - `VITE_RAZORPAY_KEY_ID` = `rzp_test_TDstsI3dZOt2yf`
5. Click **Deploy**. Vercel will automatically build and deploy your app. Routing is handled via the included `vercel.json`.

---

## 🛠️ 2. Backend API Deployment (Render.com)

1. Sign up on [Render.com](https://render.com).
2. Click **New Web Service** and select your GitHub repo.
3. Settings:
   - **Root Directory**: `project/backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
4. Set Environment Variables on Render:
   - `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`, `DB_SSL`
   - `JWT_SECRET`, `CORS_ORIGIN`, `EMAIL_USER`, `EMAIL_PASS`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
5. Click **Create Web Service**.

---

## 🗄️ 3. Database Setup (Cloud MySQL)

1. Create a free MySQL database on **Aiven.io** or **Railway**.
2. Download or connect using a MySQL Client (DBeaver, phpMyAdmin, or MySQL CLI).
3. Execute `project/backend/sql-schema.sql` to initialize schema.
4. Copy host, port, username, and password to backend environment variables.
