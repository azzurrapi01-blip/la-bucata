<script lang="ts">
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import heroLogo from '$lib/assets/home/hero-logo.png';
	import { SITE_NAV } from '$lib/home/hero-nav';
	import './site-header.css';

	const siteRoot = $derived(base.replace(/\/$/, '') || '');
	const homeCoverHref = $derived(`${siteRoot}/#top`);

	const navLinks = $derived(
		SITE_NAV.map((item) => ({
			...item,
			href: item.path.startsWith('#')
				? `${siteRoot}/#${item.path.slice(1)}`
				: `${siteRoot}${item.path}`
		}))
	);

	function scrollToHomeCover() {
		document.getElementById('top')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	async function handleBrandClick(event: MouseEvent) {
		if (page.route.id !== '/') {
			return;
		}

		event.preventDefault();
		const target = `${siteRoot}/#top`;

		if (page.url.hash === '#top') {
			scrollToHomeCover();
			return;
		}

		await goto(target, { keepFocus: true, noScroll: true });
		scrollToHomeCover();
	}
</script>

<header class="site-header">
	<div class="site-header__inner">
		<a
			class="site-header__brand-home"
			href={homeCoverHref}
			aria-label="La Bucata — torna alla copertina"
			onclick={handleBrandClick}
		>
			<img class="site-header__brand-logo" src={heroLogo} alt="" width="44" height="44" />
			<span class="site-header__brand-title">LA BUCATA</span>
		</a>
		<nav class="site-header__nav" aria-label="Sezioni del sito">
			{#each navLinks as link (link.id)}
				<a class="site-header__nav-link" href={link.href}>{link.label}</a>
			{/each}
		</nav>
	</div>
</header>
