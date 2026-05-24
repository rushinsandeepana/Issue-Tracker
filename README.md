# Issue Tracker

## 🚀 Overview
A full-stack Issue Tracker application built with React, TypeScript, Node.js, Express, and MySQL.

---

## 📦 Dependencies

### Backend
- Node.js
- Express.js
- MySQL
- dotenv
- cors
- jsonwebtoken
- bcryptjs

### Frontend
- React
- TypeScript
- Vite
- Redux Toolkit
- Tailwind CSS
- Axios

---

## ⚙️ Setup Instructions

## 1. Database Setup

Create the database using MySQL:

```bash
mysql -u root -p < database.sql
```

Or import `database.sql` using phpMyAdmin or MySQL Workbench.

---

## 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file using `.env.example`:

```bash
cp .env.example .env
```

Run backend:

```bash
npm run dev
```

---

## 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file using `.env.example`:

```bash
cp .env.example .env
```

Run frontend:

```bash
npm run dev
```

---

## ▶️ Usage

1. Start backend server
2. Start frontend server
3. Open browser at:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000
4. Register a new user and start managing issues

---

## 📌 Notes
- Ensure MySQL is running before starting backend
- Both frontend and backend must run simultaneously

