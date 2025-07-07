/**
 * This script helps diagnose and fix icon loading issues in Electron apps
 * 
 * Usage:
 * - Copy the desired icon to build/icons/win/icon.ico
 * - Run this script to verify the icon and provide debug information
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Paths to check
const iconPaths = [
  // Check win folder for standard and state icons (ideal location)
  path.join(__dirname, 'build', 'icons', 'win', 'icon.ico'),
  path.join(__dirname, 'build', 'icons', 'win', 'icon-active.ico'),
  path.join(__dirname, 'build', 'icons', 'win', 'icon-inactive.ico'),
  // Check build root as fallback
  path.join(__dirname, 'build', 'icon-active.ico'),
  path.join(__dirname, 'build', 'icon-inactive.ico'),
  // Check public folder for png fallback
  path.join(__dirname, 'public', 'icon.png')
];

// Verify each icon
console.log('Checking icon files...\n');
iconPaths.forEach(iconPath => {
  try {
    if (fs.existsSync(iconPath)) {
      const stats = fs.statSync(iconPath);
      console.log(`✓ Icon exists: ${iconPath}`);
      console.log(`  - Size: ${stats.size} bytes`);
      console.log(`  - Created: ${stats.birthtime}`);
      console.log(`  - Modified: ${stats.mtime}`);
        // For ICO files, display some additional info if possible
      if (iconPath.toLowerCase().endsWith('.ico')) {
        try {
          const buffer = fs.readFileSync(iconPath);
          
          // Validate ICO header (first 6 bytes)
          // 0-1: Reserved (0)
          // 2-3: Type (1 for ICO)
          // 4-5: Number of images
          if (buffer.length >= 6) {
            const isValidHeader = buffer[0] === 0 && buffer[1] === 0 && 
                                buffer[2] === 1 && buffer[3] === 0;
            const numImages = buffer.readUInt16LE(4);
            
            console.log(`  - Contains ${numImages} image(s)`);
            console.log(`  - File size: ${buffer.length} bytes`);
            
            if (!isValidHeader) {
              console.log('  ⚠️ WARNING: Invalid ICO header format');
            }
            
            if (numImages > 100) {
              console.log('  ⚠️ WARNING: Unrealistic image count, ICO may be corrupted');
            }
            
            // Check for reasonable size (multi-image ICO should be at least a few KB)
            if (buffer.length < 1024) {
              console.log('  ⚠️ WARNING: File seems too small for a multi-image ICO');
            }
          } else {
            console.log('  ⚠️ WARNING: File too small to be a valid ICO');
          }
        } catch (e) {
          console.log('  ⚠️ Could not read ICO metadata:', e.message);
        }
      }
    } else {
      console.log(`✗ Icon does not exist: ${iconPath}`);
      
      // Check if the directory exists
      const dir = path.dirname(iconPath);
      if (!fs.existsSync(dir)) {
        console.log(`  - Directory does not exist: ${dir}`);
      }
    }
    console.log('---');
  } catch (error) {
    console.error(`Error checking icon path ${iconPath}:`, error);
  }
});

console.log('\nRecommendations:');
console.log('1. Make sure your icon.ico files are valid Windows icon files with multiple resolutions');
console.log('   (Windows taskbar icons work best with 16x16, 32x32, 48x48, and 256x256 sizes)');
console.log('2. For development and packaging, the following files should exist:');
console.log('   - build/icons/win/icon.ico (main icon for Windows builds)');
console.log('   - build/icons/win/icon-active.ico (active state icon)');
console.log('   - build/icons/win/icon-inactive.ico (inactive state icon)');
console.log('3. If you\'re still having issues with taskbar icons:');
console.log('   - Try completely rebuilding the app (Windows can cache icons)');
console.log('   - Use a reliable ICO converter to ensure proper format');
