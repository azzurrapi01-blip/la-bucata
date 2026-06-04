import type { EnhancedImageSrc } from '$lib/images/types';

export type AudioRecording = {
	id: string;
	number: number;
	luogo: string;
	data: string;
	coordinate: string;
	coordinateLabel: string;
	descrizioneBreve: string;
	percentuale: number;
	body: string;
	audioSrc: string;
	spectrogramSrc: EnhancedImageSrc;
};

export type AudioManifest = {
	recordings: AudioRecording[];
};
