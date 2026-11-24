/*
  Builds favicon.ico and apple-touch-icon.png from assets/favicon.svg.
  Needs no npm packages: uses the built-in canvas-free PNG-in-ICO writer
  plus Edge/Chrome headless screenshots of a tiny HTML render.

  Run:  node tools/make-icons.mjs
*/
import { spawnSync } from 'node:child_process';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'assets');
const imgDir = join(outDir, 'img');
mkdirSync(imgDir, { recursive: true });

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const browser = existsSync(edge) ? edge : chrome;
if (!existsSync(browser)) {
  console.error('No Edge or Chrome found. Install one, then re-run.');
  process.exit(1);
}

function shot(htmlPath, pngPath, w, h) {
  const args = [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    `--window-size=${w},${h}`,
    `--screenshot=${pngPath}`,
    `--virtual-time-budget=3000`,
    `file:///${htmlPath.replace(/\\/g, '/')}`,
  ];
  const r = spawnSync(browser, args, { encoding: 'utf8' });
  if (r.status !== 0) {
    console.error(r.stderr || r.stdout || 'screenshot failed');
    process.exit(1);
  }
}

/* ---------- favicon render page (180px for apple-touch, we also use 32) ---------- */
const svg = readFileSync(join(outDir, 'favicon.svg'), 'utf8');
const renderHtml = join(tmpdir(), 'portfolio-favicon-render.html');
writeFileSync(renderHtml, `<!doctype html><html><head><style>
  html,body{margin:0;background:transparent;width:180px;height:180px}
  svg{width:180px;height:180px;display:block}
</style></head><body>${svg}</body></html>`);

const applePng = join(outDir, 'apple-touch-icon.png');
const favPng32 = join(tmpdir(), 'portfolio-favicon-32.png');
const ogHtml = join(root, 'tools', 'og-image.html');
const ogPng = join(imgDir, 'og-image.png');

shot(renderHtml, applePng, 180, 180);
shot(ogHtml, ogPng, 1200, 630);

/* Resize apple to 32 for ICO via PowerShell System.Drawing */
const ps = `
Add-Type -AssemblyName System.Drawing
$src = [System.Drawing.Image]::FromFile('${applePng.replace(/'/g, "''")}')
$bmp = New-Object System.Drawing.Bitmap 32, 32
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.Clear([System.Drawing.Color]::Transparent)
$g.DrawImage($src, 0, 0, 32, 32)
$bmp.Save('${favPng32.replace(/'/g, "''")}', [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bmp.Dispose(); $src.Dispose()
# Crop OG if browser window was larger than 1200x630
$og = [System.Drawing.Image]::FromFile('${ogPng.replace(/'/g, "''")}')
if ($og.Width -ne 1200 -or $og.Height -ne 630) {
  $cropped = New-Object System.Drawing.Bitmap 1200, 630
  $cg = [System.Drawing.Graphics]::FromImage($cropped)
  $cg.DrawImage($og, 0, 0, 1200, 630)
  $cg.Dispose(); $og.Dispose()
  $cropped.Save('${ogPng.replace(/'/g, "''")}', [System.Drawing.Imaging.ImageFormat]::Png)
  $cropped.Dispose()
} else { $og.Dispose() }
`;
const psFile = join(tmpdir(), 'portfolio-resize.ps1');
writeFileSync(psFile, ps);
const psr = spawnSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', psFile], { encoding: 'utf8' });
if (psr.status !== 0) {
  console.error(psr.stderr || psr.stdout);
  process.exit(1);
}

/* PNG-in-ICO: one 32x32 PNG embedded in an ICO container */
function pngToIco(pngBuf) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type = icon
  header.writeUInt16LE(1, 4); // count
  const entry = Buffer.alloc(16);
  entry[0] = 32; // width
  entry[1] = 32; // height
  entry[2] = 0;  // palette
  entry[3] = 0;
  entry.writeUInt16LE(1, 4);  // planes
  entry.writeUInt16LE(32, 6); // bit count
  entry.writeUInt32LE(pngBuf.length, 8);
  entry.writeUInt32LE(22, 12); // offset of PNG data
  return Buffer.concat([header, entry, pngBuf]);
}

const ico = pngToIco(readFileSync(favPng32));
writeFileSync(join(root, 'favicon.ico'), ico);

console.log('Wrote assets/apple-touch-icon.png');
console.log('Wrote favicon.ico');
console.log('Wrote assets/img/og-image.png');
