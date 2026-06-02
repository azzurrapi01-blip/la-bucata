<script lang="ts">
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';
	import { PERCORSO_INTRO, PERCORSO_PREVIEW_LINK, PERCORSO_TITLE } from '$lib/percorso/constants';
	import type { PercorsoManifest } from '$lib/percorso/types';
	import { pickRandom } from '$lib/stampe/random';
	import './percorso.css';

	type Props = {
		manifest: PercorsoManifest;
	};

	let { manifest }: Props = $props();
	let randomStage = $state<PercorsoManifest['stages'][number] | null>(null);

	const percorsoHref = `${base.replace(/\/$/, '')}/percorso`;

	onMount(() => {
		if (manifest.stages.length === 0) return;
		randomStage = pickRandom(manifest.stages, 1)[0] ?? null;
	});
</script>

<section class="percorso percorso--preview">
	<SectionHeading
		title={PERCORSO_TITLE}
		intro={PERCORSO_INTRO}
		titleClass="percorso__title"
		introClass="percorso__intro"
	/>

	{#if randomStage}
		<article class="percorso-stage percorso-stage--preview" aria-labelledby="{randomStage.id}-title">
			<h3 class="percorso-stage__title" id="{randomStage.id}-title">
				Tappa {randomStage.number} - {randomStage.luogo}
			</h3>

			<div class="percorso-stage__grid">
				<p class="percorso-stage__meta">{randomStage.coordinateLabel}</p>
				<p class="percorso-stage__body">{randomStage.body}</p>
			</div>

			<div class="percorso-stage__map-wrap">
				<iframe
					class="percorso-stage__map"
					src={randomStage.mapEmbedSrc}
					title="Mappa Google Maps di {randomStage.luogo}"
					loading="lazy"
					referrerpolicy="no-referrer-when-downgrade"
					allowfullscreen
				></iframe>
			</div>
		</article>
	{/if}

	<a class="percorso__cta" href={percorsoHref}>{PERCORSO_PREVIEW_LINK}</a>
</section>
