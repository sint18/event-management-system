<script lang="ts">
	import { Table } from '@skeletonlabs/skeleton';
	import type { TableSource } from '@skeletonlabs/skeleton';
	import { tableMapperValues } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';

	export let data

	function selectionHandler(meta: CustomEvent) {
		if (meta.detail) {
			goto(`events/${meta.detail[0]}`);
		}
	}

	function setTableSource(): TableSource {
		return {
			head: data.headers,
			body: tableMapperValues(data.allEvents, data.headers),
			meta: tableMapperValues(data.allEvents, data.headers),
		};
	}

	// If sourceData updates, set the new TableSource values
	$: tableSimple = data.allEvents.length != 0 ? setTableSource() : undefined;

</script>
<div class="p-10 space-y-5 container h-full justify-center">
	<h2 class="h2">Events</h2>
	<hr />
	<a href="events/create" class="btn variant-filled">Create Event</a>
	{#if tableSimple}
		<p>Display Events</p>
		<Table source={tableSimple} interactive={true} on:selected={selectionHandler} />
	{/if}
</div>