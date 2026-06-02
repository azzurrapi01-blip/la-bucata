import {
	coordinatesToGoogleMapsEmbedRoute,
	coordinatesToGoogleMapsRouteLink,
	formatCoordinateLabel,
	parseInfoMarkdown
} from './parse-info';
import type { PercorsoManifest, PercorsoStage } from './types';

const infoModules = import.meta.glob('/src/lib/content/percorso/tappa*/info.md', {
	eager: true,
	query: '?raw',
	import: 'default'
}) as Record<string, string>;

const TAPPA_SEGMENT = /\/percorso\/(tappa\d+)\//;

function tappaIdFromPath(path: string): string | null {
	return path.match(TAPPA_SEGMENT)?.[1] ?? null;
}

function tappaNumberFromId(id: string): number {
	return Number.parseInt(id.replace('tappa', ''), 10);
}

function buildStage(tappaId: string, rawInfo: string): PercorsoStage {
	const { frontmatter, body } = parseInfoMarkdown(rawInfo);
	const number = tappaNumberFromId(tappaId);

	return {
		id: tappaId,
		number,
		luogo: frontmatter.luogo,
		coordinate: frontmatter.coordinate,
		coordinateLabel: formatCoordinateLabel(frontmatter.coordinate),
		body,
		mapEmbedSrc: '',
		mapLink: ''
	};
}

export function buildPercorsoManifest(): PercorsoManifest {
	const baseStages = Object.entries(infoModules)
		.map(([path, rawInfo]) => {
			const tappaId = tappaIdFromPath(path);
			if (!tappaId) return null;
			return buildStage(tappaId, rawInfo);
		})
		.filter((stage): stage is PercorsoStage => stage !== null)
		.sort((a, b) => a.number - b.number);

	const stages = baseStages.map((stage) => {
		const partialRouteCoordinates = baseStages
			.filter((candidate) => candidate.number <= stage.number)
			.map((candidate) => candidate.coordinate);

		return {
			...stage,
			mapEmbedSrc: coordinatesToGoogleMapsEmbedRoute(partialRouteCoordinates),
			mapLink: coordinatesToGoogleMapsRouteLink(partialRouteCoordinates)
		};
	});

	return { stages };
}
