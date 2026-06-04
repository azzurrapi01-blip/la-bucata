import type { EnhancedImageSrc } from '$lib/images/types';

export type GalleryCategory = {
	id: string;
	label: string;
	images: EnhancedImageSrc[];
};

export type GalleryManifest = {
	categories: GalleryCategory[];
	allImages: EnhancedImageSrc[];
};
