<script lang="ts">
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';
	import { PERCORSO_INTRO, PERCORSO_TITLE } from '$lib/percorso/constants';
	import type { PercorsoManifest } from '$lib/percorso/types';
	import './percorso.css';

	type Props = {
		manifest: PercorsoManifest;
	};

	let { manifest }: Props = $props();
</script>

<section class="percorso">
	<SectionHeading
		title={PERCORSO_TITLE}
		intro={PERCORSO_INTRO}
		headingLevel={1}
		titleClass="percorso__title"
		introClass="percorso__intro"
	/>

	<div class="percorso__list">
		{#each manifest.stages as stage, index (stage.id)}
			{#if index > 0}
				<hr class="percorso__divider" />
			{/if}
			<article class="percorso-stage" aria-labelledby="{stage.id}-title">
				<h2 class="percorso-stage__title" id="{stage.id}-title">Tappa {stage.number} - {stage.luogo}</h2>

				<div class="percorso-stage__grid">
					<p class="percorso-stage__meta">{stage.coordinateLabel}</p>
					<p class="percorso-stage__body">{stage.body}</p>
				</div>

				<div class="percorso-stage__map-wrap">
					<iframe
						class="percorso-stage__map"
						src={stage.mapEmbedSrc}
						title="Mappa Google Maps di {stage.luogo}"
						loading="lazy"
						referrerpolicy="no-referrer-when-downgrade"
						allowfullscreen
					></iframe>
				</div>

				<a class="percorso-stage__map-link" href={stage.mapLink} target="_blank" rel="noreferrer">
					Apri in Google Maps ->
				</a>
			</article>
		{/each}
	</div>
</section>
