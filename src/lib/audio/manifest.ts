import { formatCoordinateLabel, parseInfoMarkdown } from './parse-info';
import type { AudioManifest, AudioRecording } from './types';

const infoModules = import.meta.glob('/src/lib/content/audio/tappa-*/info.md', {
	eager: true,
	query: '?raw',
	import: 'default'
}) as Record<string, string>;

const audioModules = import.meta.glob('/src/lib/content/audio/**/*.{wav,WAV}', {
	eager: true,
	query: '?url',
	import: 'default'
}) as Record<string, string>;

const imageModules = import.meta.glob('/src/lib/content/audio/**/*.{png,PNG}', {
	eager: true,
	query: '?url',
	import: 'default'
}) as Record<string, string>;

const TAPPA_SEGMENT = /\/audio\/(tappa-\d+)\//;
const AUDIO_EXT = /\.wav$/i;
const IMAGE_EXT = /\.png$/i;

function tappaIdFromPath(path: string): string | null {
	return path.match(TAPPA_SEGMENT)?.[1] ?? null;
}

function tappaNumberFromId(id: string): number {
	return Number.parseInt(id.replace('tappa-', ''), 10);
}

function assetForTappa(
	modules: Record<string, string>,
	tappaId: string,
	ext: RegExp
): string | null {
	const entry = Object.entries(modules).find(
		([path]) => ext.test(path) && tappaIdFromPath(path) === tappaId
	);

	return entry?.[1] ?? null;
}

function buildRecording(tappaId: string, rawInfo: string): AudioRecording | null {
	const audioSrc = assetForTappa(audioModules, tappaId, AUDIO_EXT);
	const spectrogramSrc = assetForTappa(imageModules, tappaId, IMAGE_EXT);
	if (!audioSrc || !spectrogramSrc) return null;

	const { frontmatter, body } = parseInfoMarkdown(rawInfo);
	const number = tappaNumberFromId(tappaId);

	return {
		id: tappaId,
		number,
		luogo: frontmatter.luogo,
		data: frontmatter.data,
		coordinate: frontmatter.coordinate,
		coordinateLabel: formatCoordinateLabel(frontmatter.coordinate),
		descrizioneBreve: frontmatter.descrizione_breve,
		percentuale: frontmatter.percentuale,
		body,
		audioSrc,
		spectrogramSrc
	};
}

export function buildAudioManifest(): AudioManifest {
	const recordings = Object.entries(infoModules)
		.map(([path, rawInfo]) => {
			const tappaId = tappaIdFromPath(path);
			if (!tappaId) return null;

			return buildRecording(tappaId, rawInfo);
		})
		.filter((recording): recording is AudioRecording => recording !== null)
		.sort((a, b) => a.percentuale - b.percentuale || a.number - b.number);

	return { recordings };
}
