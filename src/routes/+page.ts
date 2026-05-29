import { buildGalleryManifest } from '$lib/gallery/manifest';
import { buildStampeManifest } from '$lib/stampe/manifest';
import type { PageLoad } from './$types';

export const load = (() => {
	const { allImages: galleryAllImages } = buildGalleryManifest();
	const { allImages: stampeAllImages } = buildStampeManifest();

	return { galleryAllImages, stampeAllImages };
}) satisfies PageLoad;
