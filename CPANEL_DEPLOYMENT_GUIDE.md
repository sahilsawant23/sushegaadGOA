# 🚀 Complete cPanel Hosting Guide for Goa Tourism Platform (Sushegaad GOA)

This step-by-step guide explains how to deploy your **Goa Tourism Platform** onto **cPanel Hosting** for free or low-cost shared hosting.

---

## 🏗️ Architecture Overview on cPanel

1. **Frontend (React + Vite SPA)**: Compiled static HTML/CSS/JS uploaded to `public_html`.
2. **Database (MySQL)**: Hosted inside cPanel MySQL Databases & managed via phpMyAdmin.
3. **Backend API (Node.js Express)**:
   - **Option A (If cPanel supports Node.js)**: Configured using cPanel's **"Setup Node.js App"** feature.
   - **Option B (Recommended for 100% Free cPanel like InfinityFree)**: Host Node.js backend on **Render.com** (Free) & point your frontend to Render API URL while connecting Render to your cPanel MySQL DB.

---

## 📋 STEP 1: Set Up MySQL Database in cPanel

1. Log into your **cPanel Dashboard**.
2. Click on **MySQL® Database Wizard** (or **MySQL® Databases**).
3. **Create Database**: e.g., `yourusername_goadb`.
4. **Create Database User**:
   - Username: `yourusername_goauser`
   - Password: Generate a strong password & save it.
5. **Add User to Database**: Check **"ALL PRIVILEGES"** and click **Make Changes**.
6. **Import Schema**:
   - Return to cPanel Main Menu and open **phpMyAdmin**.
   - Select `yourusername_goadb` on the left sidebar.
   - Click the **Import** tab.
   - Choose file: `project/backend/sql-schema.sql`.
   - Click **Go** to populate all tables (`users`, `tours`, `bookings`, `reviews`, `events`, `rentals`, `group_trips`, etc.).

---

## ⚡ STEP 2: Option A — Host Node.js Backend inside cPanel (If Supported)

> *If your cPanel provider includes "Setup Node.js App", follow this step. Otherwise, skip to Option B below.*

1. In cPanel, click **Setup Node.js App**.
2. Click **Create Application**.
3. Fill details:
   - **Node.js version**: Select `18.x` or `20.x`.
   - **Application Mode**: `Production`.
   - **Application Root**: `backend` (or upload files to `public_html/backend`).
   - **Application URL**: `api` (or your subdomain like `api.yourdomain.com`).
   - **Application startup file**: `index.js`.
4. Click **Create**.
5. Upload all backend files (`project/backend/*`) to the application root directory using cPanel **File Manager** or FTP.
6. Open **Environment Variables** in the Node.js App interface and add:
   ```env
   DB_HOST=localhost
   DB_USER=yourusername_goauser
   DB_PASSWORD=your_db_password
   DB_NAME=yourusername_goadb
   PORT=5000
   JWT_SECRET=your_secret_key
   CORS_ORIGIN=https://yourdomain.com
   ```
7. Click **Run NPM Install** or run npm install via SSH/Terminal inside cPanel.
8. Click **Restart Application**.

---

## ☁️ STEP 2: Option B — Host Node.js Backend on Render.com (Recommended Free Option)

> *Free cPanel hosts (InfinityFree, Freehostia) do not run persistent Node.js servers. Host your Node.js backend free on Render.com!*

1. Create a free account on [Render.com](https://render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository containing `project/backend`.
4. Build & Start Settings:
   - **Root Directory**: `project/backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
5. Environment Variables on Render:
   Add `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT` (from cPanel remote MySQL or cloud DB), `JWT_SECRET`, `CORS_ORIGIN`.
6. Deploy! Render will give you an API URL like `https://goa-backend.onrender.com`.

---

## 🎨 STEP 3: Build & Deploy React Frontend to cPanel `public_html`

1. Open a terminal on your computer in the `project/` directory.
2. Edit `project/.env` (or set environment variable):
   ```env
   VITE_API_BASE_URL=https://api.yourdomain.com/api
   ```
   *(Replace with your actual cPanel Node.js URL or Render URL e.g. `https://goa-backend.onrender.com/api`)*
3. Run the production build command:
   ```bash
   npm run build
   ```
4. This creates a `dist/` folder containing compiled static assets.
5. In cPanel, open **File Manager** and navigate to `public_html/`.
6. Upload **all contents inside `project/dist/`** into `public_html/`:
   - `index.html`
   - `assets/` folder
   - `.htaccess` file (Must be uploaded! Ensures React Router page refreshes like `/tours` work without 404).

---

## 🔒 STEP 4: Enable Free SSL Certificate in cPanel

1. In cPanel, search for **AutoSSL** or **Let's Encrypt SSL**.
2. Click **Run AutoSSL** or **Issue SSL Certificate** for your domain.
3. Your site is now secure via `https://yourdomain.com`!

---

## ✅ Deployment Verification Checklist

- [ ] Database imported cleanly via phpMyAdmin.
- [ ] `.htaccess` file is present in `public_html`.
- [ ] Direct navigation to `https://yourdomain.com/tours` reloads correctly.
- [ ] User Login/Register works and communicates with backend API.
- [ ] Admin Dashboard at `/admin` loads live database content.
