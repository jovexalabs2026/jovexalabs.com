Add-Type -AssemblyName System.Drawing

$pub = 'E:\Jovexa Labs Website\public'
$appIcon = [System.Drawing.Bitmap]::FromFile((Join-Path $pub 'brand\app-icon.png'))
$banner = [System.Drawing.Bitmap]::FromFile((Join-Path $pub 'brand\banner.png'))
$navy = [System.Drawing.Color]::FromArgb(5, 6, 15)

function Resize-Icon([int]$size, [string]$file) {
  $bmp = New-Object System.Drawing.Bitmap($size, $size)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = 'AntiAlias'
  $g.InterpolationMode = 'HighQualityBicubic'
  $g.PixelOffsetMode = 'HighQuality'
  $g.Clear([System.Drawing.Color]::Transparent)
  $g.DrawImage($appIcon, 0, 0, $size, $size)
  $g.Dispose()
  $bmp.Save((Join-Path $pub $file), [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  Write-Host "created $file ($size x $size)"
}

Resize-Icon 16 'favicon-16.png'
Resize-Icon 32 'favicon-32.png'
Resize-Icon 180 'apple-touch-icon.png'
Resize-Icon 192 'icon-192.png'
Resize-Icon 512 'icon-512.png'

# ---- Open Graph image from the official banner ----
$w = 1200; $h = 630
$bmp = New-Object System.Drawing.Bitmap($w, $h)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = 'AntiAlias'
$g.InterpolationMode = 'HighQualityBicubic'
$g.PixelOffsetMode = 'HighQuality'
$g.TextRenderingHint = 'AntiAliasGridFit'
$g.Clear($navy)

# banner centered
$bw = 1080
$bh = [int]($banner.Height * ($bw / $banner.Width))
$bx = [int](($w - $bw) / 2)
$by = [int](($h - $bh) / 2) - 40
$g.DrawImage($banner, $bx, $by, $bw, $bh)

# footer line
$fmt = New-Object System.Drawing.StringFormat
$fmt.Alignment = 'Center'
$muted = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(154, 160, 195))
$white = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(231, 233, 245))
$tagFont = New-Object System.Drawing.Font('Segoe UI', 30, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$urlFont = New-Object System.Drawing.Font('Segoe UI', 34, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$g.DrawString('Apps  |  Games  |  Web Platforms  |  Open Source  |  Developer Tools', $tagFont, $muted, ($w / 2), ($by + $bh + 60), $fmt)
$g.DrawString('jovexalabs.com', $urlFont, $white, ($w / 2), ($by + $bh + 120), $fmt)

$g.Dispose()
$bmp.Save((Join-Path $pub 'og-image.png'), [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$appIcon.Dispose()
$banner.Dispose()
Write-Host 'created og-image.png (1200 x 630)'
