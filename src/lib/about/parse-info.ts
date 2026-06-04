export type AboutFrontmatter = {
	titolo: string;
};

export function parseAboutMarkdown(raw: string): { frontmatter: AboutFrontmatter; body: string } {
	const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
	if (!match) {
		throw new Error('about info.md must start with YAML frontmatter');
	}

	const frontmatter = parseFrontmatter(match[1]);
	const body = match[2].trim();

	return { frontmatter, body };
}

function parseFrontmatter(block: string): AboutFrontmatter {
	const fields: Record<string, string> = {};

	for (const line of block.split('\n')) {
		const separator = line.indexOf(':');
		if (separator === -1) continue;

		const key = line.slice(0, separator).trim();
		const value = line.slice(separator + 1).trim();
		fields[key] = value;
	}

	if (!fields.titolo?.trim()) {
		throw new Error('about info.md frontmatter must include titolo');
	}

	return { titolo: fields.titolo.trim() };
}

export function splitAboutParagraphs(body: string): string[] {
	const blocks = body
		.split(/\n\n+/)
		.map((part) => part.trim())
		.filter(Boolean);

	if (blocks.length > 1) return blocks;

	const single = blocks[0] ?? '';
	const splitIndex = single.indexOf('. Il percorso');
	if (splitIndex === -1) return single ? [single] : [];

	return [single.slice(0, splitIndex + 1).trim(), single.slice(splitIndex + 2).trim()];
}
