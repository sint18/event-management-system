<script lang="ts">
	import { Table, tableMapperValues, type TableSource } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';
	import BookingStatusChart from '$lib/charts/BookingStatusChart.svelte';
	import TotalBookingsChart from '$lib/charts/TotalBookingsChart.svelte';

	export let data;

	function selectionHandler(meta: CustomEvent) {
		if (meta.detail) {
			console.log(meta);
			// goto(`admin/bookings/${meta.detail[0]}`);
		}

	}

	function setTableSource(headers: string[], sourceData: string[]): TableSource {
		return {
			head: headers,
			body: tableMapperValues(sourceData, headers),
			meta: tableMapperValues(sourceData, headers)
		};
	}

	$: top5Bookings = data.recentBookings.length != 0 ? setTableSource(data.recentBookingsHeaders, data.recentBookings) : undefined;
	$: upcomingEvents = data.upcomingEvents.length != 0 ? setTableSource(Object.keys(data.upcomingEvents[0]), data.upcomingEvents) : undefined

</script>
<div class="p-10 space-y-5 container h-full justify-center">
	<h2 class="h2">Dashboard</h2>
	<hr />

	<div class="grid grid-cols-2 gap-4">

		<div>
<!--			<h3 class="h3 text-center">Total Bookings grouped by Status</h3>-->
			<BookingStatusChart sourceData={data}></BookingStatusChart>
		</div>

		<div>
			<TotalBookingsChart sourceData={data}></TotalBookingsChart>
		</div>

		{#if top5Bookings}
			<div class="table-container space-y-5">
				<h3 class="h3 text-center">Top 5 Booking Activities</h3>
				<Table source={top5Bookings} interactive={true} on:selected={selectionHandler}></Table>
			</div>
		{/if}

		{#if upcomingEvents}
			<div class="table-container space-y-5">
				<h3 class="h3 text-center">Recent Events</h3>
				<Table source={upcomingEvents} interactive={true} on:selected={selectionHandler}></Table>
			</div>
		{/if}


	</div>
</div>