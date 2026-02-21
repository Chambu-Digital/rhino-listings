import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Color mappings - from dark to light/bright
const colorMappings = {
  // Main backgrounds - dark to light
  '#1a2332': '#f5f5f5',
  '#2d3748': '#ffffff',
  '#4a5568': '#e5e7eb',
  '#718096': '#d1d5db',
  
  // Tailwind classes
  'bg-gray-800': 'bg-gray-50',
  'bg-gray-700': 'bg-white',
  'bg-gray-600': 'bg-gray-100',
  'hover:bg-gray-700': 'hover:bg-gray-100',
  'hover:bg-gray-600': 'hover:bg-gray-50',
  
  // Text colors - light to dark
  'text-white': 'text-gray-900',
  'text-gray-300': 'text-gray-700',
  'text-gray-400': 'text-gray-600',
  'text-gray-500': 'text-gray-500',
  'text-gray-600': 'text-gray-400',
};

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  for (const [oldColor, newColor] of Object.entries(colorMappings)) {
    if (content.includes(oldColor)) {
      const regex = new RegExp(oldColor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      content = content.replace(regex, newColor);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Updated: ${path.relative(process.cwd(), filePath)}`);
    return true;
  }
  return false;
}

function walkDirectory(dir, fileExtensions = ['.jsx', '.js']) {
  const files = fs.readdirSync(dir);
  let updatedCount = 0;

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        updatedCount += walkDirectory(filePath, fileExtensions);
      }
    } else if (fileExtensions.some(ext => file.endsWith(ext))) {
      if (updateFile(filePath)) {
        updatedCount++;
      }
    }
  }

  return updatedCount;
}

const srcDir = path.join(__dirname, 'src');
console.log('🌟 Converting to bright light theme...\n');
const count = walkDirectory(srcDir);
console.log(`\n✨ Done! Updated ${count} file(s).`);
