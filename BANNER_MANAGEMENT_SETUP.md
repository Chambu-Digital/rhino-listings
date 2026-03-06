# Banner Management System Setup

## What I've Created:

### Backend (✅ Complete):
1. **Model**: `backend/models/Banner.js` - Stores banner data in MongoDB
2. **Controller**: `backend/controllers/bannerController.js` - Handles banner CRUD operations
3. **Routes**: `backend/routes/bannerRoutes.js` - API endpoints for banner management
4. **Server**: Updated `backend/server.js` to include banner routes

### Frontend (✅ Partial):
1. **Home.jsx**: Updated to fetch banner video from API dynamically

## API Endpoints Created:

- `GET /api/banner/active` - Get the active banner (public)
- `GET /api/banner` - Get all banners (admin only)
- `POST /api/banner` - Create/update banner (admin only)
- `DELETE /api/banner/:id` - Delete banner (admin only)

## How to Add Banner Management to Admin Dashboard:

### Step 1: Add Banner State
Add this to the AdminDashboard state variables (around line 40):

```javascript
const [banner, setBanner] = useState(null);
const [showBannerModal, setShowBannerModal] = useState(false);
const [bannerForm, setBannerForm] = useState({
  title: 'Hero Banner',
  videoUrl: '',
  videoType: 'url',
  fallbackImage: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1920&q=80'
});
```

### Step 2: Add Fetch Banner Function
Add this function with other fetch functions:

```javascript
const fetchBanner = async () => {
  try {
    const response = await API.get("/banner/active");
    setBanner(response.data);
    setBannerForm({
      title: response.data.title || 'Hero Banner',
      videoUrl: response.data.videoUrl || '',
      videoType: response.data.videoType || 'url',
      fallbackImage: response.data.fallbackImage || ''
    });
  } catch (error) {
    console.error("Error fetching banner:", error);
  }
};
```

### Step 3: Call fetchBanner in useEffect
Add to the main useEffect:

```javascript
useEffect(() => {
  fetchData();
  fetchBanner(); // Add this line
}, []);
```

### Step 4: Add Banner Management Navigation Item
Add to the navigation items array (around line 570):

```javascript
{
  id: "banner",
  label: "Banner",
  icon: <Package className="w-5 h-5" />
},
```

### Step 5: Add Banner Management View
Add this section after the services view (around line 1800):

```javascript
{activeView === "banner" && (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Banner Management</h1>
      <p className="text-gray-600 mt-1">Manage hero section video banner</p>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Current Banner</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Video URL (Hosted)
          </label>
          <input
            type="url"
            value={bannerForm.videoUrl}
            onChange={(e) => setBannerForm({...bannerForm, videoUrl: e.target.value})}
            placeholder="https://your-cdn.com/video.mp4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <p className="text-xs text-gray-500 mt-1">
            Upload your video to Cloudinary, Bunny.net, or any CDN and paste the URL here
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fallback Image URL
          </label>
          <input
            type="url"
            value={bannerForm.fallbackImage}
            onChange={(e) => setBannerForm({...bannerForm, fallbackImage: e.target.value})}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {bannerForm.videoUrl && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
            <video
              src={bannerForm.videoUrl}
              className="w-full max-w-md h-48 object-cover rounded-lg"
              controls
              muted
            />
          </div>
        )}

        <Button
          onClick={async () => {
            try {
              await API.post("/banner", bannerForm);
              toast.success("Banner updated successfully!");
              fetchBanner();
            } catch (error) {
              toast.error("Error updating banner");
              console.error(error);
            }
          }}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
        >
          Update Banner
        </Button>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Instructions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-gray-600">
        <p>1. Upload your video to a hosting service (Cloudinary, Bunny.net, AWS S3, etc.)</p>
        <p>2. Copy the direct video URL</p>
        <p>3. Paste it in the "Video URL" field above</p>
        <p>4. Click "Update Banner" to save</p>
        <p className="text-orange-600 font-medium mt-4">
          ⚠️ For best performance, keep videos under 50MB and use MP4 format
        </p>
      </CardContent>
    </Card>
  </div>
)}
```

## How to Use:

1. **Restart your backend server** to load the new routes
2. **Add the code above** to your AdminDashboard.jsx
3. **Go to Admin Dashboard** → Click "Banner" in sidebar
4. **Upload your video** to Cloudinary or another CDN
5. **Paste the video URL** in the form
6. **Click "Update Banner"**
7. **The video will now show** on your homepage dynamically!

## Why Video Wasn't Showing on Deployed Site:

- Video files are too large for Git (usually 10-100MB+)
- Git has file size limits
- Deployment platforms have storage limits
- Solution: Host videos externally on CDN and reference the URL

## Recommended Video Hosting Services:

1. **Cloudinary** (Free tier: 25GB storage, 25GB bandwidth/month)
   - https://cloudinary.com/users/register_free
   
2. **Bunny.net** ($1/month for video streaming)
   - https://bunny.net/stream/

3. **AWS S3** (Pay as you go)
   - https://aws.amazon.com/s3/

4. **GitHub Releases** (Free, but not ideal for videos)
   - Upload as release asset in your repository
