import aboutIllustration from '$lib/content/about/stampa10_edit_Marzo.png';
import aboutInfoRaw from '$lib/content/about/info.md?raw';
import { parseAboutMarkdown, splitAboutParagraphs } from './parse-info';

export function loadAboutContent() {
	const { frontmatter, body } = parseAboutMarkdown(aboutInfoRaw);

	return {
		title: frontmatter.titolo,
		paragraphs: splitAboutParagraphs(body),
		illustrationSrc: aboutIllustration
	};
}
