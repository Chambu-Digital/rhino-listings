# 🎥 Video Hosting Guide for Production

Your video works locally but not in production because hosting services have file size limits. Here's how to fix it:

## 📋 Quick Solution Steps

### Option 1: Cloudinary (Recommended - FREE)

1. **Sign up for Cloudinary**
   - Go to: https://cloudinary.com/users/register/free
   - Free tier: 25GB storage, 25GB bandwidth/month

2. **Upload your video**
   - Login to Cloudinary dashboard
   - Click "Media Library"
   - Click "Upload" button
   - Select `hero-bg-video.mp4`
   - Wait for upload to complete

3. **Get the video URL**
   - Click on the uploaded video
   - Copy the "Secure URL" (starts with `https://res.cloudinary.com/...`)
   - Example: `https://res.cloudinary.com/your-cloud/video/upload/v1234567890/hero-bg-video.mp4`

4. **Update your environment variable**
   - Open `frontend/.env.production`
   - Replace the `VITE_HERO_VIDEO_URL` with your Cloudinary URL:
   ```
   VITE_HERO_VIDEO_URL=https://res.cloudinary.com/your-cloud/video/upload/v1234567890/hero-bg-video.mp4
   ```

5. **Deploy to production**
   - Commit and push your changes
   - Your hosting service will use the Cloudinary URL

---

### Option 2: Bunny.net (Affordable CDN)

1. **Sign up**: https://bunny.net/
2. **Create a Storage Zone**
3. **Upload video** via FTP or web interface
4. **Get CDN URL**: `https://your-zone.b-cdn.net/hero-bg-video.mp4`
5. **Update** `VITE_HERO_VIDEO_URL` in `.env.production`

---

### Option 3: Google Drive (Quick & Free)

1. **Upload video to Google Drive**
2. **Right-click** → Get link → Anyone with the link can view
3. **Get direct link**:
   - Original link: `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`
   - Direct link: `https://drive.google.com/uc?export=download&id=FILE_ID`
4. **Update** `VITE_HERO_VIDEO_URL`

---

### Option 4: GitHub Large File Storage (LFS)

If you want to keep the video in your repo:

1. **Install Git LFS**
   ```bash
   git lfs install
   ```

2. **Track video files**
   ```bash
   git lfs track "*.mp4"
   ```

3. **Add and commit**
   ```bash
   git add .gitattributes
   git add frontend/public/videos/hero-bg-video.mp4
   git commit -m "Add video with LFS"
   git push
   ```

**Note**: Most hosting services don't support Git LFS, so Options 1-3 are better.

---

## 🔧 How It Works

### Development (Local)
- Uses local video: `/videos/hero-bg-video.mp4`
- Fast loading, no bandwidth costs

### Production (Hosted)
- Uses CDN video: `https://your-cdn.com/hero-bg-video.mp4`
- Fast global delivery
- No file size limits

### Code Implementation
```javascript
// Automatically uses the right video source
const videoUrl = import.meta.env.VITE_HERO_VIDEO_URL || "/videos/hero-bg-video.mp4";
```

---

## 📝 Deployment Checklist

- [ ] Upload video to Cloudinary/Bunny/CDN
- [ ] Copy the video URL
- [ ] Update `frontend/.env.production` with the URL
- [ ] Commit and push changes
- [ ] Verify video loads on production site
- [ ] Check browser console for any errors

---

## 🎯 Recommended: Cloudinary

**Why Cloudinary?**
- ✅ Free tier is generous (25GB)
- ✅ Automatic video optimization
- ✅ Global CDN delivery
- ✅ Easy to use dashboard
- ✅ Supports video transformations
- ✅ No credit card required for free tier

**Video will load faster** because Cloudinary optimizes it automatically!

---

## 🆘 Troubleshooting

### Video doesn't load in production
1. Check browser console (F12) for errors
2. Verify the URL in `.env.production` is correct
3. Test the video URL directly in browser
4. Make sure the video is publicly accessible

### Video loads slowly
1. Use a CDN (Cloudinary/Bunny)
2. Compress the video (reduce file size)
3. Use a lower resolution for web (1080p is enough)

### CORS errors
1. Make sure the CDN allows cross-origin requests
2. Cloudinary and Bunny handle this automatically

---

## 💡 Pro Tips

1. **Compress your video** before uploading:
   - Use HandBrake or FFmpeg
   - Target: 1080p, H.264 codec, ~5-10MB for 30 seconds

2. **Use video poster image**:
   - Add a thumbnail that shows while video loads
   - Improves perceived performance

3. **Consider video alternatives**:
   - Animated background with CSS
   - High-quality image with parallax effect
   - Lottie animations (much smaller file size)

---

## 📞 Need Help?

If you're stuck, share:
1. Your hosting service (Vercel, Netlify, etc.)
2. Browser console errors (F12)
3. The video URL you're using

Good luck! 🚀
