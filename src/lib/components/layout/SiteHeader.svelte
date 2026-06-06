<script lang="ts">
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import heroLogo from '$lib/assets/home/hero-logo.png';
	import { SITE_NAV } from '$lib/home/hero-nav';
	import './site-header.css';

	let headerElement: HTMLElement | undefined = $state();
	let innerElement: HTMLElement | undefined = $state();
	let menuOpen = $state(false);

	$effect(() => {
		if (!innerElement || !headerElement) {
			return;
		}

		const syncHeaderHeight = () => {
			headerElement?.style.setProperty(
				'--site-header-bar-height',
				`${innerElement?.offsetHeight ?? 0}px`
			);
		};

		syncHeaderHeight();

		const observer = new ResizeObserver(syncHeaderHeight);
		observer.observe(innerElement);

		return () => observer.disconnect();
	});

	$effect(() => {
		if (typeof document === 'undefined') {
			return;
		}

		if (menuOpen && innerElement) {
			document.body.style.overflow = 'hidden';
			document.body.style.paddingTop = `${innerElement.offsetHeight}px`;
		} else {
			document.body.style.overflow = '';
			document.body.style.paddingTop = '';
		}

		return () => {
			document.body.style.overflow = '';
			document.body.style.paddingTop = '';
		};
	});

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

	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	function closeMenu() {
		menuOpen = false;
	}

	function handleWindowKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeMenu();
		}
	}

	function handleDocumentClick(event: MouseEvent) {
		if (!menuOpen || !headerElement) {
			return;
		}

		if (!headerElement.contains(event.target as Node)) {
			closeMenu();
		}
	}
</script>

<svelte:window onkeydown={handleWindowKeydown} onclick={handleDocumentClick} />

<header
	class="site-header"
	class:site-header--menu-open={menuOpen}
	bind:this={headerElement}
>
	<div class="site-header__inner" bind:this={innerElement}>
		<a
			class="site-header__brand-home"
			href={homeCoverHref}
			aria-label="La Bucata — torna alla copertina"
			onclick={handleBrandClick}
		>
			<img class="site-header__brand-logo" src={heroLogo} alt="" width="56" height="56" />
			<span class="site-header__brand-title">LA BUCATA</span>
		</a>

		<button
			type="button"
			class="site-header__menu-toggle"
			aria-expanded={menuOpen}
			aria-controls="site-header-nav-mobile"
			aria-label={menuOpen ? 'Chiudi menu' : 'Apri menu'}
			onclick={toggleMenu}
		>
			<span class="site-header__menu-icon" aria-hidden="true">
				<span class="site-header__menu-bar"></span>
				<span class="site-header__menu-bar"></span>
				<span class="site-header__menu-bar"></span>
			</span>
		</button>

		<nav class="site-header__nav site-header__nav--desktop" aria-label="Sezioni del sito">
			{#each navLinks as link (link.id)}
				<a class="site-header__nav-link" href={link.href}>{link.label}</a>
			{/each}
		</nav>
	</div>

	<nav
		id="site-header-nav-mobile"
		class="site-header__nav site-header__nav--mobile"
		aria-label="Sezioni del sito"
		aria-hidden={!menuOpen}
	>
		{#each navLinks as link (link.id)}
			<a class="site-header__nav-link" href={link.href} onclick={closeMenu}>{link.label}</a>
		{/each}
	</nav>

	{#if menuOpen}
		<button
			type="button"
			class="site-header__backdrop"
			aria-label="Chiudi menu"
			tabindex="-1"
			onclick={closeMenu}
		></button>
	{/if}
</header>
