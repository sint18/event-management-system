<script lang="ts">
	import CalendarClock from 'virtual:icons/mdi/calendar-clock';
	import DurationIcon from 'virtual:icons/mdi/clockwise';
	import MapIcon from 'virtual:icons/mdi/map-marker-radius';
	import ArrowIcon from 'virtual:icons/mdi/arrow-down-drop-circle-outline';
	export let data
</script>
<div class="p-5 space-y-5 container mx-auto h-full justify-center">
	<h1 class="h1">Home</h1>
	<div class="grid grid-cols-1 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 gap-4">
		{#if data.events }
			{#each data.events as eachEvent }
				<div class="card p-4 bg-initial">
					<header class="card-header"><span class="font-bold text-xl">{eachEvent['event_name']}</span></header>
					<section class="p-4 space-y-4">
						<div class="h-4">
							<p class="truncate ...">{eachEvent['description']}</p>
						</div>
						<dl class="list-dl">
							<div class="flex-auto">
								<dt><CalendarClock></CalendarClock></dt>
								<dd>
									<span>{eachEvent['start_datetime']} - {eachEvent['end_datetime']}</span>
								</dd>
							</div>
							<div class="flex-auto">
								<dt><DurationIcon></DurationIcon></dt>
								<dd>
									<span>{eachEvent['duration']}</span>
								</dd>
							</div>

							<div class="flex-auto">
								<dt><MapIcon></MapIcon></dt>
								<dd>
									<span>{eachEvent['location']}</span>
								</dd>
							</div>

						</dl>
					</section>
					<footer class="card-footer">
						<a href="/event/{eachEvent['event_id']}" class="btn variant-ghost-surface">
							<span><ArrowIcon></ArrowIcon></span>
							<span>See more</span>
						</a>
					</footer>
				</div>
			{/each}
		{/if}

	</div>
</div>