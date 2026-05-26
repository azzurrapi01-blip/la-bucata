import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { CATEGORY_LABELS, CATEGORY_ORDER } from './constants';
import type { StampeCategory, StampeManifest } from './types';

const STAMPE_ROOT = 'static/stampe';
const IMAGE_EXT = /\.(jpe?g|png|webp)$/i;

function joinBaseUrl(basePath: string, urlPath: string): string {
	const normalizedBase = basePath.replace(/\/$/, '');
	if (!normalizedBase) return urlPath;

	// `urlPath` is always absolute (starts with `/`) for our usage below.
	return `${normalizedBase}${urlPath}`;
}

function listImages(categoryId: string, cwd: string, basePath: string): string[] {
	const dir = join(cwd, STAMPE_ROOT, categoryId);
	if (!existsSync(dir)) return [];

	return readdirSync(dir)
		.filter((file) => IMAGE_EXT.test(file))
		.sort((a, b) => a.localeCompare(b))
		.map((file) => joinBaseUrl(basePath, `/stampe/${categoryId}/${file}`));
}

export function buildStampeManifest(cwd = process.cwd(), basePath = ''): StampeManifest {
	const allImages = listImages('tutte', cwd, basePath);

	const categories = (CATEGORY_ORDER as readonly string[])
		.map((id) => {
			const images = listImages(id, cwd, basePath);
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

