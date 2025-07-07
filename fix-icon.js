/**
 * Fix the main icon.ico file by copying a valid icon file
 * This addresses the corrupted icon.ico in build/icons/win folder
 */

const fs = require('fs');
const path = require('path');

// Source and destination paths
const sourceIconPath = path.join(__dirname, 'build', 'icons', 'win', 'icon-active.ico');
const destIconPath = path.join(__dirname, 'build', 'icons', 'win', 'icon.ico');

try {
  console.log(`Checking source icon: ${sourceIconPath}`);
  if (fs.existsSync(sourceIconPath)) {
    const stats = fs.statSync(sourceIconPath);
    console.log(`Source icon exists: ${stats.size} bytes`);
    
    // Copy the file
    fs.copyFileSync(sourceIconPath, destIconPath);
    
    // Verify the copy worked
    if (fs.existsSync(destIconPath)) {
      const newStats = fs.statSync(destIconPath);
      console.log(`Successfully created icon.ico: ${newStats.size} bytes`);
    } else {
      console.error('Failed to create icon.ico file');
    }
  } else {
    console.error('Source icon file not found');
  }
} catch (error) {
  console.error('Error fixing icon:', error);
}
