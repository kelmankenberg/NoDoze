/**
 * NoDoze Windows Sleep Prevention Validation Script
 * 
 * This script helps manually validate that the sleep prevention functionality
 * works correctly on Windows by using PowerShell commands to check and manipulate
 * power settings directly.
 */
const { exec } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Constants for Windows power settings
const EXECUTION_STATE_FLAGS = {
  ES_CONTINUOUS: '0x80000000',
  ES_SYSTEM_REQUIRED: '0x00000001',
  ES_DISPLAY_REQUIRED: '0x00000002'
};

// PowerShell command to get current power settings (simplified)
const GET_POWER_SETTINGS_CMD = 
  `powershell -Command "Get-CimInstance -Namespace root/cimv2/power -ClassName Win32_PowerSettingDataIndex | Format-List"`;

// PowerShell command to check screen timeout settings
const GET_SCREEN_TIMEOUT_CMD = 
  `powershell -Command "powercfg /q SCHEME_CURRENT SUB_VIDEO VIDEOIDLE"`;

// PowerShell command to check sleep timeout settings
const GET_SLEEP_TIMEOUT_CMD = 
  `powershell -Command "powercfg /q SCHEME_CURRENT SUB_SLEEP STANDBYIDLE"`;

// Function to execute a PowerShell command and return the result
function execCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        return reject(error);
      }
      if (stderr) {
        console.error(`Command stderr: ${stderr}`);
      }
      return resolve(stdout);
    });
  });
}

// Function to get the current power settings
async function getPowerSettings() {
  console.log('\nChecking current power settings...');
  
  try {
    // Get screen timeout settings
    const screenTimeout = await execCommand(GET_SCREEN_TIMEOUT_CMD);
    console.log('\nCurrent screen timeout settings:');
    console.log(screenTimeout);
    
    // Get sleep timeout settings
    const sleepTimeout = await execCommand(GET_SLEEP_TIMEOUT_CMD);
    console.log('\nCurrent sleep timeout settings:');
    console.log(sleepTimeout);
    
    return { screenTimeout, sleepTimeout };
  } catch (error) {
    console.error('Failed to get power settings:', error);
    return null;
  }
}

// Function to simulate SetThreadExecutionState using PowerShell
async function setThreadExecutionState(flags) {
  // PowerShell command to call SetThreadExecutionState via P/Invoke
  const command = `
    powershell -Command "
      Add-Type @'
      using System;
      using System.Runtime.InteropServices;
      public class PInvoke {
        [DllImport(\\"kernel32.dll\\", CharSet = CharSet.Auto, SetLastError = true)]
        public static extern uint SetThreadExecutionState(uint esFlags);
      }
'@
      [PInvoke]::SetThreadExecutionState(${flags})
      Write-Host 'SetThreadExecutionState called with flags: ${flags}'
    "`;
  
  try {
    const result = await execCommand(command);
    console.log(result);
    return true;
  } catch (error) {
    console.error('Failed to set thread execution state:', error);
    return false;
  }
}

// Function to validate sleep prevention is working
async function validateSleepPrevention() {
  console.log('\n===== NoDoze Windows Sleep Prevention Validation =====\n');
  console.log('This script will help validate that sleep prevention works correctly on Windows.');
  
  // Step 1: Check initial power settings
  console.log('\nSTEP 1: Checking initial power settings...');
  await getPowerSettings();
  
  // Step 2: Enable sleep prevention
  console.log('\nSTEP 2: Enabling sleep prevention...');
  // ES_CONTINUOUS | ES_SYSTEM_REQUIRED | ES_DISPLAY_REQUIRED
  const enableFlags = `${EXECUTION_STATE_FLAGS.ES_CONTINUOUS} | ${EXECUTION_STATE_FLAGS.ES_SYSTEM_REQUIRED} | ${EXECUTION_STATE_FLAGS.ES_DISPLAY_REQUIRED}`;
  await setThreadExecutionState(enableFlags);
  
  // Step 3: Validate effect
  console.log('\nSTEP 3: Sleep prevention is now active.');
  console.log('Your computer should now stay awake and the display should not turn off.');
  console.log('Please wait for 5 minutes to validate that your computer does not go to sleep...');
  
  // Prompt user to continue after manual validation
  await new Promise(resolve => {
    rl.question('\nHas your computer stayed awake for the test period? (yes/no): ', answer => {
      if (answer.toLowerCase() === 'yes') {
        console.log('Success! Sleep prevention is working correctly.');
      } else {
        console.log('Sleep prevention may not be working properly. Further investigation required.');
      }
      resolve();
    });
  });
  
  // Step 4: Disable sleep prevention
  console.log('\nSTEP 4: Disabling sleep prevention...');
  // ES_CONTINUOUS only to reset
  await setThreadExecutionState(EXECUTION_STATE_FLAGS.ES_CONTINUOUS);
  console.log('Sleep prevention disabled. Normal power settings restored.');
  
  // Step 5: Final verification
  console.log('\nSTEP 5: Verifying power settings have been restored...');
  await getPowerSettings();
  
  console.log('\n===== Validation Complete =====\n');
  console.log('Please document the results of this test for your records.');
  
  rl.close();
}

// Run the validation
validateSleepPrevention().catch(error => {
  console.error('Validation failed:', error);
  rl.close();
});