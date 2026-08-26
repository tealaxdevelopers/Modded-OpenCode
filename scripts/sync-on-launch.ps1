# OpenCode Local Setup - PowerShell launcher
# Run this to sync local models from Ollama/LM Studio/vLLM

$setupDir = "$env:USERPROFILE\.config\opencode\local-setup"
$env:OPENCODE_LOCAL_SETUP_DIR = $setupDir
$env:LOCAL_API_BASE = "http://127.0.0.1:11434/v1"

# Load .env.local if exists
$envFile = "$setupDir\.env.local"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^([^#=]+)=(.+)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            if (-not [string]::IsNullOrEmpty($name)) {
                Set-Item -Path "env:$name" -Value $value -ErrorAction SilentlyContinue
            }
        }
    }
}

# Run sync-on-launch
$configDir = "$env:USERPROFILE\.config\opencode"
$env:OPENCODE_CONFIG = "$configDir\opencode.jsonc"
node "$setupDir\scripts\sync-on-launch.mjs" 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "? Local models synced"
} else {
    Write-Host "! No local model servers found (Ollama/LM Studio not running)"
}
