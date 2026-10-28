param(
  [Parameter(Mandatory = $true)]
  [string]$ProjectRoot
)

$ErrorActionPreference = 'Stop'
$resolvedProject = (Resolve-Path -LiteralPath $ProjectRoot).Path
if (-not (Test-Path -LiteralPath (Join-Path $resolvedProject 'package.json'))) {
  throw 'ProjectRoot must be the existing TTT repository containing package.json.'
}
$sourceRoot = Join-Path $PSScriptRoot 'skills-source'
$targetRoot = Join-Path $resolvedProject '.claude\skills'
$personalRoot = Join-Path ([Environment]::GetFolderPath('UserProfile')) '.claude\skills'
$skillNames = @('commerce-content-review', 'shop-mentor', 'frontend-ui-engineering', 'supabase', 'supabase-postgres-best-practices', 'ponytail-review', 'ponytail-audit')

# Validate every source before copying any skill. Do not follow junctions/symlinks.
foreach ($skillName in $skillNames) {
  $sourcePath = Join-Path $sourceRoot $skillName
  if (-not (Test-Path -LiteralPath (Join-Path $sourcePath 'SKILL.md'))) {
    throw "Missing SKILL.md for $skillName"
  }
  $sourceItem = Get-Item -LiteralPath $sourcePath
  if ($sourceItem.Attributes -band [IO.FileAttributes]::ReparsePoint) { throw "Linked source is not supported: $sourcePath" }
  $linkedItems = Get-ChildItem -LiteralPath $sourcePath -Recurse -Force | Where-Object { $_.Attributes -band [IO.FileAttributes]::ReparsePoint }
  if ($linkedItems) { throw "Linked files are not supported inside $sourcePath" }
}

New-Item -ItemType Directory -Path $targetRoot -Force | Out-Null
foreach ($skillName in $skillNames) {
  $targetPath = Join-Path $targetRoot $skillName
  $personalPath = Join-Path $personalRoot $skillName
  if ((Test-Path -LiteralPath $targetPath) -or (Test-Path -LiteralPath $personalPath)) {
    Write-Output "SKIPPED $skillName : already present in project or personal skills; compare before updating."
    continue
  }
  Copy-Item -LiteralPath (Join-Path $sourceRoot $skillName) -Destination $targetPath -Recurse
  Write-Output "INSTALLED $skillName -> $targetPath"
}
Write-Output 'No hooks, permissions, MCP connections, or global settings were changed.'
