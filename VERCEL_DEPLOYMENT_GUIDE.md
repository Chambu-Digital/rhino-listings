# Vercel Deployment Guide

## Environment Variables Setup

You need to add the following environment variables to your Vercel project:

### For Backend Deployment

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project (rhino-listings)
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

#### Required Variables:

```
MONGODB_URI=mongodb+srv://jayjeremy2000_db_user:k3qIRrkg12wuQMdZ@rhinolinings.f72huux.mongodb.net/rhinolinings?retryWrites=true&w=majority

JWT_SECRET=iutyrue5ysd7uig7te555765456e6rfvry6566r56dtvgdrcrsrertr6vuhut75665456ytfcff

NODE_ENV=production

IMG_API_KEY=khyp9o8wiu5asjdfoikljhgfdhxhcjkhjfhdjkljhcgvbk

PORT=5002
```

### For Frontend Deployment

Add this variable for the frontend:

```
VITE_API_URL=https://your-backend-url.vercel.app
```

Replace `your-backend-url` with your actual Vercel backend URL.

## Important Notes

1. **Environment Scope**: Make sure to select the appropriate environment:
   - Production (for main branch)
   - Preview (for pull requests)
   - Development (for local development)

2. **Redeploy**: After adding environment variables, you need to redeploy:
   - Go to **Deployments** tab
   - Click the three dots on the latest deployment
   - Select **Redeploy**

3. **Separate Deployments**: Your current setup deploys both frontend and backend together. Consider:
   - Deploy backend separately for better scalability
   - Use Vercel's serverless functions for API routes
   - Or keep them together as currently configured

## Testing After Deployment

1. Check backend is running: `https://your-backend-url.vercel.app/api/health`
2. Test image upload in admin dashboard
3. Verify images are uploaded to external API (URLs should be `https://fecy.co.ke/media/...`)

## Local Development

For local development, keep using your `.env` files:
- `backend/.env` - Backend environment variables
- `frontend/.env` - Frontend environment variables

These files are gitignored and won't be deployed to Vercel.

## Troubleshooting

### Images still uploading locally
- Verify `IMG_API_KEY` is set in Vercel environment variables
- Redeploy after adding the variable
- Check deployment logs for errors

### Backend not connecting to MongoDB
- Verify `MONGODB_URI` is correct in Vercel
- Check if your IP is whitelisted in MongoDB Atlas (use 0.0.0.0/0 for Vercel)

### Frontend can't reach backend
- Verify `VITE_API_URL` points to correct backend URL
- Check CORS settings in backend
- Ensure API routes are properly configured in vercel.json
