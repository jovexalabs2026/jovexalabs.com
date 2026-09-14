Add-Type -AssemblyName System.Drawing

Add-Type -ReferencedAssemblies System.Drawing @'
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public static class TrimHelper {
  // Returns [minX, minY, maxX, maxY] of non-background pixels (background = transparent or near-white).
  public static int[] GetBounds(Bitmap bmp) {
    var rect = new Rectangle(0, 0, bmp.Width, bmp.Height);
    var bd = bmp.LockBits(rect, ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
    int bytes = Math.Abs(bd.Stride) * bmp.Height;
    byte[] buf = new byte[bytes];
    Marshal.Copy(bd.Scan0, buf, 0, bytes);
    bmp.UnlockBits(bd);
    int minX = bmp.Width, minY = bmp.Height, maxX = -1, maxY = -1;
    for (int y = 0; y < bmp.Height; y++) {
      int row = y * bd.Stride;
      for (int x = 0; x < bmp.Width; x++) {
        int i = row + x * 4;
        byte b = buf[i], g = buf[i + 1], r = buf[i + 2], a = buf[i + 3];
        bool bg = a < 16 || (r > 244 && g > 244 && b > 244);
        if (!bg) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    return new int[] { minX, minY, maxX, maxY };
  }
}
'@

$src = 'E:\Jovexa Labs Website\Jovexa_Labs_Website_Assets\jovexa-labs-brand-assets.png'
$outDir = 'E:\Jovexa Labs Website\public\brand'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$sheet = [System.Drawing.Bitmap]::FromFile($src)
Write-Host "sheet: $($sheet.Width) x $($sheet.Height)"

function Save-Crop([float]$fx1, [float]$fy1, [float]$fx2, [float]$fy2, [string]$name) {
  $x = [int]($fx1 * $sheet.Width); $y = [int]($fy1 * $sheet.Height)
  $w = [int](($fx2 - $fx1) * $sheet.Width); $h = [int](($fy2 - $fy1) * $sheet.Height)
  $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
  $crop = $sheet.Clone($rect, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $b = [TrimHelper]::GetBounds($crop)
  if ($b[2] -lt 0) { Write-Host "WARN ${name}: empty crop"; $crop.Dispose(); return }
  $pad = 4
  $tx = [Math]::Max(0, $b[0] - $pad); $ty = [Math]::Max(0, $b[1] - $pad)
  $tw = [Math]::Min($crop.Width - $tx, $b[2] - $b[0] + 1 + 2 * $pad)
  $th = [Math]::Min($crop.Height - $ty, $b[3] - $b[1] + 1 + 2 * $pad)
  $trimRect = New-Object System.Drawing.Rectangle($tx, $ty, $tw, $th)
  $trimmed = $crop.Clone($trimRect, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $trimmed.Save((Join-Path $outDir $name), [System.Drawing.Imaging.ImageFormat]::Png)
  Write-Host "saved $name ($tw x $th)"
  $trimmed.Dispose(); $crop.Dispose()
}

# fractions measured from the asset sheet layout
Save-Crop 0.00  0.00 0.183 0.595 'logo-mark.png'       # big J mark alone
Save-Crop 0.00  0.00 0.56  0.65 'logo-full.png'        # J + JOVEXA LABS + tagline
Save-Crop 0.58  0.00 0.866 0.35 'logo-horizontal.png'  # compact horizontal lockup
Save-Crop 0.00  0.63 0.45  1.00 'banner.png'           # dark banner with earth
Save-Crop 0.585 0.36 0.705 0.70 'app-icon.png'         # largest rounded-square app icon

$sheet.Dispose()
Write-Host 'done'
