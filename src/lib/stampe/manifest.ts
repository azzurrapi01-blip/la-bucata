import { CATEGORY_LABELS, CATEGORY_ORDER } from './constants';
import type { StampeCategory, StampeManifest } from './types';

const imageModules = import.meta.glob('/src/lib/content/stampe/**/*.{jpg,jpeg,png,webp}', {
	eager: true,
	query: '?url',
	import: 'default'
}) as Record<string, string>;

const IMAGE_EXT = /\.(jpe?g|png|webp)$/i;
const CATEGORY_SEGMENT = /\/stampe\/([^/]+)\//;

function categoryIdFromPath(path: string): string | null {
	return path.match(CATEGORY_SEGMENT)?.[1] ?? null;
}

function listImages(categoryId: string): string[] {
	return Object.entries(imageModules)
		.filter(([path]) => IMAGE_EXT.test(path) && categoryIdFromPath(path) === categoryId)
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([, url]) => url);
}

export function buildStampeManifest(): StampeManifest {
	const allImages = listImages('tutte');

	const categories = (CATEGORY_ORDER as readonly string[])
		.map((id) => {
			const images = listImages(id);
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
