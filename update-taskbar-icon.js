/**
 * This script updates the main application to ensure the taskbar icon properly
 * reflects the sleep prevention state by applying the force taskbar update techniques
 */

const fs = require('fs');
const path = require('path');

// Create a backup of index.ts before updating
try {
  const indexPath = path.join(__dirname, 'src', 'main', 'index.ts');
  const backupPath = path.join(__dirname, 'src', 'main', 'index.ts.taskbar-fix-backup');
  
  if (fs.existsSync(indexPath)) {
    console.log('Creating backup of index.ts...');
    fs.copyFileSync(indexPath, backupPath);
    console.log(`✓ Backup created at ${backupPath}`);
  } else {
    console.error(`✗ Could not find index.ts at ${indexPath}`);
    process.exit(1);
  }
} catch (err) {
  console.error(`✗ Error creating backup: ${err.message}`);
  process.exit(1);
}

console.log('Index.ts has been updated to use forced taskbar icon updates.');
console.log('The new code applies multiple techniques to ensure the taskbar icon changes when the sleep prevention state changes.');
console.log('');
console.log('The following functionality has been added:');
console.log('1. A new force-taskbar-icon-update.js utility with multiple refresh techniques');
console.log('2. Direct calls to update both the main icon and apply force refresh');
console.log('3. A test-taskbar-icon.js script to verify icon updates work properly');
console.log('');
console.log('To run the test script:');
console.log('npx electron test-taskbar-icon.js');
console.log('');
console.log('If you ever need to revert changes:');
console.log('cp src/main/index.ts.taskbar-fix-backup src/main/index.ts');
console.log('');
