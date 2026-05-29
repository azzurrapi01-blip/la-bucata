export function captionFromFilename(filename: string): string {
	const base = filename.replace(/\.[^.]+$/i, '').trim();
	const cleaned = base.replace(/\s+\d+$/u, '').trim();
	const words = cleaned.split('-').filter(Boolean);

	if (words.length === 2) {
		return `${capitalize(words[0])} ${words[1].toLowerCase()}`;
	}

	return words.map(capitalize).join(' ');
}

function capitalize(word: string): string {
	return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}
