import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { CATEGORY_LABELS, CATEGORY_ORDER } from './constants';
import type { StampeCategory, StampeManifest } from './types';

const STAMPE_ROOT = 'static/stampe';
const IMAGE_EXT = /\.(jpe?g|png|webp)$/i;

function listImages(categoryId: string, cwd: string): string[] {
	const dir = join(cwd, STAMPE_ROOT, categoryId);
	if (!existsSync(dir)) return [];

	return readdirSync(dir)
		.filter((file) => IMAGE_EXT.test(file))
		.sort((a, b) => a.localeCompare(b))
		.map((file) => `/stampe/${categoryId}/${file}`);
}

export function buildStampeManifest(cwd = process.cwd()): StampeManifest {
	const allImages = listImages('tutte', cwd);

	const categories = (CATEGORY_ORDER as readonly string[])
		.map((id) => {
			const images = listImages(id, cwd);
			if (images.length === 0) return null;

			return {
				id,
				label: CATEGORY_LABELS[id] ?? id,
				images
			} satisfies StampeCategory;
		})
		.filter((category): category is StampeCategory => category !== null);

	return { categories, allImages };
}

