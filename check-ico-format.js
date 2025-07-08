/**
 * Check if ICO files are properly formatted
 * This script examines ICO files to verify they have the correct header
 */

const fs = require('fs');
const path = require('path');

// Function to check if a file is a valid ICO
function isValidIcoFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return { valid: false, error: 'File does not exist' };
    }
    
    const buffer = fs.readFileSync(filePath);
    
    // ICO files start with the signature: 00 00 01 00
    if (buffer.length < 4) {
      return { valid: false, error: 'File too small to be an ICO' };
    }
    
    const isIco = buffer[0] === 0 && buffer[1] === 0 && buffer[2] === 1 && buffer[3] === 0;
    
    if (!isIco) {
      return { valid: false, error: 'Invalid ICO header signature' };
    }
    
    // Check for number of images in the ICO file (at offset 4, 2 bytes)
    const imageCount = buffer.readUInt16LE(4);
    
    // Analyze the directory entries if it's a valid ICO
    const sizes = [];
    if (isIco && imageCount > 0) {
      // Directory entries start at offset 6
      for (let i = 0; i < imageCount; i++) {
        const entryOffset = 6 + (i * 16);
        
        if (entryOffset + 16 <= buffer.length) {
          // Image width at offset 0 in the entry (1 byte)
          // 0 means 256
          let width = buffer[entryOffset];
          if (width === 0) width = 256;
          
          // Image height at offset 1 in the entry (1 byte)
          // 0 means 256
          let height = buffer[entryOffset + 1];
          if (height === 0) height = 256;
          
          sizes.push(`${width}x${height}`);
        }
      }
    }
    
    return { 
      valid: isIco, 
      count: imageCount,
      sizes: sizes,
      sizeBytes: buffer.length
    };
  } catch (err) {
    return { valid: false, error: err.message };
  }
}

// Check the eye icons
const eyeActiveIco = path.join(__dirname, 'build', 'icons', 'win', 'eye-active.ico');
const eyeInactiveIco = path.join(__dirname, 'build', 'icons', 'win', 'eye-inactive.ico');

// Check the regular icons for comparison
const iconActiveIco = path.join(__dirname, 'build', 'icons', 'win', 'icon-active.ico');
const iconInactiveIco = path.join(__dirname, 'build', 'icons', 'win', 'icon-inactive.ico');

// Check the main icon.ico files
const buildWinIconIco = path.join(__dirname, 'build', 'icons', 'win', 'icon.ico');
const buildIconIco = path.join(__dirname, 'build', 'icon.ico');
const rootAppIco = path.join(__dirname, 'app.ico');

console.log('ICO File Format Check');
console.log('===================');

console.log('\nEye Icons:');
console.log('---------');

const eyeActiveResult = isValidIcoFile(eyeActiveIco);
console.log(`eye-active.ico: ${eyeActiveResult.valid ? 'VALID' : 'INVALID'}`);
if (eyeActiveResult.valid) {
  console.log(`  - Contains ${eyeActiveResult.count} images`);
  console.log(`  - Sizes: ${eyeActiveResult.sizes.join(', ')}`);
  console.log(`  - File size: ${(eyeActiveResult.sizeBytes / 1024).toFixed(2)} KB`);
} else {
  console.log(`  - Error: ${eyeActiveResult.error}`);
}

const eyeInactiveResult = isValidIcoFile(eyeInactiveIco);
console.log(`\neye-inactive.ico: ${eyeInactiveResult.valid ? 'VALID' : 'INVALID'}`);
if (eyeInactiveResult.valid) {
  console.log(`  - Contains ${eyeInactiveResult.count} images`);
  console.log(`  - Sizes: ${eyeInactiveResult.sizes.join(', ')}`);
  console.log(`  - File size: ${(eyeInactiveResult.sizeBytes / 1024).toFixed(2)} KB`);
} else {
  console.log(`  - Error: ${eyeInactiveResult.error}`);
}

console.log('\nRegular Icons (for comparison):');
console.log('-----------------------------');

const iconActiveResult = isValidIcoFile(iconActiveIco);
console.log(`icon-active.ico: ${iconActiveResult.valid ? 'VALID' : 'INVALID'}`);
if (iconActiveResult.valid) {
  console.log(`  - Contains ${iconActiveResult.count} images`);
  console.log(`  - Sizes: ${iconActiveResult.sizes.join(', ')}`);
  console.log(`  - File size: ${(iconActiveResult.sizeBytes / 1024).toFixed(2)} KB`);
} else {
  console.log(`  - Error: ${iconActiveResult.error}`);
}

const iconInactiveResult = isValidIcoFile(iconInactiveIco);
console.log(`\nicon-inactive.ico: ${iconInactiveResult.valid ? 'VALID' : 'INVALID'}`);
if (iconInactiveResult.valid) {
  console.log(`  - Contains ${iconInactiveResult.count} images`);
  console.log(`  - Sizes: ${iconInactiveResult.sizes.join(', ')}`);
  console.log(`  - File size: ${(iconInactiveResult.sizeBytes / 1024).toFixed(2)} KB`);
} else {
  console.log(`  - Error: ${iconInactiveResult.error}`);
}
