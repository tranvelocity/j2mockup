<#
  _reorganize_mockups.ps1  (ASCII-safe version)
  --------------------------------------------------------------------------------
  Group buyer-portal mockups into function folders (1 function = 1 folder),
  keep a shared assets/ folder and rewrite cross-folder links to relative (../).

  IMPORTANT: This script source is PURE ASCII. Japanese folder names are built at
  runtime from Unicode code points ([char]0x....), so it parses correctly on
  Windows PowerShell 5.1 regardless of the console/system code page (the previous
  version broke because Japanese literals in code were mis-decoded as CP932).

  Result structure:
    buyer-portal/
      assets/                 (shared; layout.js cross-links fixed to ../)
      <Kyotsu>/     (Kyotsu = common)            : Login, Home
      <Koubai>/     (Koubai = purchase-inquiry)  : 4 Requester screens
      <Mitsumori>/  (Mitsumori = estimate-req)   : 4 Purchaser screens (detail->input->approver->confirm)
      RFX folder    (left untouched - already self-contained)
      sitemap.md

  RUN (PowerShell, in the buyer-portal folder):
      powershell -ExecutionPolicy Bypass -File .\_reorganize_mockups.ps1

  Safe & idempotent: checks existence before moving; UTF-8 (no BOM) writes.
#>

$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
if (-not $root) { $root = (Get-Location).Path }
Write-Host "Base: $root" -ForegroundColor Cyan

$utf8 = New-Object System.Text.UTF8Encoding($false)
function Save-Text($path, $text) { [System.IO.File]::WriteAllText($path, $text, $utf8) }

# --- Japanese folder names via Unicode code points (keeps source ASCII) ---
$Kyotsu    = -join ([char]0x5171,[char]0x901A)                                                                        # common
$Koubai    = -join ([char]0x8CFC,[char]0x8CB7,[char]0x53D6,[char]0x5F15,[char]0x6848,[char]0x4EF6,[char]0x7167,[char]0x4F1A)  # purchase inquiry
$Mitsumori = -join ([char]0x898B,[char]0x7A4D,[char]0x4F9D,[char]0x983C)                                              # estimate request

$groups = [ordered]@{}
$groups[$Kyotsu]    = @('eProcurement_Login.html', 'eProcurement_Home.html')
$groups[$Koubai]    = @(
    'eProcurement_Requester_All.html',
    'eProcurement_Requester_Ordered.html',
    'eProcurement_Requester_WaitingAcceptance.html',
    'eProcurement_Requester_EstimateApplicationApplicantList.html'
)
$groups[$Mitsumori] = @(
    'eProcurement_Purchaser_EstimateRequestDetail.html',
    'eProcurement_Purchaser_Input.html',
    'eProcurement_Purchaser_ApproverSelection.html',
    'eProcurement_Purchaser_Confirmation.html'
)

# --- 1) create folders + move files ---
foreach ($g in $groups.Keys) {
    $dir = Join-Path $root $g
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null; Write-Host ("mkdir  " + $g) -ForegroundColor Green }
    foreach ($f in $groups[$g]) {
        $src = Join-Path $root $f
        $dst = Join-Path $dir  $f
        if (Test-Path $dst)      { Write-Host ("  skip (exists)  " + $g + "/" + $f) -ForegroundColor DarkGray; continue }
        elseif (Test-Path $src)  { Move-Item -LiteralPath $src -Destination $dst; Write-Host ("  moved  " + $f + "  ->  " + $g + "/") -ForegroundColor Green }
        else                     { Write-Host ("  not found  " + $f) -ForegroundColor Yellow }
    }
}

# --- 2) fix paths inside moved HTML files ---
$homeHref = 'href="../' + $Kyotsu + '/eProcurement_Home.html"'
foreach ($g in $groups.Keys) {
    $dir = Join-Path $root $g
    foreach ($f in $groups[$g]) {
        $p = Join-Path $dir $f
        if (-not (Test-Path $p)) { continue }
        $c = [System.IO.File]::ReadAllText($p, $utf8); $o = $c
        $c = $c -replace 'href="assets/', 'href="../assets/'
        $c = $c -replace 'src="assets/',  'src="../assets/'
        $c = $c.Replace('href="eProcurement_Home.html"', $homeHref)   # breadcrumb -> ../<common>/
        if ($c -ne $o) { Save-Text $p $c; Write-Host ("  fixed paths  " + $g + "/" + $f) -ForegroundColor Green }
    }
}

# --- 3) fix cross-folder links in shared assets/layout.js (RFX has its own copy - untouched) ---
$layout = Join-Path $root 'assets\layout.js'
if (Test-Path $layout) {
    $c = [System.IO.File]::ReadAllText($layout, $utf8); $o = $c
    $homePath = '../' + $Kyotsu + '/eProcurement_Home.html'
    if ($c -notmatch [regex]::Escape($homePath)) {
        $c = $c.Replace('eProcurement_Home.html', $homePath)   # logo + home-top + #Notification fallback
    }
    $eaHref  = 'href="../' + $Koubai + '/eProcurement_Requester_EstimateApplicationApplicantList.html"'
    $allHref = 'href="../' + $Koubai + '/eProcurement_Requester_All.html"'
    $c = $c.Replace('href="eProcurement_Requester_EstimateApplicationApplicantList.html"', $eaHref)
    $c = $c.Replace('href="eProcurement_Requester_All.html"', $allHref)
    if ($c -ne $o) { Save-Text $layout $c; Write-Host "fixed  assets/layout.js (cross-folder links -> ../)" -ForegroundColor Green }
}
else { Write-Host "not found  assets/layout.js" -ForegroundColor Yellow }

Write-Host "`nDone. Open to verify:  <Mitsumori>\eProcurement_Purchaser_EstimateRequestDetail.html" -ForegroundColor Cyan
