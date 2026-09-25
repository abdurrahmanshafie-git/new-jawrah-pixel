const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

function processLightImage(inputPath, outputPath) {
  const data = fs.readFileSync(inputPath);
  const src = PNG.sync.read(data);
  const dst = new PNG({ width: src.width, height: src.height });

  // For light background removal:
  // The background is pure white / near-white (#FFF, rgb > 240)
  // The content contains dark text and vibrant cyan/purple/magenta particles.
  for (let y = 0; y < src.height; y++) {
    for (let x = 0; x < src.width; x++) {
      const idx = (src.width * y + x) << 2;
      const r = src.data[idx];
      const g = src.data[idx + 1];
      const b = src.data[idx + 2];
      const a = src.data[idx + 3];

      if (a === 0) {
        dst.data[idx] = 0;
        dst.data[idx + 1] = 0;
        dst.data[idx + 2] = 0;
        dst.data[idx + 3] = 0;
        continue;
      }

      // Calculate brightness / distance from pure white (255, 255, 255)
      // Any color deviation indicates ink (particles, text, gradient)
      const diffR = 255 - r;
      const diffG = 255 - g;
      const diffB = 255 - b;
      const maxDiff = Math.max(diffR, diffG, diffB);

      // Thresholds:
      // If difference is very small (near white background), alpha -> 0
      // If difference is significant, calculate alpha cleanly and recover true foreground color
      if (maxDiff < 8) {
        // Pure background
        dst.data[idx] = 0;
        dst.data[idx + 1] = 0;
        dst.data[idx + 2] = 0;
        dst.data[idx + 3] = 0;
      } else if (maxDiff < 35) {
        // Anti-aliased transition edge
        const factor = (maxDiff - 8) / (35 - 8); // 0 to 1
        const alpha = Math.round(factor * 255);
        dst.data[idx] = r;
        dst.data[idx + 1] = g;
        dst.data[idx + 2] = b;
        dst.data[idx + 3] = alpha;
      } else {
        // Solid foreground (text / particle)
        // Recover original saturated color assuming unmultiplied white bg blend: C = (C_observed - (1-alpha)*255) / alpha
        const alpha = 255;
        dst.data[idx] = r;
        dst.data[idx + 1] = g;
        dst.data[idx + 2] = b;
        dst.data[idx + 3] = alpha;
      }
    }
  }

  const buffer = PNG.sync.write(dst);
  fs.writeFileSync(outputPath, buffer);
  console.log(`Processed light logo transparent bg: ${outputPath}`);
}

function processDarkImage(inputPath, outputPath) {
  const data = fs.readFileSync(inputPath);
  const src = PNG.sync.read(data);
  const dst = new PNG({ width: src.width, height: src.height });

  // For dark background removal:
  // Background is pure black or near-black (#000, rgb < 15)
  for (let y = 0; y < src.height; y++) {
    for (let x = 0; x < src.width; x++) {
      const idx = (src.width * y + x) << 2;
      const r = src.data[idx];
      const g = src.data[idx + 1];
      const b = src.data[idx + 2];
      const a = src.data[idx + 3];

      if (a === 0) {
        dst.data[idx] = 0;
        dst.data[idx + 1] = 0;
        dst.data[idx + 2] = 0;
        dst.data[idx + 3] = 0;
        continue;
      }

      // Distance from pure black (0, 0, 0)
      const maxVal = Math.max(r, g, b);

      if (maxVal < 8) {
        // Pure dark background
        dst.data[idx] = 0;
        dst.data[idx + 1] = 0;
        dst.data[idx + 2] = 0;
        dst.data[idx + 3] = 0;
      } else if (maxVal < 35) {
        // Anti-aliased transition edge
        const factor = (maxVal - 8) / (35 - 8);
        const alpha = Math.round(factor * 255);
        dst.data[idx] = r;
        dst.data[idx + 1] = g;
        dst.data[idx + 2] = b;
        dst.data[idx + 3] = alpha;
      } else {
        // Solid foreground
        dst.data[idx] = r;
        dst.data[idx + 1] = g;
        dst.data[idx + 2] = b;
        dst.data[idx + 3] = 255;
      }
    }
  }

  const buffer = PNG.sync.write(dst);
  fs.writeFileSync(outputPath, buffer);
  console.log(`Processed dark logo transparent bg: ${outputPath}`);
}

// Execute on all logo files
const publicDir = path.join(__dirname, '..', 'public', 'assets');
processLightImage(path.join(publicDir, 'logo-white.png'), path.join(publicDir, 'logo-white.png'));
processLightImage(path.join(publicDir, 'logo-navbar-white.png'), path.join(publicDir, 'logo-navbar-white.png'));
processDarkImage(path.join(publicDir, 'logo.png'), path.join(publicDir, 'logo.png'));
processDarkImage(path.join(publicDir, 'logo-navbar.png'), path.join(publicDir, 'logo-navbar.png'));

// Also copy to dist if dist/assets exists
const distDir = path.join(__dirname, '..', 'dist', 'assets');
if (fs.existsSync(distDir)) {
  ['logo-white.png', 'logo-navbar-white.png', 'logo.png', 'logo-navbar.png'].forEach(file => {
    fs.copyFileSync(path.join(publicDir, file), path.join(distDir, file));
    console.log(`Synced to dist: ${file}`);
  });
}
