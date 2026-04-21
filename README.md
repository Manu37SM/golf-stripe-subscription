# 🏌️ Golf Subscription Platform (Full Stack)

A full-stack web application combining **golf score tracking, subscription-based prize draws, and charity contributions**.

---

## 🚀 Features

* 🔐 User Authentication (JWT)
* 💳 Stripe Subscription (Monthly / Yearly)
* ⛳ Score Tracking (last 5 scores logic)
* 🎲 Monthly Draw System
* ❤️ Charity Contribution System
* 🏆 Winners & Proof Upload
* 🧑‍💼 Admin APIs
* 📊 Dashboard Overview

---

## 🧱 Tech Stack

### Frontend

* Next.js (App Router)
* Axios
* Tailwind CSS

### Backend

* Node.js
* Express.js
* PostgreSQL

### Payments

* Stripe (Test Mode)

---

## 📂 Project Structure

```
root/
├── backend/
├── frontend/
```

---

# ⚙️ Setup Instructions

## 1️⃣ Clone the repository

```bash
git clone <your-repo-url>
cd <repo-name>
```

---

## 2️⃣ Backend Setup

```bash
cd backend
```

### 🔧 Environment Setup

Rename the example file:

```bash
.env.example → .env
```

Update values inside `.env`:

```env
PORT=5000
DATABASE_URL=your_postgres_connection
JWT_SECRET=your_secret

STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PRICE_ID=price_xxx
STRIPE_YEARLY_PRICE_ID=price_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

FRONTEND_URL=http://localhost:3000
```

---

### 📦 Install dependencies

```bash
npm install
```

---

### ▶️ Run backend

```bash
node src/server.js
```

---

## 3️⃣ Frontend Setup

```bash
cd ../frontend
```

### 📦 Install dependencies

```bash
npm install
```

---

### ▶️ Run frontend

```bash
npm run dev
```

---

# 🧪 Testing Payments (IMPORTANT)

This project uses **Stripe Test Mode**.

Use test card:

```
4242 4242 4242 4242
Expiry: Any future date
CVC: Any 3 digits
```

---

## 🔔 Webhook (Local Development)

Run Stripe CLI:

```bash
stripe listen --forward-to localhost:5000/api/subscription/webhook
```

Copy the webhook secret into `.env`.

---

# 🔐 Test Flow

1. Signup
2. Login
3. Subscribe (Stripe test)
4. Add scores
5. View dashboard
6. Run draw (admin)
7. Upload proof
8. Admin approves

---

# 🌍 Deployment

* Frontend: Vercel
* Backend: Render
* Database: PostgreSQL (Railway / Supabase)

---

# ⚠️ Notes

* Stripe runs in **test mode**
* No real payments are processed
* Webhook required for subscription activation

---

