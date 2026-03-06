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
MONGODB_URI=your_mongodb_connection_string_here

JWT_SECRET=your_jwt_secret_here

NODE_ENV=production

IMG_API_KEY=your_image_api_key_here

PORT=5002
```

**Important**: Replace the placeholder values with your actual credentials. Never commit these values to version control.

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
