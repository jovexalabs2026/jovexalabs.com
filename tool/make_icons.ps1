Add-Type -AssemblyName System.Drawing

$out = 'e:\Jovexa Labs Website\public'
$blue = [System.Drawing.Color]::FromArgb(59, 130, 246)
$cyan = [System.Drawing.Color]::FromArgb(34, 211, 238)
$navy = [System.Drawing.Color]::FromArgb(5, 6, 15)

function New-RoundedRectPath([float]$x, [float]$y, [float]$w, [float]$h, [float]$r) {
  $p = New-Object System.Drawing.Drawing2D.GraphicsPath
  $d = $r * 2
  $p.AddArc($x, $y, $d, $d, 180, 90)
  $p.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
  $p.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
  $p.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
  $p.CloseFigure()
  return $p
}

function New-Icon([int]$size, [string]$file) {
  $bmp = New-Object System.Drawing.Bitmap($size, $size)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = 'AntiAlias'
  $g.TextRenderingHint = 'AntiAliasGridFit'
  $g.Clear([System.Drawing.Color]::Transparent)

  $rect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
  $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $blue, $cyan, 45)
  $radius = [Math]::Max(2, $size * 0.22)
  $path = New-RoundedRectPath 0 0 $size $size $radius
  $g.FillPath($brush, $path)

  $fontSize = [float]($size * 0.62)
  $font = New-Object System.Drawing.Font('Segoe UI', $fontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $textBrush = New-Object System.Drawing.SolidBrush($navy)
  $fmt = New-Object System.Drawing.StringFormat
  $fmt.Alignment = 'Center'
  $fmt.LineAlignment = 'Center'
  $textRect = New-Object System.Drawing.RectangleF(0, (-$size * 0.03), $size, $size)
  $g.DrawString('J', $font, $textBrush, $textRect, $fmt)

  $g.Dispose()
  $bmp.Save((Join-Path $out $file), [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  Write-Host "created $file ($size x $size)"
}

New-Icon 16 'favicon-16.png'
New-Icon 32 'favicon-32.png'
New-Icon 180 'apple-touch-icon.png'
New-Icon 192 'icon-192.png'
New-Icon 512 'icon-512.png'

# ---- Open Graph social image (1200x630) ----
$w = 1200; $h = 630
$bmp = New-Object System.Drawing.Bitmap($w, $h)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = 'AntiAlias'
$g.TextRenderingHint = 'AntiAliasGridFit'
$g.Clear($navy)

# subtle gradient glow band
$bandRect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
$glow = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
  $bandRect,
  [System.Drawing.Color]::FromArgb(40, 59, 130, 246),
  [System.Drawing.Color]::FromArgb(0, 5, 6, 15), 90)
$g.FillRectangle($glow, $bandRect)

# logo mark
$markSize = 140
$markX = 90; $markY = 150
$markRect = New-Object System.Drawing.Rectangle($markX, $markY, $markSize, $markSize)
$markBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($markRect, $blue, $cyan, 45)
$markPath = New-RoundedRectPath $markX $markY $markSize $markSize 30
$g.FillPath($markBrush, $markPath)
$jFont = New-Object System.Drawing.Font('Segoe UI', 88, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$navyBrush = New-Object System.Drawing.SolidBrush($navy)
$fmt = New-Object System.Drawing.StringFormat
$fmt.Alignment = 'Center'
$fmt.LineAlignment = 'Center'
$jRect = New-Object System.Drawing.RectangleF($markX, ($markY - 5), $markSize, $markSize)
$g.DrawString('J', $jFont, $navyBrush, $jRect, $fmt)

# wordmark
$white = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(231, 233, 245))
$muted = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(154, 160, 195))
$titleFont = New-Object System.Drawing.Font('Segoe UI', 86, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$g.DrawString('JOVEXA Labs', $titleFont, $white, 260, 175)
$tagFont = New-Object System.Drawing.Font('Segoe UI', 38, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$g.DrawString('Software built to turn ideas into impact.', $tagFont, $muted, 95, 360)
$subFont = New-Object System.Drawing.Font('Segoe UI', 28, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$cyanBrush = New-Object System.Drawing.SolidBrush($cyan)
$dot = [string][char]0x00B7
$areasText = ('Apps  {0}  Games  {0}  Web Platforms  {0}  Open Source  {0}  Developer Tools' -f $dot)
$g.DrawString($areasText, $subFont, $cyanBrush, 97, 430)
$urlFont = New-Object System.Drawing.Font('Segoe UI', 26, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$g.DrawString('jovexalabs.com', $urlFont, $white, 97, 540)

$g.Dispose()
$bmp.Save((Join-Path $out 'og-image.png'), [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Host 'created og-image.png (1200 x 630)'
