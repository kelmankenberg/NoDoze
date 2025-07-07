const svgToIco = require('svg-to-ico');
const fs = require('fs');
const path = require('path');

// Ensure directories exist
const winIconDir = path.join(__dirname, 'build', 'icons', 'win');
const macIconDir = path.join(__dirname, 'build', 'icons', 'mac');

if (!fs.existsSync(winIconDir)) {
  fs.mkdirSync(winIconDir, { recursive: true });
  console.log(`Created directory: ${winIconDir}`);
}

if (!fs.existsSync(macIconDir)) {
  fs.mkdirSync(macIconDir, { recursive: true });
  console.log(`Created directory: ${macIconDir}`);
}

// Define icon conversions
const conversions = [
  {
    name: 'Default Icon',
    source: path.join(__dirname, 'build', 'icon-active.svg'),
    targetIco: path.join(__dirname, 'build', 'icons', 'win', 'icon.ico'),
    sizes: [16, 24, 32, 48, 64, 128, 256]
  },
  {
    name: 'Active Icon',
    source: path.join(__dirname, 'build', 'icon-active.svg'),
    targetIco: path.join(__dirname, 'build', 'icons', 'win', 'icon-active.ico'),
    sizes: [16, 24, 32, 48, 64, 128, 256]
  },
  {
    name: 'Inactive Icon',
    source: path.join(__dirname, 'build', 'icon-inactive.svg'),
    targetIco: path.join(__dirname, 'build', 'icons', 'win', 'icon-inactive.ico'),
    sizes: [16, 24, 32, 48, 64, 128, 256]
  }
];

// Process each conversion
async function main() {
  for (const conversion of conversions) {
    try {
      console.log(`Converting ${conversion.name}...`);
      
      // Check if source file exists
      if (!fs.existsSync(conversion.source)) {
        console.error(`Source file doesn't exist: ${conversion.source}`);
        continue;
      }
      
      // Convert SVG to ICO
      await svgToIco(conversion.source, conversion.targetIco, {
        sizes: conversion.sizes
      });
      
      console.log(`Successfully created ${conversion.targetIco}`);
    } catch (error) {
      console.error(`Failed to convert ${conversion.name}:`, error);
    }
  }
  
  console.log('Icon conversion complete!');
}

main().catch(console.error);
