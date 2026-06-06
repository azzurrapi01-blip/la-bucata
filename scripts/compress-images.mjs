import { readdir, stat, unlink, rename } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve('src/lib');
const SKIP_DIRS = new Set(['tutte']);
const IMAGE_EXT = /\.(jpe?g|png|webp)$/i;
const JPEG_EXT = /\.jpe?g$/i;

const MAX_DIMENSION = 2048;
const JPEG_QUALITY = 82;
const PNG_QUALITY = 80;

async function walk(dir) {
	const entries = await readdir(dir, { withFileTypes: true });
	const files = [];

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			if (SKIP_DIRS.has(entry.name)) continue;
			files.push(...(await walk(fullPath)));
			continue;
		}

		if (IMAGE_EXT.test(entry.name)) {
			files.push(fullPath);
		}
	}

	return files;
}

async function compressImage(filePath) {
	const before = (await stat(filePath)).size;
	const tempPath = `${filePath}.tmp`;

	let pipeline = sharp(filePath, { failOn: 'none' }).rotate();

	const metadata = await pipeline.metadata();
	pipeline = sharp(filePath, { failOn: 'none' }).rotate();

	if ((metadata.width ?? 0) > MAX_DIMENSION || (metadata.height ?? 0) > MAX_DIMENSION) {
		pipeline = pipeline.resize({
			width: MAX_DIMENSION,
			height: MAX_DIMENSION,
			fit: 'inside',
			withoutEnlargement: true
		});
	}

	if (JPEG_EXT.test(filePath) || metadata.format === 'jpeg') {
		await pipeline
			.jpeg({ quality: JPEG_QUALITY, mozjpeg: true, progressive: true })
			.toFile(tempPath);
	} else if (metadata.format === 'png') {
		await pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9, effort: 10 }).toFile(tempPath);
	} else if (metadata.format === 'webp') {
		await pipeline.webp({ quality: JPEG_QUALITY, effort: 6 }).toFile(tempPath);
	} else {
		return { filePath, before, after: before, skipped: true };
	}

	const after = (await stat(tempPath)).size;

	if (after >= before) {
		await unlink(tempPath);
		return { filePath, before, after: before, skipped: true };
	}

	await unlink(filePath);
	await rename(tempPath, filePath);

	return { filePath, before, after, skipped: false };
}

const contentFiles = await walk(path.join(ROOT, 'content'));
const assetFiles = await walk(path.join(ROOT, 'assets'));
const allFiles = [...contentFiles, ...assetFiles];

console.log(`Compressing ${allFiles.length} images…`);

let saved = 0;
let processed = 0;

for (const filePath of allFiles) {
	const result = await compressImage(filePath);
	processed += 1;

	if (!result.skipped) {
		saved += result.before - result.after;
	}

	if (processed % 20 === 0 || processed === allFiles.length) {
		console.log(
			`  ${processed}/${allFiles.length} — saved ${(saved / 1024 / 1024).toFixed(1)} MB so far`
		);
	}
}

console.log(
	`Done. ${processed} files processed, ${(saved / 1024 / 1024).toFixed(1)} MB saved.`
);
