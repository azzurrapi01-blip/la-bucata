import type { OptimizedImage } from '$lib/media/optimized-image';

export type StampeCategory = {
	id: string;
	label: string;
	images: OptimizedImage[];
};

export type StampeManifest = {
	categories: StampeCategory[];
	allImages: OptimizedImage[];
};
