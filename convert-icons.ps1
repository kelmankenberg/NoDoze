# PowerShell script to create proper icon directory structure
# and copy files where they need to be

# Create necessary directories if they don't exist
$buildIconsWinDir = Join-Path $PSScriptRoot "build\icons\win"
$buildIconsMacDir = Join-Path $PSScriptRoot "build\icons\mac"

if (-not (Test-Path $buildIconsWinDir)) {
    New-Item -ItemType Directory -Path $buildIconsWinDir -Force | Out-Null
    Write-Host "Created directory: $buildIconsWinDir"
}

if (-not (Test-Path $buildIconsMacDir)) {
    New-Item -ItemType Directory -Path $buildIconsMacDir -Force | Out-Null
    Write-Host "Created directory: $buildIconsMacDir"
}

# Since we don't have .ico files yet, let's copy the png to use as a temporary icon
# We'll use regular icon.png as our default for now
$pngSource = Join-Path $PSScriptRoot "public\icon.png"
$icoTarget = Join-Path $PSScriptRoot "build\icons\win\icon.ico"

# Check if the source file exists
if (Test-Path $pngSource) {
    Write-Host "Found source icon: $pngSource"
    Copy-Item -Path $pngSource -Destination $icoTarget -Force
    Write-Host "Copied to $icoTarget as a temporary icon"
} else {
    Write-Host "Error: Source icon not found at $pngSource"
}

Write-Host "`nWe're using icon.png as a temporary icon.ico file.`nFor production, you'll want to use a proper conversion tool to create .ico and .icns files.`n"
