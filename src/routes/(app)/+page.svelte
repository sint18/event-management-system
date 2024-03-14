<script lang="ts">
	export let data
</script>
<div class="p-5 space-y-5 container mx-auto h-full justify-center">
	<h1 class="h1">All Events</h1>
	<div class="grid lg:grid-cols-4 md:grid-cols-2 gap-4">

		{#if data.events }
			{#each data.events as eachEvent }
				<div class="card p-4 variant-filled">
					<header class="card-header"><span class="font-bold text-xl">{eachEvent['event_name']}</span></header>
					<section class="p-4 space-y-4">
						<div class="h-4">
							<p class="truncate ...">{eachEvent['description']}</p>
						</div>
<!--						<div class="flex flex-col space-x-4">-->
<!--							<span>-->
<!--								Date: <span class="font-semibold">{eachEvent['start_datetime']} - {eachEvent['end_datetime']}</span>-->
<!--							</span>-->
<!--							<span>-->
<!--								Location:asdfasefasef-->
<!--							</span>-->
<!--						</div>-->
						<dl class="list-dl -space-y-3">
							<div>
								<dt>Start Date :</dt>
								<dd>
									<span class="font-semibold">{eachEvent['start_datetime']}</span>
								</dd>
							</div>
							<div>
								<dt>End Date :</dt>
								<dd>
									<span class="font-semibold">{eachEvent['end_datetime']}</span>
								</dd>
							</div>

							<div>
								<dt>Location :</dt>
								<dd>
									<span class="font-semibold">{eachEvent['location']}</span>
								</dd>
							</div>

						</dl>
					</section>
					<footer class="card-footer">
						<a href="/event/{eachEvent['event_id']}" class="underline">See more ...</a>
					</footer>
				</div>
			{/each}
		{/if}

	</div>
</div>