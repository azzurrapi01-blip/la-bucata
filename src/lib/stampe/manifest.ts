import type { OptimizedImage } from '$lib/media/optimized-image';
import { CATEGORY_LABELS, CATEGORY_ORDER } from './constants';
import type { StampeCategory, StampeManifest } from './types';

const fullImageModules = import.meta.glob(
	'/src/lib/content/stampe/{foglie,felci,fiori,erbe,altre}/**/*.{jpg,jpeg,png,webp}',
	{
	eager: true,
	query: {
		w: '1200',
		format: 'webp',
		quality: '82'
	},
	import: 'default'
}) as Record<string, string>;

const thumbImageModules = import.meta.glob(
	'/src/lib/content/stampe/{foglie,felci,fiori,erbe,altre}/**/*.{jpg,jpeg,png,webp}',
	{
	eager: true,
	query: {
		w: '560',
		format: 'webp',
		quality: '78'
	},
	import: 'default'
}) as Record<string, string>;

const IMAGE_EXT = /\.(jpe?g|png|webp)$/i;
const CATEGORY_SEGMENT = /\/stampe\/([^/]+)\//;

function categoryIdFromPath(path: string): string | null {
	return path.match(CATEGORY_SEGMENT)?.[1] ?? null;
}

function listImages(categoryId: string): OptimizedImage[] {
	return Object.keys(fullImageModules)
		.filter((path) => IMAGE_EXT.test(path) && categoryIdFromPath(path) === categoryId)
		.sort((a, b) => a.localeCompare(b))
		.map((path) => ({
			src: fullImageModules[path],
			thumb: thumbImageModules[path]
		}));
}

export function buildStampeManifest(): StampeManifest {
	const sourceCategories = (CATEGORY_ORDER as readonly string[])
		.filter((id) => id !== 'tutte')
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

	const allImages = sourceCategories.flatMap((category) => category.images);

	const categories: StampeCategory[] = [
		{
			id: 'tutte',
			label: CATEGORY_LABELS.tutte,
			images: allImages
		},
		...sourceCategories
	];

	return { categories, allImages };
}
