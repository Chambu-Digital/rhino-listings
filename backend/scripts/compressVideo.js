import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inputPath  = path.resolve(__dirname, '../../frontend/src/assets/images/hero-bg-video.mp4');
const outputPath = path.resolve(__dirname, '../../frontend/src/assets/images/hero-bg-video-compressed.mp4');

// Remove old output if exists
if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);

const inputSizeMB = fs.statSync(inputPath).size / 1024 / 1024;
console.log(`📹 Input size:  ${inputSizeMB.toFixed(2)} MB`);
console.log(`🎯 Target:      < 11 MB`);
console.log(`⚙️  Compressing (this takes ~30s)...\n`);

// Target 10MB output → bitrate = (10 * 8192) / duration_seconds kbps
// We don't know duration yet so use a safe fixed bitrate of 600kbps total
// For a ~30s clip that gives ~2.25MB; for 60s → ~4.5MB; for 120s → ~9MB
// Use 700kbps video + 64kbps audio = 764kbps total → safe for up to ~105s video

ffmpeg(inputPath)
  .videoCodec('libx264')
  .audioCodec('aac')
  .outputOptions([
    '-b:v 650k',          // Target video bitrate
    '-maxrate 800k',      // Max bitrate cap
    '-bufsize 1600k',
    '-b:a 64k',           // Low audio bitrate
    '-vf scale=1280:-2',  // 720p width, keep aspect ratio
    '-preset fast',
    '-movflags +faststart', // Metadata at front for web streaming
    '-pix_fmt yuv420p',   // Max browser compatibility
  ])
  .output(outputPath)
  .on('progress', (p) => {
    if (p.percent != null) {
      process.stdout.write(`\r   Progress: ${Math.round(p.percent)}%   `);
    }
  })
  .on('end', () => {
    const outSizeMB = fs.statSync(outputPath).size / 1024 / 1024;
    const base64SizeMB = outSizeMB * 1.37; // base64 overhead
    console.log(`\n\n✅ Compression complete!`);
    console.log(`📦 Output size:       ${outSizeMB.toFixed(2)} MB`);
    console.log(`📦 Base64 size est.:  ${base64SizeMB.toFixed(2)} MB`);
    console.log(`📁 File: ${outputPath}`);

    if (base64SizeMB > 15.5) {
      console.log(`\n⚠️  Base64 size may exceed MongoDB's 16MB limit.`);
      console.log(`   Consider using a hosted URL instead (paste in Banner Management → Video URL field).`);
    } else {
      console.log(`\n🎉 Safe to upload via Admin Dashboard → Banner Management → Upload Video File`);
    }
  })
  .on('error', (err) => {
    console.error('\n❌ Compression failed:', err.message);
  })
  .run();
