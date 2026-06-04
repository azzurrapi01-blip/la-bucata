export type SiteNavItem = {
	id: string;
	label: string;
	path: string;
};

export const SITE_NAV: SiteNavItem[] = [
	{ id: 'progetto', label: 'Il progetto', path: '#progetto' },
	{ id: 'audio', label: 'Racconto sonoro', path: '/audio' },
	{ id: 'percorso', label: 'Le tappe', path: '/percorso' },
	{ id: 'gallery', label: 'Galleria foto', path: '/gallery' },
	{ id: 'stampe', label: 'Stampe botaniche', path: '/stampe' },
	{ id: 'raccolta', label: 'Specie vegetali', path: '/raccolta' }
];
