export type GalleryCategory = {
	id: string;
	label: string;
	images: string[];
};

export type GalleryManifest = {
	categories: GalleryCategory[];
	allImages: string[];
};
