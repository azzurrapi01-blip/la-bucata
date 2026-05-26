<script lang="ts">
	type Props = {
		src: string;
		alt?: string;
		onClick?: () => void;
	};

	let { src, alt = 'Stampa botanica', onClick }: Props = $props();
</script>

<button type="button" class="stampe__card" onclick={onClick}>
	<img {src} {alt} loading="lazy" />
</button>

