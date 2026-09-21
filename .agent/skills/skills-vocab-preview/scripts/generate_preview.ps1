<#
.SYNOPSIS
    Generates an interactive, standalone HTML preview for a Unit vocab folder.
.DESCRIPTION
    Reads vocab.json, image-prompts.json (if present), and all exercise JSON files in exercises/,
    and injects them into template.html to produce a self-contained preview.html.
.PARAMETER VocabDir
    The path to the vocab folder (e.g., data/gs6/unit-7/vocab).
.PARAMETER OutputFile
    Optional. The path of the output HTML file. Defaults to <VocabDir>/preview.html.
.EXAMPLE
    powershell -ExecutionPolicy Bypass -File .agent/skills/skills-vocab-preview/scripts/generate_preview.ps1 -VocabDir "data/gs6/unit-7/vocab"
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$VocabDir,

    [Parameter(Mandatory = $false, Position = 1)]
    [string]$OutputFile = ""
)

$ErrorActionPreference = "Stop"

# Set encoding to UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Resolve Paths
$VocabDirPath = [System.IO.Path]::GetFullPath($VocabDir)
if (-not (Test-Path -Path $VocabDirPath -PathType Container)) {
    Write-Error "Vocab directory does not exist: $VocabDirPath"
    exit 1
}

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$TemplatePath = Join-Path $ScriptDir "template.html"
if (-not (Test-Path -Path $TemplatePath -PathType Leaf)) {
    Write-Error "Template file not found at: $TemplatePath"
    exit 1
}

if ([string]::IsNullOrWhiteSpace($OutputFile)) {
    $OutputPath = Join-Path $VocabDirPath "preview.html"
} else {
    $OutputPath = [System.IO.Path]::GetFullPath($OutputFile)
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  VOCAB PREVIEW GENERATOR               " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Vocab Directory: $VocabDirPath"
Write-Host "Output File:     $OutputPath"

# 1. Read vocab.json
$VocabJsonFile = Join-Path $VocabDirPath "vocab.json"
$VocabJsonRaw = "[]"
if (Test-Path -Path $VocabJsonFile -PathType Leaf) {
    Write-Host "[+] Reading vocab.json..." -ForegroundColor Green
    $VocabJsonRaw = [System.IO.File]::ReadAllText($VocabJsonFile, [System.Text.Encoding]::UTF8)
} else {
    Write-Warning "vocab.json not found in $VocabDirPath!"
}

# 2. Read all exercise JSON files in exercises/
$ExercisesDir = Join-Path $VocabDirPath "exercises"
$ExercisesList = [System.Collections.ArrayList]::new()

if (Test-Path -Path $ExercisesDir -PathType Container) {
    Write-Host "[+] Scanning exercises in $ExercisesDir..." -ForegroundColor Green
    $ExerciseFiles = Get-ChildItem -Path $ExercisesDir -Filter "*.json" | Sort-Object Name
    foreach ($file in $ExerciseFiles) {
        try {
            $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
            $null = $ExercisesList.Add($content)
            Write-Host "    - Loaded $($file.Name)" -ForegroundColor Gray
        } catch {
            Write-Warning "Failed to read $($file.FullName): $_"
        }
    }
} else {
    Write-Warning "exercises directory not found in $VocabDirPath!"
}

$ExercisesJsonRaw = "[" + ($ExercisesList -join ",") + "]"

# 3. Read image-prompts.json (optional)
$PromptsJsonFile = Join-Path $VocabDirPath "image-prompts.json"
$PromptsJsonRaw = "[]"
if (Test-Path -Path $PromptsJsonFile -PathType Leaf) {
    Write-Host "[+] Reading image-prompts.json..." -ForegroundColor Green
    $PromptsJsonRaw = [System.IO.File]::ReadAllText($PromptsJsonFile, [System.Text.Encoding]::UTF8)
}

# 4. Infer Unit Metadata from directory path
# Expected pattern: .../<grade>/<unit>/vocab
$NormalizedPath = $VocabDirPath.Replace("\", "/")
$PathParts = $NormalizedPath.Split("/")
$UnitName = "Unit"
$GradeName = "Grade"

for ($i = 0; $i -lt $PathParts.Length; $i++) {
    if ($PathParts[$i] -match "^(unit-\d+|unit\d+)$") {
        $UnitName = $Matches[0].ToUpper()
        if ($i -gt 0) {
            $GradeName = $PathParts[$i-1].ToUpper()
        }
    }
}

$MetaObj = @{
    title = "$GradeName - $UnitName"
    grade = $GradeName
    unit = $UnitName
    subtitle = "Review & Practice Suite for $GradeName $UnitName"
    generatedAt = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
}
$MetaJsonRaw = $MetaObj | ConvertTo-Json -Compress

# 5. Read template and substitute placeholders
Write-Host "[+] Reading HTML template..." -ForegroundColor Green
$TemplateContent = [System.IO.File]::ReadAllText($TemplatePath, [System.Text.Encoding]::UTF8)

$OutputContent = $TemplateContent
$OutputContent = $OutputContent.Replace("/* __VOCAB_DATA__ */ []", $VocabJsonRaw)
$OutputContent = $OutputContent.Replace("/* __EXERCISES_DATA__ */ []", $ExercisesJsonRaw)
$OutputContent = $OutputContent.Replace("/* __IMAGE_PROMPTS_DATA__ */ []", $PromptsJsonRaw)
$OutputContent = $OutputContent.Replace("/* __UNIT_INFO__ */ {}", $MetaJsonRaw)

# 6. Write output HTML file
Write-Host "[+] Writing output file to $OutputPath..." -ForegroundColor Green
$OutputDir = Split-Path -Parent $OutputPath
if (-not (Test-Path -Path $OutputDir -PathType Container)) {
    $null = New-Item -ItemType Directory -Path $OutputDir -Force
}

[System.IO.File]::WriteAllText($OutputPath, $OutputContent, [System.Text.Encoding]::UTF8)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SUCCESS! Generated preview at:" -ForegroundColor Green
Write-Host "$OutputPath" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
