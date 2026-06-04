export type AudioInfoFrontmatter = {
	data: string;
	coordinate: string;
	descrizione_breve: string;
	percentuale: number;
	luogo: string;
};

export function parseInfoMarkdown(raw: string): { frontmatter: AudioInfoFrontmatter; body: string } {
	const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
	if (!match) {
		throw new Error('info.md must start with YAML frontmatter');
	}

	const frontmatter = parseFrontmatter(match[1]);
	const body = match[2].trim();

	return { frontmatter, body };
}

function parseFrontmatter(block: string): AudioInfoFrontmatter {
	const fields: Record<string, string> = {};

	for (const line of block.split('\n')) {
		const separator = line.indexOf(':');
		if (separator === -1) continue;

		const key = line.slice(0, separator).trim();
		const value = line.slice(separator + 1).trim();
		fields[key] = value;
	}

	const percentuale = Number.parseFloat(fields.percentuale ?? '');
	if (Number.isNaN(percentuale)) {
		throw new Error('info.md frontmatter must include numeric percentuale');
	}

	if (!fields.luogo?.trim()) {
		throw new Error('info.md frontmatter must include luogo');
	}

	return {
		data: fields.data ?? '',
		coordinate: fields.coordinate ?? '',
		descrizione_breve: fields.descrizione_breve ?? '',
		percentuale,
		luogo: fields.luogo.trim()
	};
}

export function formatCoordinateLabel(coordinate: string): string {
	const [lat, lon] = coordinate.split(',').map((part) => part.trim());
	if (!lat || !lon) return `Coordinate ${coordinate}`;

	return `Coordinate ${lat}, ${lon}`;
}
