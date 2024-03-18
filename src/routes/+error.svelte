<script lang="ts">
	import { page } from '$app/stores';
</script>

{#if $page.error}
	<h1 class="h1">{$page.error.message}</h1>
{/if}