Rhino Linings FullStack - Complete

## Overview
A full-stack web application for Rhino Linings service management with role-based access control for customers, employees, and administrators.

## Folders
- **backend**: Express (ESM), JWT auth, MPesa integration, MongoDB models/controllers/routes
- **frontend**: React + Vite + Tailwind, auth pages, role-based dashboards, track progress

## Quick Start

### 1. Backend Setup
```bash
cd backend
cp .env.example .env  # Fill in your values
npm install
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. MPesa Configuration
Replace MPesa sandbox keys and set `MPESA_CALLBACK_URL` to your ngrok URL for STK callbacks.

## User Roles & Access

### 🔵 Customer (User Role)
- **Registration**: Public registration at `/register` creates customer accounts
- **Access**: Customer dashboard with service booking, quotations, and progress tracking
- **Login**: Use registered credentials at `/login`

### 🟢 Employee Role
- **Registration**: Created by admins through the Admin Dashboard
- **Access**: Employee dashboard to view assigned tasks, update status, and manage costs
- **Login**: Use credentials provided by admin at `/login`

### 🔴 Admin Role
- **First Admin Setup**: 
  - **Option 1 (Web)**: Visit `/admin-setup` to create the first admin account
  - **Option 2 (Script)**: Run `node backend/scripts/createAdmin.js` and follow prompts
- **Access**: Full admin dashboard to manage bookings, employees, and system settings
- **Capabilities**: Create employee accounts, assign tasks, manage all bookings
- **Security**: After first admin is created, the setup endpoint is automatically disabled

## Initial Setup Flow

1. **Start the application** (backend + frontend)
2. **Create first admin**:
   - Navigate to `http://localhost:5173/admin-setup`
   - Fill in admin details (name, email, password)
   - Click "Create Admin Account"
   - You'll be automatically logged in and redirected to admin dashboard
3. **Create employee accounts** (as admin):
   - Go to Admin Dashboard → Employees tab
   - Click "Add Employee"
   - Fill in employee details
   - Employee can now login with provided credentials
4. **Customers can register** at `/register` anytime

## Features

### Customer Features
- Service booking and quotation requests
- Real-time progress tracking
- Message communication
- Payment integration (MPesa)

### Employee Features
- View assigned tasks
- Update task status (Pending → In Progress → Completed)
- Update cost breakdowns (materials, labor, additional costs)
- Task statistics dashboard

### Admin Features
- Complete system overview
- Manage all bookings and quotations
- Create and manage employee accounts
- Assign tasks to employees
- Update costs and mark payments
- View system-wide statistics

## Security Notes

- Public registration only creates "user" (customer) role accounts
- Admin and employee roles cannot be created through public registration
- First admin setup endpoint (`/auth/create-first-admin`) is disabled after first admin creation
- All routes are protected with JWT authentication
- Role-based access control prevents unauthorized access

## Tech Stack

**Backend:**
- Node.js + Express (ESM)
- MongoDB + Mongoose
- JWT Authentication
- bcrypt for password hashing
- MPesa API integration

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- React Router v6
- Axios
- Lucide React Icons
- React Hot Toast

## Development

- Backend runs on `http://localhost:5000`
- Frontend runs on `http://localhost:5173`
- MongoDB connection required (local or Atlas)

## Environment Variables

See `backend/.env.example` for required environment variables including:
- MongoDB connection string
- JWT secret
- MPesa credentials
- Server port configuration
