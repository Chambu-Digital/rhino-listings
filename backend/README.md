Rhino Linings Backend (ESM) - Quick Start
1. Copy .env.example to .env and fill values (MONGO_URI, JWT_SECRET, MPESA_*)
2. cd backend
3. npm install
4. npm run dev
Endpoints:
- POST /api/auth/register
- POST /api/auth/login
- POST /api/tickets
- GET /api/tickets/track/:id
- POST /api/mpesa/initiate
- POST /api/mpesa/callback  (set this in MPesa sandbox)
