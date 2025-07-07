/**
 * Script to generate platform-specific icons for NoDoze
 * 
 * This script will take the source SVG/PNG and generate:
 * - ICO file for Windows
 * - ICNS file for macOS
 * - PNG files in various sizes for Linux
 * 
 * Requirements:
 * npm install --save-dev sharp png-to-ico
 * 
 * For macOS icon generation, you'll need:
 * npm install --save-dev @fiahfy/icns-convert
 * 
 * Run with: node generate-icons.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const pngToIco = require('png-to-ico');
const icnsConvert = require('@fiahfy/icns-convert');

// Source icon path
const sourceIconPath = path.join(__dirname, 'public', 'icon.svg');
const fallbackIconPath = path.join(__dirname, 'public', 'icon.png');

// Output directories
const winIconDir = path.join(__dirname, 'build', 'icons', 'win');
const macIconDir = path.join(__dirname, 'build', 'icons', 'mac');
const linuxIconDir = path.join(__dirname, 'build', 'icons', 'png');

// Ensure output directories exist
[winIconDir, macIconDir, linuxIconDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Linux icon sizes
const linuxIconSizes = [16, 24, 32, 48, 64, 128, 256, 512, 1024];

/**
 * Generate PNG files from SVG for various resolutions
 * @returns {Promise<string[]>} Array of generated PNG file paths
 */
async function generatePngFiles() {
  const source = fs.existsSync(sourceIconPath) ? sourceIconPath : fallbackIconPath;
  console.log(`Using source icon: ${source}`);

  const pngPaths = [];
  
  for (const size of linuxIconSizes) {
    const outputPath = path.join(linuxIconDir, `${size}x${size}.png`);
    
    console.log(`Generating ${size}x${size} PNG...`);
    
    await sharp(source)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    
    pngPaths.push(outputPath);
  }
  
  console.log('Generated PNG files for Linux');
  return pngPaths;
}

/**
 * Generate Windows ICO file
 */
async function generateWindowsIcon(pngPaths) {
  try {
    console.log('Generating Windows ICO file...');
    
    const selectedPngs = pngPaths.filter(p => {
      const size = parseInt(path.basename(p));
      return size <= 256; // ICO files work best with sizes up to 256
    });
    
    const buf = await pngToIco(selectedPngs);
    fs.writeFileSync(path.join(winIconDir, 'icon.ico'), buf);
    
    console.log('Generated Windows ICO file');
  } catch (err) {
    console.error('Error generating Windows icon:', err);
  }
}

/**
 * Generate macOS ICNS file
 */
async function generateMacOSIcon(pngPaths) {
  try {
    console.log('Generating macOS ICNS file...');
    
    const png1024Path = pngPaths.find(p => p.includes('1024x1024'));
    if (!png1024Path) {
      throw new Error('Could not find 1024x1024 PNG for ICNS conversion');
    }
    
    const pngBuffer = fs.readFileSync(png1024Path);
    const icnsBuffer = await icnsConvert.convert(pngBuffer);
    fs.writeFileSync(path.join(macIconDir, 'icon.icns'), icnsBuffer);
    
    console.log('Generated macOS ICNS file');
  } catch (err) {
    console.error('Error generating macOS icon:', err);
  }
}

/**
 * Main function to run the icon generation process
 */
async function main() {
  try {
    console.log('Starting icon generation...');
    
    const pngPaths = await generatePngFiles();
    await generateWindowsIcon(pngPaths);
    await generateMacOSIcon(pngPaths);
    
    console.log('Icon generation complete!');
  } catch (err) {
    console.error('Error generating icons:', err);
    process.exit(1);
  }
}

// Run the script
main();