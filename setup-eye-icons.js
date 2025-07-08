/**
 * Copy eye icons to critical locations for app icon visibility
 */

const fs = require('fs');
const path = require('path');

console.log('Setting up NoDoze with eye icons');
console.log('-------------------------------');

const ROOT_DIR = __dirname;
const BUILD_ICONS_WIN_DIR = path.join(ROOT_DIR, 'build', 'icons', 'win');

// Eye icon files (known to be valid ICO files)
const eyeActiveIcoPath = path.join(BUILD_ICONS_WIN_DIR, 'eye-active.ico');

// Check if eye-active.ico exists
if (!fs.existsSync(eyeActiveIcoPath)) {
  console.error(`ERROR: Cannot find eye-active.ico at ${eyeActiveIcoPath}`);
  process.exit(1);
}

// Copy eye-active.ico to app.ico in root directory (critical for Windows)
const appIcoPath = path.join(ROOT_DIR, 'app.ico');

try {
  fs.copyFileSync(eyeActiveIcoPath, appIcoPath);
  console.log(`✓ Copied eye-active.ico to app.ico in root directory`);
} catch (err) {
  console.error(`✗ Failed to copy eye-active.ico to app.ico: ${err.message}`);
}

console.log('\nIcon setup complete! Your app should now use the eye icons.');
console.log('The icons should appear in both the Windows taskbar and system tray.');
