<script lang="ts">
	import SiteHeader from './SiteHeader.svelte';
	import './site-shell.css';

	type Props = {
		children: import('svelte').Snippet;
	};

	let { children }: Props = $props();
</script>

<div class="site-shell">
	<SiteHeader />
	<main class="site-shell__main">
		{@render children()}
	</main>
</div>
