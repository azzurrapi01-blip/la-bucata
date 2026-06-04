export type PercorsoStage = {
	id: string;
	number: number;
	luogo: string;
	coordinate: string;
	coordinateLabel: string;
	body: string;
	mapEmbedSrc: string;
	mapLink: string;
};

export type PercorsoManifest = {
	stages: PercorsoStage[];
};
