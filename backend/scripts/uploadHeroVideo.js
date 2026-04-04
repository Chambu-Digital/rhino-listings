import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import FormData from 'form-data';
import fetch from 'node-fetch';

dotenv.config({ path: '.env.local' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const videoPath = path.resolve(__dirname, '../../frontend/src/assets/images/hero-bg-video.mp4');

const API_URL = process.env.MEDIA_UPLOAD_API_URL;
const API_KEY = process.env.MEDIA_UPLOAD_API_KEY;

if (!API_URL || !API_KEY) {
  console.error('❌ Missing MEDIA_UPLOAD_API_URL or MEDIA_UPLOAD_API_KEY in .env.local');
  process.exit(1);
}

if (!fs.existsSync(videoPath)) {
  console.error('❌ Video file not found at:', videoPath);
  process.exit(1);
}

console.log('📤 Uploading hero video to fecy.co.ke...');
console.log('   File:', videoPath);
console.log('   Size:', (fs.statSync(videoPath).size / 1024 / 1024).toFixed(2), 'MB');

const form = new FormData();
form.append('api_key', API_KEY);
form.append('file', fs.createReadStream(videoPath), {
  filename: 'hero-bg-video.mp4',
  contentType: 'video/mp4',
});

try {
  const res = await fetch(API_URL, { method: 'POST', body: form });
  const text = await res.text();

  let data;
  try { data = JSON.parse(text); } catch { data = text; }

  console.log('\n📥 Response:', JSON.stringify(data, null, 2));

  // Try to extract the URL from common response shapes
  const url = data?.url || data?.file_url || data?.media_url || data?.path || data?.filename
    ? `${process.env.MEDIA_BASE_URL}/${data.filename || data.file}`
    : null;

  if (url) {
    console.log('\n✅ Upload successful!');
    console.log('🎬 Video URL:', url);
    console.log('\n👉 Add this to frontend/.env.production:');
    console.log(`   VITE_HERO_VIDEO_URL=${url}`);
  } else {
    console.log('\n⚠️  Could not auto-detect URL. Check the response above and set VITE_HERO_VIDEO_URL manually.');
  }
} catch (err) {
  console.error('❌ Upload failed:', err.message);
}
