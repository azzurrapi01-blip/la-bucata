import { buildAudioManifest } from '$lib/audio/manifest';
import { buildGalleryManifest } from '$lib/gallery/manifest';
import { buildRaccoltaManifest } from '$lib/raccolta/manifest';
import { buildStampeManifest } from '$lib/stampe/manifest';
import type { PageLoad } from './$types';

export const load = (() => {
	const { recordings: audioRecordings } = buildAudioManifest();
	const { allImages: galleryAllImages } = buildGalleryManifest();
	const { allImages: stampeAllImages } = buildStampeManifest();
	const { allItems: raccoltaAllItems } = buildRaccoltaManifest();

	return { audioRecordings, galleryAllImages, stampeAllImages, raccoltaAllItems };
}) satisfies PageLoad;
