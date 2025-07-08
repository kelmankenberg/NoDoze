/**
 * Extract and Copy Icons
 * 
 * This utility extracts icons from the app.asar file and copies them to locations
 * where the production app can access them. This is run at app startup in production.
 */

const { app } = require('electron');
const path = require('path');
const fs = require('fs');

/**
 * Extracts icons from app.asar and copies them to accessible locations
 * Runs only in production and ensures icons are available for taskbar updates
 */
async function extractAndCopyIcons() {
  console.log('Running extract and copy icons utility...');
  
  if (!app.isPackaged) {
    console.log('Development mode detected, skipping icon extraction');
    return false;
  }
  
  try {
    const exeDir = path.dirname(app.getPath('exe'));
    const resourcesDir = path.join(exeDir, 'resources');
    const appAsarPath = path.join(resourcesDir, 'app.asar');
    
    console.log(`Extracting and copying icons in production mode`);
    console.log(`- Executable directory: ${exeDir}`);
    console.log(`- Resources directory: ${resourcesDir}`);
    
    // Ensure target directory exists
    if (!fs.existsSync(exeDir)) {
      console.error(`Executable directory does not exist: ${exeDir}`);
      return false;
    }
    
    // Copy icons from various possible locations to the exe directory
    const extractedIcons = {
      eyeActive: false,
      eyeInactive: false
    };
    
    // Try to find icons in all possible locations in the production build
    const possibleLocations = [
      // In resources directory directly
      resourcesDir,
      // In unpacked resources
      path.join(resourcesDir, 'app.asar.unpacked'),
      // In build folder 
      path.join(resourcesDir, 'app.asar.unpacked', 'build'),
      path.join(resourcesDir, 'build'),
      // In build/icons/win folders
      path.join(resourcesDir, 'app.asar.unpacked', 'build', 'icons', 'win'),
      path.join(resourcesDir, 'build', 'icons', 'win'),
      // In public folder
      path.join(resourcesDir, 'app.asar.unpacked', 'public'),
      path.join(resourcesDir, 'public'),
    ];
    
    // Try copying icons from each location
    for (const location of possibleLocations) {
      try {
        if (fs.existsSync(location)) {
          console.log(`Checking location: ${location}`);
          
          // Try to find eye-active.ico
          if (!extractedIcons.eyeActive) {
            const eyeActivePath = path.join(location, 'eye-active.ico');
            if (fs.existsSync(eyeActivePath)) {
              const targetPath = path.join(exeDir, 'eye-active.ico');
              fs.copyFileSync(eyeActivePath, targetPath);
              console.log(`✓ Copied eye-active.ico to ${targetPath}`);
              extractedIcons.eyeActive = true;
            }
          }
          
          // Try to find eye-inactive.ico
          if (!extractedIcons.eyeInactive) {
            const eyeInactivePath = path.join(location, 'eye-inactive.ico');
            if (fs.existsSync(eyeInactivePath)) {
              const targetPath = path.join(exeDir, 'eye-inactive.ico');
              fs.copyFileSync(eyeInactivePath, targetPath);
              console.log(`✓ Copied eye-inactive.ico to ${targetPath}`);
              extractedIcons.eyeInactive = true;
            }
          }
          
          // If we found both icons, we can stop searching
          if (extractedIcons.eyeActive && extractedIcons.eyeInactive) {
            break;
          }
        }
      } catch (err) {
        console.error(`Error checking location ${location}:`, err);
      }
    }
    
    // If we still haven't found the icons, try extracting from the app.asar
    if (!extractedIcons.eyeActive || !extractedIcons.eyeInactive) {
      console.log('Could not find icons in standard locations, trying to extract from app.asar');
      
      try {
        // This requires the asar package, but we can't rely on it being available
        // So this is just a best-effort attempt
        try {
          const asar = require('asar');
          console.log('Found asar package, attempting extraction');
          
          // Extract build folder from asar
          const tempDir = path.join(exeDir, 'temp_icons');
          if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
          }
          
          // Extract only the build folder with icons
          asar.extractAll(appAsarPath, tempDir, 'build/**/*.ico');
          
          // Check if we got the icons
          const extractedActivePath = path.join(tempDir, 'build', 'eye-active.ico');
          const extractedInactivePath = path.join(tempDir, 'build', 'eye-inactive.ico');
          
          if (fs.existsSync(extractedActivePath) && !extractedIcons.eyeActive) {
            const targetPath = path.join(exeDir, 'eye-active.ico');
            fs.copyFileSync(extractedActivePath, targetPath);
            console.log(`✓ Extracted and copied eye-active.ico to ${targetPath}`);
            extractedIcons.eyeActive = true;
          }
          
          if (fs.existsSync(extractedInactivePath) && !extractedIcons.eyeInactive) {
            const targetPath = path.join(exeDir, 'eye-inactive.ico');
            fs.copyFileSync(extractedInactivePath, targetPath);
            console.log(`✓ Extracted and copied eye-inactive.ico to ${targetPath}`);
            extractedIcons.eyeInactive = true;
          }
          
          // Clean up temp dir
          try {
            fs.rmdirSync(tempDir, { recursive: true });
          } catch (cleanupErr) {
            console.error('Error cleaning up temp dir:', cleanupErr);
          }
          
        } catch (asarErr) {
          console.log('Asar package not available, cannot extract from asar file:', asarErr);
        }
      } catch (extractErr) {
        console.error('Error extracting icons from asar:', extractErr);
      }
    }
    
    // Create alternative icons from any ico file as last resort
    if (!extractedIcons.eyeActive || !extractedIcons.eyeInactive) {
      console.log('Still missing some icons, looking for any .ico file as fallback');
      
      try {
        const files = fs.readdirSync(exeDir);
        let foundIco = null;
        
        for (const file of files) {
          if (file.endsWith('.ico')) {
            foundIco = path.join(exeDir, file);
            console.log(`Found ico file to use as fallback: ${foundIco}`);
            break;
          }
        }
        
        if (foundIco) {
          // Use this ico file for any missing icons
          if (!extractedIcons.eyeActive) {
            const targetPath = path.join(exeDir, 'eye-active.ico');
            fs.copyFileSync(foundIco, targetPath);
            console.log(`✓ Created eye-active.ico from fallback ico`);
            extractedIcons.eyeActive = true;
          }
          
          if (!extractedIcons.eyeInactive) {
            const targetPath = path.join(exeDir, 'eye-inactive.ico');
            fs.copyFileSync(foundIco, targetPath);
            console.log(`✓ Created eye-inactive.ico from fallback ico`);
            extractedIcons.eyeInactive = true;
          }
        }
      } catch (fallbackErr) {
        console.error('Error creating fallback icons:', fallbackErr);
      }
    }
    
    // Create app.ico from eye-active.ico
    if (extractedIcons.eyeActive) {
      const eyeActivePath = path.join(exeDir, 'eye-active.ico');
      const appIcoPath = path.join(exeDir, 'app.ico');
      
      try {
        fs.copyFileSync(eyeActivePath, appIcoPath);
        console.log(`✓ Created app.ico from eye-active.ico`);
      } catch (appIcoErr) {
        console.error('Error creating app.ico:', appIcoErr);
      }
    }
    
    // Report results
    if (extractedIcons.eyeActive && extractedIcons.eyeInactive) {
      console.log('Successfully extracted and copied all required icons');
      return true;
    } else {
      console.error('Failed to extract and copy all required icons');
      return false;
    }
    
  } catch (error) {
    console.error('Error in extractAndCopyIcons:', error);
    return false;
  }
}

module.exports = { extractAndCopyIcons };
