import sharp from 'sharp';
import { readdir, rename, unlink } from 'fs/promises';
import path from 'path';

const MAX_EDGE = 2400;
const QUALITY = 85;
const ROOTS = ['src/lib/content/gallery', 'src/lib/content/raccolta'];

async function* walk(dir) {
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		const filePath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			yield* walk(filePath);
		} else if (/\.jpe?g$/i.test(entry.name)) {
			yield filePath;
		}
	}
}

function lowercaseJpegPath(file) {
	const dir = path.dirname(file);
	const base = path.basename(file).replace(/\.jpe?g$/i, '.jpg');
	return path.join(dir, base);
}

for (const root of ROOTS) {
	for await (const file of walk(root)) {
		const targetPath = lowercaseJpegPath(file);
		const needsRename = file !== targetPath;
		const tempPath = `${file}.normalize-tmp.jpg`;

		let image = sharp(file);
		const meta = await image.metadata();
		if (!meta.width || !meta.height) continue;

		const max = Math.max(meta.width, meta.height);
		if (max > MAX_EDGE) {
			image = image.resize({
				width: meta.width >= meta.height ? MAX_EDGE : undefined,
				height: meta.height > meta.width ? MAX_EDGE : undefined,
				withoutEnlargement: true
			});
		}

		const buf = await image.jpeg({ quality: QUALITY }).toBuffer();
		await sharp(buf).toFile(tempPath);

		if (needsRename) {
			await unlink(file);
			await rename(tempPath, targetPath);
			console.log('normalized', file, '->', targetPath);
		} else {
			await rename(tempPath, file);
			if (max > MAX_EDGE) {
				console.log('resized', file, `(${max}px -> <=${MAX_EDGE}px)`);
			}
		}
	}
}
