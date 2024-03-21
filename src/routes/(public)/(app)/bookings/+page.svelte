<script lang="ts">
	import type { BookingInfo } from '$lib/server/types';
	import CalendarClock from 'virtual:icons/mdi/calendar-clock'
	import MapIcon from 'virtual:icons/mdi/map-marker-radius'
	import { checkStatus } from '$lib';

	export let data;
	const groupData = () => {
		let booked: Array<BookingInfo> = [];
		let other: Array<BookingInfo> = [];
		if (data.bookings) {
			data.bookings.forEach((item) => {
				if (item['status'] === 'booked') {
					booked.push(item);
				} else {
					other.push(item);
				}
			});
		}
		return { booked: booked, others: other };
	};

	$: sourceData = data.bookings ? groupData() : undefined;
</script>
<div class="p-5 space-y-5 container mx-auto h-full justify-center">
	<h1 class="h1">Bookings</h1>
	<h2 class="h2">Present</h2>
	<div class="grid grid-cols-1 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 gap-4">
		{#if sourceData}
			{#each sourceData.booked as row}
				<a href="/bookings/{row.booking_ref}" class="card">
					<header class="card-header">
						<p>{row.event_name}</p>
					</header>
					<section class="p-4">

						<dl class="list-dl">
							<div class="flex-auto">
								<dt><CalendarClock></CalendarClock></dt>
								<dd>{row.event_datetime}</dd>
							</div>
							<div class="flex-auto">
								<dt><MapIcon></MapIcon></dt>
								<dd>{row.location}</dd>
							</div>

						</dl>
					</section>
					<footer class="card-footer space-x-4">
						<span class="chip {checkStatus(row.status)} uppercase font-semibold">{row.status}</span>
						<span>Ref. {row.booking_ref}</span>
					</footer>
				</a>

			{/each}

		{/if}
	</div>
	<hr>

	<h2 class="h2">Past</h2>
	<div class="grid grid-cols-1 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 gap-4">
		{#if sourceData }
			{#each sourceData.others as row}
				<a href="/bookings/{row.booking_ref}" class="card">
					<header class="card-header">{row.event_name}</header>
					<section class="p-4">

						<dl class="list-dl">
							<div class="flex-auto">
								<dt><CalendarClock></CalendarClock></dt>
								<dd>{row.event_datetime}</dd>
							</div>
							<div class="flex-auto">
								<dt><MapIcon></MapIcon></dt>
								<dd>{row.location}</dd>
							</div>

						</dl>
					</section>
					<footer class="card-footer space-x-4">
						<span class="chip {checkStatus(row.status)} uppercase font-semibold">{row.status}</span>
						<span>Ref. {row.booking_ref}</span>
					</footer>
				</a>
			{/each}
		{/if}
	</div>

</div>