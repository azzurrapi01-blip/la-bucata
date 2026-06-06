export type RaccoltaImage = {
	src: string;
	thumb: string;
	caption: string;
};

export type RaccoltaMonth = {
	id: string;
	label: string;
	images: RaccoltaImage[];
};

export type RaccoltaCategory = {
	id: string;
	label: string;
};

export type RaccoltaManifest = {
	months: RaccoltaMonth[];
	categories: RaccoltaCategory[];
	allItems: RaccoltaImage[];
};
