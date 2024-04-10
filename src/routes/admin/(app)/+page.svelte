<script lang="ts">
	import { Table } from '@skeletonlabs/skeleton';
	import BookingStatusChart from '$lib/charts/BookingStatusChart.svelte';
	import TotalBookingsChart from '$lib/charts/TotalBookingsChart.svelte';
	import { setTableSource } from '$lib';
	import { goto } from '$app/navigation';

	export let data;

	function selectionHandler1(meta: CustomEvent) {
		if (meta.detail) {
			goto(`admin/bookings/${meta.detail[0]}`);
		}
	}

	function selectionHandler2(meta: CustomEvent) {
		if (meta.detail) {
			goto(`admin/events/${meta.detail[0]}`);
		}
	}

	$: top5Bookings = data.recentBookings.length != 0 ? setTableSource(Object.keys(data.recentBookings[0]), data.recentBookings) : undefined;
	$: upcomingEvents = data.upcomingEvents.length != 0 ? setTableSource(Object.keys(data.upcomingEvents[0]), data.upcomingEvents) : undefined

</script>
<div class="p-10 space-y-5 container h-full justify-center">
	<h2 class="h2">Dashboard</h2>
	<hr />

	<div class="text-center grid grid-cols-5 gap-4">
		<div class="card p-4">
			<p class="text-xl">Total Users</p>
			<p class="text-5xl font-semibold">{data?.counts.users}</p>
		</div>

		<div class="card p-4">
			<p class="text-xl">Admins</p>
			<p class="text-5xl font-semibold">{data?.counts.admins}</p>
		</div>

		<div class="card p-4">
			<p class="text-xl">Total Events</p>
			<p class="text-5xl font-semibold">{data?.counts.events}</p>
		</div>
		<div class="card p-4">
			<p class="text-xl">Bookings</p>
			<p class="text-5xl font-semibold">{data?.counts.bookings}</p>
		</div>
		<div>
			Cancelled Bookings
		</div>

		<div class="col-span-2 card p-4">
<!--			<h3 class="h3 text-center">Total Bookings grouped by Status</h3>-->
			<BookingStatusChart sourceData={data.bookingStatusAnalytics}></BookingStatusChart>
		</div>

		<div class="col-span-3 card p-4">
			<TotalBookingsChart sourceData={data}></TotalBookingsChart>
		</div>

		<div class="grid grid-cols-6 gap-4 col-span-5">
			{#if top5Bookings}
				<div class="card p-4 col-span-3 table-container space-y-5">
					<h3 class="h3 text-center">Top 5 Booking Activities</h3>
					<Table source={top5Bookings} interactive={true} on:selected={selectionHandler1}></Table>
				</div>
			{/if}

			{#if upcomingEvents}
				<div class="card p-4 col-span-3 table-container space-y-5">
					<h3 class="h3 text-center">Recent Events</h3>
					<Table source={upcomingEvents} interactive={true} on:selected={selectionHandler2}></Table>
				</div>
			{/if}
		</div>

	</div>
</div>