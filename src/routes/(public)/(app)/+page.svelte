<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import CalendarClock from 'virtual:icons/mdi/calendar-clock';
	import StatusIcon from 'virtual:icons/mdi/tick-circle-outline';
	import MapIcon from 'virtual:icons/mdi/map-marker-radius';
	import ArrowIcon from 'virtual:icons/mdi/arrow-down-drop-circle-outline';
	import FilterIcon from 'virtual:icons/mdi/filter-variant';
	import FilterOffIcon from 'virtual:icons/mdi/filter-off-outline';
	export let data

	let categoryFilter: string
	let organizerFilter: string
	let statusFilter: string

	function checkStatus(status: string) {
		if (status === 'upcoming') {
			// return 'text-success-500'
			return 'variant-filled-success'
		} else {
			// return 'text-error-500'
			return 'variant-filled-error'
		}
	}

	function submitHandler() {
		$page.url.searchParams.set('category', categoryFilter)
		$page.url.searchParams.set('organizer', organizerFilter)
		$page.url.searchParams.set('status', statusFilter)
		return goto($page.url, {invalidateAll: true})
	}

	function resetFilter() {
		$page.url.searchParams.delete('category')
		$page.url.searchParams.delete('organizer')
		$page.url.searchParams.delete('status')
		return goto($page.url, {invalidateAll: true})
	}

</script>
<div class="p-5 space-y-5 container mx-auto h-full justify-center">
	<h1 class="h1">Home</h1>

	<Accordion>
		<AccordionItem>
			<svelte:fragment slot="lead"><FilterIcon></FilterIcon></svelte:fragment>
			<svelte:fragment slot="summary"><h4 class="h4">Filter Options</h4></svelte:fragment>
			<svelte:fragment slot="content">

				<form class="space-y-4" on:change|preventDefault={submitHandler}>
					{#if data.filters.categories}
					<label class="label">
						<span>Category</span>
						<select class="select" bind:value={categoryFilter}>
							{#each data.filters.categories as row }
							<option value={row['id']}>{row['category_name']}</option>
							{/each}
						</select>
					</label>
					{/if}

					{#if data.filters.organizers}
					<label class="label">
						<span>Organizer</span>
						<select class="select" bind:value={organizerFilter}>
							{#each data.filters.organizers as row }
							<option value={row['id']}>{row['organizer_name']}</option>
							{/each}
						</select>
					</label>
					{/if}

					<label class="label">
						<span>Event Status</span>
						<select class="select" bind:value={statusFilter}>
							<option value="upcoming">Upcoming</option>
							<option value="canceled">Cancelled</option>
							<option value="past">Past</option>
						</select>
					</label>

					<button type="button" on:click={resetFilter} class="btn variant-filled-surface">
						<span><FilterOffIcon></FilterOffIcon></span>
						<span>Reset Filter</span>
					</button>
				</form>

			</svelte:fragment>
		</AccordionItem>
	</Accordion>

	<div class="grid grid-cols-1 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 gap-4">
		{#if data.events }
			{#each data.events as eachEvent }
				<div class="card p-4 bg-initial">
					<header class="card-header">
						<span class="font-bold text-xl">{eachEvent['event_name']}</span>
					</header>
					<section class="p-4 space-y-4">
						<div class="h-4">
							<p class="truncate ...">{eachEvent['description']}</p>
						</div>
						<dl class="list-dl">
							<div class="flex-auto">
								<dt><CalendarClock></CalendarClock></dt>
								<dd>
									<span>{eachEvent['start_datetime']}</span>
								</dd>
							</div>
							<div class="flex-auto">
								<dt><StatusIcon></StatusIcon></dt>
								<dd>
									<span class="uppercase chip w-24 font-semibold {checkStatus(eachEvent['status'])}">{eachEvent['status']}</span>
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