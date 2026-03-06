# Image API Integration Setup

## What Changed

The service image upload in the admin dashboard now uses the external image API at `https://fecy.co.ke/imgapi/` instead of storing images locally.

## Setup Steps

### 1. Get Your API Key

1. Go to `https://fecy.co.ke/imgapi/admin/key_manager.php`
2. Generate a new API key
3. Copy the API key

### 2. Configure Backend

Update your `backend/.env` file with your API key:

```env
IMG_API_KEY=your_actual_api_key_here
```

### 3. Restart Backend Server

After adding the API key, restart your backend server for the changes to take effect.

## Features

### Image Upload
- Maximum file size: 20MB (increased from 5MB)
- Supported formats: JPEG, PNG, GIF, WebP
- Images are stored on external server with automatic organization (YYYY/MM folder structure)
- Returns full URL to the uploaded image

### Optional Watermarking
You can add watermarks to service images by passing these parameters:
- `watermark_text`: Text to display (e.g., "© Rhino Linings 2024")
- `watermark_position`: Position (top-left, top-right, center, bottom-left, bottom-right)
- `watermark_opacity`: Opacity value (0.1 to 1.0)

### How It Works

1. Admin uploads image in the Services section
2. Image is sent to external API via backend
3. API processes and stores the image
4. Returns permanent URL
5. URL is saved in your database with the service

### Benefits

- No local storage management needed
- Automatic file organization
- Higher file size limit (20MB)
- Optional watermarking
- CDN-ready URLs
- Permanent storage

## Testing

1. Login to admin dashboard: `http://localhost:5173/admin/dashboard`
2. Navigate to "Services" section
3. Click "Add Service" or edit existing service
4. Upload an image
5. The image URL will be from `https://fecy.co.ke/media/...`

## Notes

- Images uploaded to the external API are permanent
- The delete function only removes the reference from your database
- Images remain on the external server even after deletion
- Make sure to keep your API key secure and never commit it to version control
