import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const assetsRoot = path.resolve('public/assets');
const outputRoot = path.join(assetsRoot, 'optimized');
const logoFiles = ['logo.png', 'logo-white.png', 'logo-navbar.png', 'logo-navbar-white.png'];

async function main() {
  await fs.mkdir(outputRoot, { recursive: true });
  let originalBytes = 0;
  let optimizedBytes = 0;

  for (const fileName of logoFiles) {
    const sourcePath = path.join(assetsRoot, fileName);
    const destinationPath = path.join(outputRoot, fileName.replace(/\.png$/i, '.webp'));
    const original = await fs.stat(sourcePath);
    await sharp(sourcePath, { failOn: 'none' })
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 84, alphaQuality: 90, effort: 5, smartSubsample: true })
      .toFile(destinationPath);
    const optimized = await fs.stat(destinationPath);
    originalBytes += original.size;
    optimizedBytes += optimized.size;
    console.log(`${fileName}: ${(original.size / 1024).toFixed(0)} KiB -> ${(optimized.size / 1024).toFixed(0)} KiB`);
  }

  const faviconPath = path.join(outputRoot, 'logo-icon.png');
  await sharp(path.join(assetsRoot, 'logo.png'), { failOn: 'none' })
    .resize({ width: 280, withoutEnlargement: true })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(faviconPath);

  const reduction = originalBytes ? (1 - optimizedBytes / originalBytes) * 100 : 0;
  console.log(`Optimized ${logoFiles.length} logo variants: ${(originalBytes / 1024 / 1024).toFixed(2)} MiB -> ${(optimizedBytes / 1024 / 1024).toFixed(2)} MiB (${reduction.toFixed(1)}% smaller).`);
}

main().catch((error) => {
  console.error('Image optimization failed:', error);
  process.exitCode = 1;
});
