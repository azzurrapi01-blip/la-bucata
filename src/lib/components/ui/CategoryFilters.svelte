<script lang="ts">
	import './category-filters.css';

	export type FilterCategory = {
		id: string;
		label: string;
	};

	type Props = {
		categories: FilterCategory[];
		activeId: string;
		onSelect: (id: string) => void;
		ariaLabel: string;
	};

	let { categories, activeId, onSelect, ariaLabel }: Props = $props();
</script>

<div class="category-filters" role="tablist" aria-label={ariaLabel}>
	{#each categories as category}
		<button
			type="button"
			class="category-filters__tab"
			class:category-filters__tab--active={category.id === activeId}
			role="tab"
			aria-selected={category.id === activeId}
			onclick={() => onSelect(category.id)}
		>
			{category.label}
		</button>
	{/each}
</div>
