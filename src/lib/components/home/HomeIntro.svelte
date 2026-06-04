<script lang="ts">
	import { base } from '$app/paths';
	import { HOME_NAV_CARDS } from '$lib/home/constants';
	import HomeNavIcon from './HomeNavIcon.svelte';
	import './home-intro.css';

	type Props = {
		title: string;
		paragraphs: string[];
		illustrationSrc: string;
	};

	let { title, paragraphs, illustrationSrc }: Props = $props();

	const navCards = $derived(
		HOME_NAV_CARDS.map((card) => ({
			...card,
			href: `${base.replace(/\/$/, '')}${card.path}`
		}))
	);
</script>

<div class="home-intro" id="progetto">
	<div class="home-intro__layout">
		<div class="home-intro__visual">
			<h1 class="home-intro__title">{title}</h1>
			<img
				class="home-intro__image"
				src={illustrationSrc}
				alt="Illustrazione botanica del progetto La bucata"
			/>
		</div>

		<div class="home-intro__content">
			<div class="home-intro__text">
				{#each paragraphs as paragraph}
					<p>{paragraph}</p>
				{/each}
			</div>

			<nav class="home-intro__nav" aria-label="Sezioni del progetto">
				{#each navCards as card (card.id)}
					<a class="home-intro__card" href={card.href}>
						<span class="home-intro__card-icon">
							<HomeNavIcon name={card.id} />
						</span>
						<span class="home-intro__card-panel" style="--card-bg: {card.background}">
							<span class="home-intro__card-title">{card.title}</span>
							<span class="home-intro__card-description">{card.description}</span>
						</span>
					</a>
				{/each}
			</nav>
		</div>
	</div>
</div>
