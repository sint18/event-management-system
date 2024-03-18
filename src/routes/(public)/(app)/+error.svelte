<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="p-5 space-y-5 container mx-auto h-full justify-center">
	{#if $page.error}
		<p class="alert variant-ghost-error">{$page.error.message}</p>
	{/if}
</div>