export type HomeNavIcon = 'mappa' | 'suono' | 'fotografia' | 'botanica';

export type HomeNavCard = {
	id: HomeNavIcon;
	title: string;
	description: string;
	path: string;
	background: string;
};

export const HOME_NAV_CARDS: HomeNavCard[] = [
	{
		id: 'mappa',
		title: 'Mappa',
		description: 'Un percorso che parte da Porta Pesa e termina a Pretola.',
		path: '/percorso',
		background: '#adb4a8'
	},
	{
		id: 'suono',
		title: 'Suono',
		description: 'Registrazioni di 6 tappe e spettrogrammi visivi.',
		path: '/audio',
		background: '#e8d6b9'
	},
	{
		id: 'fotografia',
		title: 'Fotografia',
		description: 'Un racconto del percorso per immagini.',
		path: '/gallery',
		background: '#e5c76b'
	},
	{
		id: 'botanica',
		title: 'Botanica',
		description: 'Catalogazioni di specie vegetali e stampe botaniche.',
		path: '/raccolta',
		background: '#b9c678'
	}
];
