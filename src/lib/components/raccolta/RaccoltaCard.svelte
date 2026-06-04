<script lang="ts">
	type Props = {
		src: string;
		caption: string;
		alt?: string;
		onClick?: () => void;
	};

	let { src, caption, alt, onClick }: Props = $props();

	const imageAlt = $derived(alt ?? caption);
</script>

<figure class="raccolta__card">
	<button type="button" class="raccolta__card-media" onclick={onClick}>
		<img src={src} alt={imageAlt} loading="lazy" />
	</button>
	<figcaption class="raccolta__card-caption">{caption}</figcaption>
</figure>
