// This script will reset and fix all the Windows taskbar icon issues
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Resetting and fixing all Windows taskbar icon issues...');

// 1. First run the icon path fix to make sure our icons are in the correct places
console.log('Step 1: Running icon path fix script...');
try {
  require('./fix-icon-paths');
} catch (err) {
  console.error('Error running icon path fix:', err);
  process.exit(1);
}

// 2. Reset and rebuild the application
console.log('Step 2: Rebuilding the application...');
try {
  execSync('npm run webpack', { stdio: 'inherit' });
} catch (err) {
  console.error('Error rebuilding the application:', err);
  process.exit(1);
}

// 3. Manual fix to copy icons to electron executable directory
console.log('Step 3: Copying icons to electron executable directory...');
try {
  const electronDir = path.dirname(require('electron'));
  const destIconPath = path.join(electronDir, 'app.ico');
  const srcIconPath = path.join(__dirname, 'build', 'icons', 'win', 'icon.ico');
  
  if (fs.existsSync(srcIconPath)) {
    fs.copyFileSync(srcIconPath, destIconPath);
    console.log(`Copied ${srcIconPath} to ${destIconPath}`);
  } else {
    console.warn(`Source icon not found: ${srcIconPath}`);
  }
} catch (err) {
  console.warn('Error copying to electron directory:', err);
  // Continue anyway as this is just an additional fix
}

console.log('All fixes completed! Run the app with "npm start" to see the changes.');
