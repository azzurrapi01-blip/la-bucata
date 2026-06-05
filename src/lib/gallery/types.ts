import type { OptimizedImage } from '$lib/media/optimized-image';

export type GalleryCategory = {
	id: string;
	label: string;
	images: OptimizedImage[];
};

export type GalleryManifest = {
	categories: GalleryCategory[];
	allImages: OptimizedImage[];
};
