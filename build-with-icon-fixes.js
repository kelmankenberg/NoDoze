/**
 * Package and Test Icon Changes
 * 
 * This script packages the NoDoze application with the latest taskbar icon changes
 * and includes additional logging to help diagnose production issues.
 */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Add extra logging to force-taskbar-icon-update.js
function enhanceLogging() {
  console.log('Adding extra debugging to force-taskbar-icon-update.js...');
  
  const filePath = path.join(__dirname, 'src', 'main', 'force-taskbar-icon-update.js');
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Add debug file output
  const debugCode = `
  // Add debug file logging
  function debugLog(message) {
    const logPath = path.join(app.getPath('userData'), 'icon-debug.log');
    const timestamp = new Date().toISOString();
    const logLine = \`[\${timestamp}] \${message}\\n\`;
    
    try {
      fs.appendFileSync(logPath, logLine);
    } catch (err) {
      // Ignore errors
    }
    
    console.log(message);
  }
  
  // Override console.log and console.error to also write to debug file
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;
  
  console.log = function(message, ...args) {
    debugLog(\`LOG: \${message}\`);
    if (args.length > 0) {
      debugLog(\`ARGS: \${JSON.stringify(args)}\`);
    }
    originalConsoleLog.apply(console, [message, ...args]);
  };
  
  console.error = function(message, ...args) {
    debugLog(\`ERROR: \${message}\`);
    if (args.length > 0) {
      debugLog(\`ERROR ARGS: \${JSON.stringify(args)}\`);
    }
    originalConsoleError.apply(console, [message, ...args]);
  };
  `;
  
  // Insert debug code after the imports
  const insertPoint = 'const fs = require(\'fs\');\n';
  const newContent = content.replace(insertPoint, insertPoint + debugCode);
  
  fs.writeFileSync(filePath, newContent);
  console.log('✓ Enhanced logging added');
}

// Build the application
function buildApp() {
  return new Promise((resolve, reject) => {
    console.log('Building NoDoze application...');
    
    exec('npm run build', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error building app: ${error.message}`);
        console.error(stderr);
        reject(error);
        return;
      }
      
      console.log(stdout);
      console.log('✓ Build completed successfully');
      resolve();
    });
  });
}

// Package the application
function packageApp() {
  return new Promise((resolve, reject) => {
    console.log('Packaging NoDoze application with electron-builder...');
    
    exec('electron-builder --win --x64', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error packaging app: ${error.message}`);
        console.error(stderr);
        reject(error);
        return;
      }
      
      console.log(stdout);
      console.log('✓ Packaging completed successfully');
      resolve();
    });
  });
}

// Copy icon files to dist directory to ensure they're included in the build
function copyIconsToDistDir() {
  console.log('Copying eye icons to dist directory to ensure they are included in the package...');
  
  try {
    const sourceDir = path.join(__dirname, 'build', 'icons', 'win');
    const destDir = path.join(__dirname, 'dist');
    
    // Create dist directory if it doesn't exist
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    // Copy eye-active.ico
    const sourceActive = path.join(sourceDir, 'eye-active.ico');
    const destActive = path.join(destDir, 'eye-active.ico');
    if (fs.existsSync(sourceActive)) {
      fs.copyFileSync(sourceActive, destActive);
      console.log(`✓ Copied ${sourceActive} to ${destActive}`);
    } else {
      console.error(`✗ Source file ${sourceActive} not found`);
    }
    
    // Copy eye-inactive.ico
    const sourceInactive = path.join(sourceDir, 'eye-inactive.ico');
    const destInactive = path.join(destDir, 'eye-inactive.ico');
    if (fs.existsSync(sourceInactive)) {
      fs.copyFileSync(sourceInactive, destInactive);
      console.log(`✓ Copied ${sourceInactive} to ${destInactive}`);
    } else {
      console.error(`✗ Source file ${sourceInactive} not found`);
    }
    
    // Also copy eye-active.ico as app.ico
    const destAppIco = path.join(destDir, 'app.ico');
    if (fs.existsSync(sourceActive)) {
      fs.copyFileSync(sourceActive, destAppIco);
      console.log(`✓ Copied ${sourceActive} to ${destAppIco}`);
    }
    
  } catch (err) {
    console.error(`Error copying icons: ${err.message}`);
  }
}

// Main function
async function main() {
  try {
    // Step 1: Enhance logging
    enhanceLogging();
    
    // Step 2: Copy icons to dist directory
    copyIconsToDistDir();
    
    // Step 3: Build the application
    await buildApp();
    
    // Step 4: Package the application
    await packageApp();
    
    console.log('\n=== Build and packaging completed successfully ===');
    console.log('The packaged application can be found in the release directory.');
    console.log('Icons should now properly update in the packaged application.');
    console.log('Debug logs will be written to [UserData]/icon-debug.log');
    
  } catch (err) {
    console.error('Failed to build and package:', err);
    process.exit(1);
  }
}

// Run the main function
main();
