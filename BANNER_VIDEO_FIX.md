# Banner Video Not Showing - Quick Fix

## Issue
The banner video is stored in MongoDB and the API returns it correctly, but it's not displaying on the homepage.

## Solution
The video element needs a key prop to force re-render when the videoUrl changes.

## Steps to Fix:

1. Open `frontend/src/pages/Home.jsx`

2. Find the `<video>` element (around line 250-260)

3. Add a `key` prop to force re-render:

```jsx
<video
  key={videoUrl}  // ADD THIS LINE
  ref={videoRef}
  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
    videoLoaded && !videoError ? "opacity-100" : "opacity-0"
  }`}
  autoPlay
  muted
  playsInline
  preload="auto"
  onLoadedData={() => {
    console.log('Video loaded successfully');
    setVideoLoaded(true);
    setVideoError(false);
  }}
  onError={(e) => {
    console.error('Video failed to load:', e);
    setVideoError(true);
    setVideoLoaded(false);
  }}
>
  <source src={videoUrl} type="video/mp4" />
  Your browser does not support the video tag.
</video>
```

## Why This Works
- The `key` prop tells React to completely unmount and remount the video element when videoUrl changes
- This forces the browser to reload the video from the new source
- Without it, React reuses the same video element and doesn't reload the source

## Test
1. Save the file
2. Refresh your homepage
3. Check browser console for "Video loaded successfully" or error messages
4. The banner video should now display

## If Still Not Working
Check browser console (F12) for:
- "Banner fetched: ..." - confirms API call succeeded
- "Using banner video: ..." - confirms videoUrl is set
- Any error messages from the video element
