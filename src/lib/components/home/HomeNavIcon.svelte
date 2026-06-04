<script lang="ts">
	import iconBotanica from '$lib/assets/home/icon-botanica.png';
	import iconFotografia from '$lib/assets/home/icon-fotografia.png';
	import type { HomeNavIcon } from '$lib/home/constants';

	type Props = {
		name: HomeNavIcon;
	};

	let { name }: Props = $props();

	const rasterIcons: Partial<Record<HomeNavIcon, string>> = {
		fotografia: iconFotografia,
		botanica: iconBotanica
	};

	const stroke = {
		fill: 'none',
		stroke: 'currentColor',
		'stroke-width': 2,
		'stroke-linecap': 'round',
		'stroke-linejoin': 'round'
	} as const;
</script>

{#if rasterIcons[name]}
	<img
		class="home-nav-icon home-nav-icon--raster"
		class:home-nav-icon--botanica={name === 'botanica'}
		src={rasterIcons[name]}
		alt=""
		aria-hidden="true"
	/>
{:else}
<svg class="home-nav-icon" viewBox="0 0 48 48" aria-hidden="true">
	{#if name === 'mappa'}
		<path
			{...stroke}
			d="M24 7c-7.2 0-12 5.4-12 12.2 0 9.2 12 20.8 12 20.8s12-11.6 12-20.8C36 12.4 31.2 7 24 7z"
		/>
		<circle {...stroke} cx="24" cy="18" r="4" />
	{:else if name === 'suono'}
		<g {...stroke}>
			<line x1="9" y1="23" x2="9" y2="25" />
			<line x1="13" y1="19" x2="13" y2="29" />
			<line x1="17" y1="15" x2="17" y2="33" />
			<line x1="21" y1="21" x2="21" y2="27" />
			<line x1="25" y1="13" x2="25" y2="35" />
			<line x1="29" y1="21" x2="29" y2="27" />
			<line x1="33" y1="15" x2="33" y2="33" />
			<line x1="37" y1="19" x2="37" y2="29" />
		</g>
	{/if}
</svg>
{/if}

<style>
	.home-nav-icon {
		color: #000000;
		display: block;
		height: 2.25rem;
		width: 2.25rem;
	}

	.home-nav-icon--raster {
		block-size: 2rem;
		inline-size: 2rem;
		object-fit: contain;
		object-position: center;
	}

	.home-nav-icon--raster.home-nav-icon--botanica {
		block-size: 1.7rem;
		inline-size: 1.7rem;
	}
</style>
