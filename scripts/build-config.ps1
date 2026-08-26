$ErrorActionPreference = 'Stop'

$sourceDir = $env:OC_SOURCE
$targetDir = $env:OC_TARGET
if (-not $sourceDir -or -not $targetDir) { throw "OC_SOURCE / OC_TARGET not set" }

$templatePath = Join-Path $sourceDir 'opencode.jsonc'
$outPath = Join-Path $targetDir 'opencode.jsonc'

$config = Get-Content $templatePath -Raw

if ($env:OC_USERNAME) {
    $config = $config.Replace('{{USERNAME}}', $env:OC_USERNAME)
}

if ($env:OC_GH_MULTI -eq '1') {
    $config = $config.Replace('{env:GITHUB_API_KEY}', '{env:GITHUB_API_KEY_1}')
}

if ($env:HAS_GITHUB -ne '1') {
    $config = [regex]::Replace($config, '("github"\s*:\s*\{.*?"enabled":\s*)true', '$1false', [System.Text.RegularExpressions.RegexOptions]::Singleline)
}

if ($env:HAS_BRAVE -eq '1') {
    $config = [regex]::Replace($config, '("brave-search"\s*:\s*\{.*?"enabled":\s*)false', '$1true', [System.Text.RegularExpressions.RegexOptions]::Singleline)
}

if ($env:HAS_CUSTOM -eq '1' -and $env:OC_CBASE -and $env:OC_CMODEL) {
    $base = $env:OC_CBASE.Trim().TrimEnd('/').Replace('"', '').Replace('\', '')
    $model = $env:OC_CMODEL.Trim().Replace('"', '').Replace('\', '')
    $keyName = ($model -replace '[^A-Za-z0-9._-]', '-').ToLowerInvariant()

    if ($base -and $model) {
        $block = @"
"provider": {
    "$keyName": {
      "name": "$model",
      "npm": "@ai-sdk/openai-compatible",
      "options": {
        "baseURL": "$base",
        "apiKey": "{env:CUSTOM_LLM_API_KEY}"
      },
      "models": {
        "$model": {}
      }
    }
  }
"@
        $config = $config.Replace('"provider": {}', $block)
    }
}

try {
    $null = $config | ConvertFrom-Json
} catch {
    throw "Generated opencode.jsonc is invalid JSON: $_"
}

Set-Content -Path $outPath -Value $config
