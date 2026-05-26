export type StampeCategory = {
	id: string;
	label: string;
	images: string[];
};

export type StampeManifest = {
	categories: StampeCategory[];
	allImages: string[];
};
