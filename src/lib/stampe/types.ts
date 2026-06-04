import type { EnhancedImageSrc } from '$lib/images/types';

export type StampeCategory = {
	id: string;
	label: string;
	images: EnhancedImageSrc[];
};

export type StampeManifest = {
	categories: StampeCategory[];
	allImages: EnhancedImageSrc[];
};
