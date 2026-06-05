import type { OptimizedImage } from '$lib/media/optimized-image';
import { CATEGORY_LABELS, CATEGORY_ORDER } from './constants';
import type { GalleryCategory, GalleryManifest } from './types';

const fullImageModules = import.meta.glob('/src/lib/content/gallery/**/*.JPG', {
	eager: true,
	query: {
		w: '1400',
		format: 'webp',
		quality: '82'
	},
	import: 'default'
}) as Record<string, string>;

const thumbImageModules = import.meta.glob('/src/lib/content/gallery/**/*.JPG', {
	eager: true,
	query: {
		w: '640',
		format: 'webp',
		quality: '75'
	},
	import: 'default'
}) as Record<string, string>;

const IMAGE_EXT = /\.jpe?g$/i;
const CATEGORY_SEGMENT = /\/gallery\/([^/]+)\//;

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

export function buildGalleryManifest(): GalleryManifest {
	const allImages = listImages('tutte');

	const categories = (CATEGORY_ORDER as readonly string[])
		.map((id) => {
			const images = listImages(id);
			if (images.length === 0) return null;

			return {
				id,
				label: CATEGORY_LABELS[id] ?? id,
				images
			} satisfies GalleryCategory;
		})
		.filter((category): category is GalleryCategory => category !== null);

	return { categories, allImages };
}
