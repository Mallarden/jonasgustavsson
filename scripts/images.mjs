// Builds responsive derivatives of photos/*.jpg into public/img and writes src/images.json.
// Originals in photos/ are never modified. Run: npm run images
import sharp from 'sharp';
import { readdir, mkdir, writeFile } from 'node:fs/promises';

const SRC = 'photos';
const OUT = 'public/img';
const WIDTHS = [480, 960, 1600]; // capped at native width, never upscaled

await mkdir(OUT, { recursive: true });
const files = (await readdir(SRC)).filter((f) => /\.jpe?g$/i.test(f)).sort();
const manifest = {};

for (const file of files) {
  const slug = file
    .replace(/^imgi_(\d+)_/, '$1-')
    .replace(/\.jpe?g$/i, '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const img = sharp(`${SRC}/${file}`).rotate();
  const { width, height } = await img.metadata();
  const { dominant: d } = await img.stats();
  const widths = [...new Set(WIDTHS.map((w) => Math.min(w, width)))];
  for (const w of widths) {
    const r = img.clone().resize({ width: w });
    await r.clone().avif({ quality: 58, effort: 5 }).toFile(`${OUT}/${slug}-${w}.avif`);
    await r.clone().webp({ quality: 80 }).toFile(`${OUT}/${slug}-${w}.webp`);
  }
  manifest[file] = { slug, w: width, h: height, widths, color: `rgb(${d.r},${d.g},${d.b})` };
  console.log(slug, width, height);
}

await writeFile('src/images.json', JSON.stringify(manifest, null, 1));
console.log(`${files.length} images`);
