export type PercorsoInfoFrontmatter = {
	coordinate: string;
	luogo: string;
};

export function parseInfoMarkdown(raw: string): { frontmatter: PercorsoInfoFrontmatter; body: string } {
	const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
	if (!match) {
		throw new Error('info.md must start with YAML frontmatter');
	}

	const frontmatter = parseFrontmatter(match[1]);
	const body = match[2].trim();

	return { frontmatter, body };
}

function parseFrontmatter(block: string): PercorsoInfoFrontmatter {
	const fields: Record<string, string> = {};

	for (const line of block.split('\n')) {
		const separator = line.indexOf(':');
		if (separator === -1) continue;

		const key = line.slice(0, separator).trim();
		const value = line.slice(separator + 1).trim();
		fields[key] = value;
	}

	if (!fields.luogo?.trim()) {
		throw new Error('info.md frontmatter must include luogo');
	}

	return {
		coordinate: fields.coordinate ?? '',
		luogo: fields.luogo.trim()
	};
}

export function formatCoordinateLabel(coordinate: string): string {
	const [lat, lon] = coordinate.split(',').map((part) => part.trim());
	if (!lat || !lon) return `Coordinate ${coordinate}`;

	return `Coordinate ${lat}, ${lon}`;
}

function normalizeCoordinate(coordinate: string): string {
	const [lat, lon] = coordinate.split(',').map((part) => part.trim());
	if (!lat || !lon) return coordinate.trim();
	return `${lat},${lon}`;
}

export function coordinatesToGoogleMapsEmbedRoute(coordinates: string[]): string {
	if (coordinates.length === 0) {
		return 'https://maps.google.com/maps?output=embed';
	}

	if (coordinates.length === 1) {
		return `https://maps.google.com/maps?q=${encodeURIComponent(normalizeCoordinate(coordinates[0]))}&z=15&output=embed`;
	}

	const origin = normalizeCoordinate(coordinates[0]);
	const destination = normalizeCoordinate(coordinates[coordinates.length - 1]);
	const waypoints = coordinates.slice(1, -1).map(normalizeCoordinate).filter(Boolean);
	const waypointsParam = waypoints.length > 0 ? `&waypoints=${encodeURIComponent(waypoints.join('|'))}` : '';

	return `https://www.google.com/maps?output=embed&saddr=${encodeURIComponent(origin)}&daddr=${encodeURIComponent(destination)}${waypointsParam}&dirflg=w`;
}

export function coordinatesToGoogleMapsRouteLink(coordinates: string[]): string {
	if (coordinates.length === 0) {
		return 'https://www.google.com/maps';
	}

	if (coordinates.length === 1) {
		return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(normalizeCoordinate(coordinates[0]))}`;
	}

	const origin = normalizeCoordinate(coordinates[0]);
	const destination = normalizeCoordinate(coordinates[coordinates.length - 1]);
	const waypoints = coordinates.slice(1, -1).map(normalizeCoordinate).filter(Boolean);
	const waypointsParam = waypoints.length > 0 ? `&waypoints=${encodeURIComponent(waypoints.join('|'))}` : '';

	return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=walking${waypointsParam}`;
}
