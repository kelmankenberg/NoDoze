/**
 * Debug script to check all possible icon paths
 * Run this script to see which icon files are available
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const BUILD_DIR = path.join(ROOT_DIR, 'build');
const BUILD_ICONS_WIN_DIR = path.join(BUILD_DIR, 'icons', 'win');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

console.log('NoDoze Icon Path Check');
console.log('---------------------');
console.log('Checking all possible icon paths...\n');

// Define all possible icon paths
const iconPaths = [
  // Root directory
  { path: path.join(ROOT_DIR, 'app.ico'), desc: 'Root app.ico' },
  { path: path.join(ROOT_DIR, 'icon.ico'), desc: 'Root icon.ico' },
  
  // Public directory
  { path: path.join(PUBLIC_DIR, 'icon.png'), desc: 'Public icon.png' },
  { path: path.join(PUBLIC_DIR, 'icon.svg'), desc: 'Public icon.svg' },
  { path: path.join(PUBLIC_DIR, 'icon-active.svg'), desc: 'Public icon-active.svg' },
  { path: path.join(PUBLIC_DIR, 'icon-inactive.svg'), desc: 'Public icon-inactive.svg' },
  { path: path.join(PUBLIC_DIR, 'eye-active.svg'), desc: 'Public eye-active.svg' },
  { path: path.join(PUBLIC_DIR, 'eye-inactive.svg'), desc: 'Public eye-inactive.svg' },
  
  // Build directory
  { path: path.join(BUILD_DIR, 'icon.ico'), desc: 'Build icon.ico' },
  { path: path.join(BUILD_DIR, 'icon.png'), desc: 'Build icon.png' },
  { path: path.join(BUILD_DIR, 'icon-active.ico'), desc: 'Build icon-active.ico' },
  { path: path.join(BUILD_DIR, 'icon-inactive.ico'), desc: 'Build icon-inactive.ico' },
  { path: path.join(BUILD_DIR, 'icon-active.svg'), desc: 'Build icon-active.svg' },
  { path: path.join(BUILD_DIR, 'icon-inactive.svg'), desc: 'Build icon-inactive.svg' },
  
  // Build icons/win directory
  { path: path.join(BUILD_ICONS_WIN_DIR, 'icon.ico'), desc: 'Build icons/win icon.ico' },
  { path: path.join(BUILD_ICONS_WIN_DIR, 'icon-active.ico'), desc: 'Build icons/win icon-active.ico' },
  { path: path.join(BUILD_ICONS_WIN_DIR, 'icon-inactive.ico'), desc: 'Build icons/win icon-inactive.ico' },
  
  // Dist directory (after build)
  { path: path.join(DIST_DIR, 'icon.ico'), desc: 'Dist icon.ico' },
  { path: path.join(DIST_DIR, 'app.ico'), desc: 'Dist app.ico' }
];

// Check if files exist and get their size
const results = iconPaths.map(item => {
  const exists = fs.existsSync(item.path);
  let size = 'N/A';
  let isIcoValid = 'N/A';
  
  if (exists) {
    try {
      const stats = fs.statSync(item.path);
      size = `${(stats.size / 1024).toFixed(2)} KB`;
      
      // Simple check if ICO files are not just renamed PNGs
      if (item.path.endsWith('.ico')) {
        const buffer = fs.readFileSync(item.path);
        // ICO files start with 00 00 01 00 hex signature
        isIcoValid = buffer[0] === 0 && buffer[1] === 0 && buffer[2] === 1 && buffer[3] === 0 
          ? 'Valid ICO' 
          : 'Not a valid ICO';
      }
    } catch (err) {
      size = `Error: ${err.message}`;
    }
  }
  
  return {
    ...item,
    exists,
    size,
    isIcoValid
  };
});

// Print results
console.log('RESULTS:');
console.log('=======');
results.forEach(result => {
  const status = result.exists ? '✅' : '❌';
  let details = result.exists ? `Size: ${result.size}` : '';
  
  if (result.path.endsWith('.ico') && result.exists) {
    details += ` | ${result.isIcoValid}`;
  }
  
  console.log(`${status} ${result.desc}: ${result.path}`);
  if (details) {
    console.log(`   ${details}`);
  }
  console.log('');
});

// Add recommendations
console.log('\nRECOMMENDATIONS:');
console.log('==============');

const rootAppIcoExists = results.find(r => r.path === path.join(ROOT_DIR, 'app.ico'))?.exists;
const buildIconIcoExists = results.find(r => r.path === path.join(BUILD_DIR, 'icon.ico'))?.exists;
const winIconIcoExists = results.find(r => r.path === path.join(BUILD_ICONS_WIN_DIR, 'icon.ico'))?.exists;

if (!rootAppIcoExists) {
  console.log('❗ Create app.ico in the root directory for Windows taskbar icon');
}

if (!buildIconIcoExists) {
  console.log('❗ Create icon.ico in the build directory for Electron Builder');
}

if (!winIconIcoExists) {
  console.log('❗ Create icon.ico in build/icons/win directory for Windows targets');
}

// Check if ICO files are valid
const invalidIcos = results.filter(r => r.path.endsWith('.ico') && r.exists && r.isIcoValid === 'Not a valid ICO');
if (invalidIcos.length > 0) {
  console.log('❗ The following ICO files appear to be invalid (possibly renamed PNGs):');
  invalidIcos.forEach(ico => {
    console.log(`   - ${ico.desc}: ${ico.path}`);
  });
  console.log('   Run the improved-icon-fix.js script to properly convert PNGs to ICO format');
}

console.log('\nRun this script after running improved-icon-fix.js to verify that all icons are in place.');
