# MediMeet — Full-Stack Doctor Appointment Booking Platform

MediMeet is a full-stack web application for booking doctor appointments online. It supports three distinct roles — **Patient**, **Doctor**, and **Admin** — each with their own interface and capabilities. Patients can browse doctors, book time slots, and pay online; doctors manage their schedule and earnings; admins oversee the entire platform.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Deployment](#deployment)

---

## Architecture Overview

```
medimeet-full-stack/
├── backend/      → Node.js/Express REST API  (port 4000)
├── frontend/     → Patient-facing React app  (port 5173)
└── admin/        → Admin & Doctor dashboard  (port 5174)
```

All three services are independent. The backend is a stateless REST API; both frontends communicate with it over HTTP using JWT tokens stored in browser `localStorage`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend runtime | Node.js (ES Modules) |
| Backend framework | Express.js 4.19 |
| Database | MongoDB 7.2 + Mongoose 8.16 |
| Authentication | JWT (jsonwebtoken 9.0) |
| Password hashing | bcrypt 5.1 |
| File upload | Multer → Cloudinary v2 |
| Payments | Razorpay 2.9 & Stripe 16.5 |
| Rate limiting | express-rate-limit 8.5 |
| Frontend framework | React 18.3 + Vite 5.3 |
| Styling | Tailwind CSS 3.4 |
| Routing (client) | react-router-dom 6 |
| HTTP client | axios 1.7 |
| Form validation | yup 1.6 |
| UI feedback | react-toastify 10 |

---

## Features

### Patient
- Register and log in with email/password
- Browse doctors filtered by medical speciality
- View doctor profile (experience, fees, about, availability)
- Book an appointment slot (30-minute slots, 10 AM – 9 PM)
- Cancel upcoming appointments
- Pay for appointments via **Razorpay** or **Stripe**
- Update personal profile (name, phone, address, DOB, gender, photo)

### Doctor
- Log in to a dedicated dashboard
- View all scheduled, completed, and cancelled appointments
- Mark appointments as completed
- Cancel appointments
- Toggle availability on/off
- Update profile (fees, address, availability)
- View earnings and patient statistics

### Admin
- Log in to a shared dashboard (role selected at login)
- Add new doctors with image upload
- View and manage all doctors (toggle availability)
- View all appointments platform-wide
- Cancel any appointment
- Dashboard analytics: total doctors, appointments, and patients

---

## Project Structure

```
backend/
├── server.js               # Entry point, Express app setup
├── seed.js                 # Database seeding script
├── config/
│   ├── mongodb.js          # MongoDB connection
│   └── cloudinary.js       # Cloudinary configuration
├── models/
│   ├── userModel.js        # Patient schema
│   ├── doctorModel.js      # Doctor schema
│   └── appointmentModel.js # Appointment schema
├── controllers/
│   ├── userController.js   # Patient routes logic
│   ├── doctorController.js # Doctor routes logic
│   └── adminController.js  # Admin routes logic
├── routes/
│   ├── userRouter.js
│   ├── doctorRouter.js
│   └── adminRouter.js
└── middleware/
    ├── authUser.js         # JWT auth for patients
    ├── authDoctor.js       # JWT auth for doctors
    └── authAdmin.js        # JWT auth for admins

frontend/
├── src/
│   ├── pages/              # Home, Doctors, Appointment, MyAppointments, MyProfile, Login, Verify, About, Contact
│   ├── components/         # Navbar, Footer, Header, SpecialityMenu, TopDoctors, RelatedDoctors
│   └── context/AppContext.jsx  # Global state (token, user data, doctors list)
└── vercel.json             # SPA rewrite rules

admin/
├── src/
│   ├── pages/
│   │   ├── Admin/          # Dashboard, AddDoctor, DoctorsList, AllAppointments
│   │   └── Doctor/         # DoctorDashboard, DoctorAppointments, DoctorProfile
│   ├── components/         # Sidebar, Navbar
│   └── context/            # AdminContext, DoctorContext, AppContext
└── vercel.json             # SPA rewrite rules
```

---

## Database Schema

### User (patients)
```js
{
  name:     String,   // required
  email:    String,   // required, unique
  password: String,   // bcrypt hashed
  image:    String,   // Cloudinary URL (default: base64 avatar)
  phone:    String,   // default: "000000000"
  address:  { line1: String, line2: String },
  gender:   String,   // default: "Not Selected"
  dob:      String    // date of birth, default: "Not Selected"
}
```

### Doctor
```js
{
  name:         String,   // required
  email:        String,   // required, unique
  password:     String,   // bcrypt hashed
  image:        String,   // Cloudinary URL
  speciality:   String,   // e.g. "General physician", "Dermatologist"
  degree:       String,   // e.g. "MBBS"
  experience:   String,   // e.g. "4 Years"
  about:        String,
  available:    Boolean,  // default: true
  fees:         Number,
  slots_booked: Object,   // { "YYYY-MM-DD": ["10:00 AM", "10:30 AM", ...] }
  address:      { line1: String, line2: String },
  date:         Number    // creation timestamp
}
```

### Appointment
```js
{
  userId:      String,   // ref to User
  docId:       String,   // ref to Doctor
  slotDate:    String,   // "YYYY-MM-DD"
  slotTime:    String,   // "10:00 AM"
  userData:    Object,   // snapshot of user at booking time
  docData:     Object,   // snapshot of doctor at booking time
  amount:      Number,   // doctor's fee
  date:        Number,   // booking timestamp
  cancelled:   Boolean,  // default: false
  payment:     Boolean,  // default: false
  isCompleted: Boolean   // default: false
}
```

---

## API Reference

All endpoints are prefixed with `/api`. Authentication tokens are passed as request headers.

| Header | Used by |
|---|---|
| `token` | Patients |
| `dtoken` | Doctors |
| `atoken` | Admins |

### User Routes — `/api/user`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/register` | — | Register a new patient |
| POST | `/login` | — | Login (rate limited) |
| GET | `/get-profile` | token | Get own profile |
| POST | `/update-profile` | token | Update profile (multipart, optional image) |
| POST | `/book-appointment` | token | Book an appointment slot |
| GET | `/appointments` | token | List own appointments |
| POST | `/cancel-appointment` | token | Cancel an appointment |
| POST | `/payment-razorpay` | token | Create Razorpay order |
| POST | `/verifyRazorpay` | token | Verify Razorpay payment |
| POST | `/payment-stripe` | token | Create Stripe checkout session |
| POST | `/verifyStripe` | token | Verify Stripe payment |

### Doctor Routes — `/api/doctor`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/login` | — | Doctor login (rate limited) |
| GET | `/list` | — | Get all doctors (public) |
| GET | `/appointments` | dtoken | Get own appointments |
| POST | `/cancel-appointment` | dtoken | Cancel appointment |
| POST | `/complete-appointment` | dtoken | Mark appointment complete |
| POST | `/change-availability` | dtoken | Toggle availability |
| GET | `/dashboard` | dtoken | Get dashboard stats |
| GET | `/profile` | dtoken | Get own profile |
| POST | `/update-profile` | dtoken | Update own profile |

### Admin Routes — `/api/admin`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/login` | — | Admin login (rate limited) |
| POST | `/add-doctor` | atoken | Add new doctor (multipart + image) |
| GET | `/all-doctors` | atoken | List all doctors |
| POST | `/change-availability` | atoken | Toggle doctor availability |
| GET | `/appointments` | atoken | List all appointments |
| POST | `/cancel-appointment` | atoken | Cancel any appointment |
| GET | `/dashboard` | atoken | Platform-wide stats |

---

## Environment Variables

### `backend/.env`

```env
# Server
PORT=4000

# URLs (used for CORS and Stripe success/cancel redirects)
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174

# Auth
JWT_SECRET=your_jwt_secret_here

# Admin credentials (stored in env, not DB)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=strongpassword

# MongoDB
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/medimeet

# Cloudinary
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET_KEY=your_api_secret

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxx

# Currency
CURRENCY=INR
```

### `frontend/.env`

```env
VITE_BACKEND_URL=http://localhost:4000
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
```

### `admin/.env`

```env
VITE_BACKEND_URL=http://localhost:4000
VITE_CURRENCY=₹
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- A MongoDB database (Atlas or local)
- A Cloudinary account
- A Razorpay and/or Stripe account (for payments)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/medimeet-full-stack.git
cd medimeet-full-stack
```

### 2. Set up the backend

```bash
cd backend
npm install
cp .env.example .env   # fill in all values
npm run server         # starts with nodemon on port 4000
```

### 3. Seed the database (optional)

Populates MongoDB with sample doctors (password for all: `Doctor@1234`):

```bash
cd backend
node seed.js
```

### 4. Start the frontend (patient app)

```bash
cd frontend
npm install
cp .env.example .env   # set VITE_BACKEND_URL and VITE_RAZORPAY_KEY_ID
npm run dev            # starts on http://localhost:5173
```

### 5. Start the admin dashboard

```bash
cd admin
npm install
cp .env.example .env   # set VITE_BACKEND_URL and VITE_CURRENCY
npm run dev            # starts on http://localhost:5174
```

### Default Admin Login

The admin account is not stored in the database — it is configured via environment variables:

```
Email:    ADMIN_EMAIL  (from backend .env)
Password: ADMIN_PASSWORD (from backend .env)
```

---

## Appointment Booking Flow

1. Patient selects a doctor and chooses an available date and 30-minute time slot.
2. Slot is reserved in the doctor's `slots_booked` map.
3. Appointment record is created with `payment: false`.
4. Patient pays via Razorpay (order-based) or Stripe (session-based).
5. After successful payment verification, `payment` is set to `true`.
6. Doctor can later mark the appointment as `isCompleted: true`.
7. Cancellation by any party removes the slot from `slots_booked`, freeing it for other patients.

Available slots span **10:00 AM – 9:00 PM** in 30-minute increments. For the current day, only slots at least 1 hour from now are shown.

---

## Deployment

Both `frontend/` and `admin/` include a `vercel.json` that rewrites all routes to `index.html` for client-side routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

**Recommended deployment:**
- **Backend:** Railway, Render, or any Node.js host — set all environment variables in the platform dashboard.
- **Frontend / Admin:** Vercel — connect each subdirectory as a separate Vercel project and set the `VITE_*` environment variables.

Make sure `FRONTEND_URL` and `ADMIN_URL` in the backend `.env` match your deployed domains so CORS and Stripe redirects work correctly.
