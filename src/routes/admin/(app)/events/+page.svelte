<script lang="ts">
	import { Paginator, Table } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';
	import { setTableSource } from '$lib';

	export let data

	// ----------- Pagination ---------------
	let paginationSettings = {
		page: 0,
		limit: 5,
		size: data.allEvents.length,
		amounts: [5, 10, 20, 50]
	}

	$: paginationSettings.size = data.allEvents.length;

	$: paginatedSource = data.allEvents.slice(
		paginationSettings.page * paginationSettings.limit,
		paginationSettings.page * paginationSettings.limit + paginationSettings.limit
	);

	function selectionHandler(meta: CustomEvent) {
		if (meta.detail) {
			goto(`events/${meta.detail[0]}`);
		}
	}

	// If sourceData updates, set the new TableSource values
	$: tableSimple = data.allEvents.length != 0 ? setTableSource(data.headers, paginatedSource) : undefined;

</script>
<div class="p-10 space-y-5 container h-full justify-center">
	<h2 class="h2">Events</h2>
	<hr />
	<a href="events/create" class="btn variant-filled">Create Event</a>
	{#if tableSimple}
		<Table source={tableSimple} interactive={true} on:selected={selectionHandler} />
		<Paginator bind:settings={paginationSettings}></Paginator>
	{/if}
</div>