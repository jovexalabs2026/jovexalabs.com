param(
  [Parameter(Mandatory = $true)]
  [string] $Destination
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
Add-Type -AssemblyName System.IO.Compression
$root = (Resolve-Path (Join-Path $PSScriptRoot '..\dist')).Path
foreach ($name in @('CNAME', '404.html', '_redirects')) {
  if (Test-Path (Join-Path $root $name)) {
    throw 'Run npm run build:pages before packaging.'
  }
}

$archive = [System.IO.Compression.ZipFile]::Open(
  $Destination, [System.IO.Compression.ZipArchiveMode]::Create
)
try {
  $count = 0
  foreach ($file in Get-ChildItem -LiteralPath $root -Recurse -File) {
    # ZIP entry names are URL-like, not Windows filesystem paths.
    $entry = $file.FullName.Substring($root.Length + 1).Replace([char]92, [char]47)
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
      $archive, $file.FullName, $entry, [System.IO.Compression.CompressionLevel]::Optimal
    ) | Out-Null
    $count++
  }
  Write-Output "Packaged $count public assets with portable ZIP entry names."
} finally {
  $archive.Dispose()
}
