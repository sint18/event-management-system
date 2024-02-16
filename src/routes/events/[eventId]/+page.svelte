<script lang="ts">
	import { enhance } from '$app/forms';
	import { SlideToggle } from '@skeletonlabs/skeleton';

	export let data

	let readOnlyInputs: boolean = false

</script>
<div class="p-10 space-y-5 container h-full justify-center">
	<button type="button" on:click={() => {history.back()}} class="btn variant-filled-surface">Back</button>
	<h2 class="h2">Event Information</h2>
	{#if data.eventInfo }
		<SlideToggle name="slider-label" bind:checked={readOnlyInputs}>Edit Information</SlideToggle>
		<form class="space-y-5" method="post" use:enhance>
			<!--		#TODO: Implement adding multimedia for events-->
			<label class="label">
				<span>Event Name</span>
				<input class="input" readonly={!readOnlyInputs} type="text" value={data.eventInfo['event_name']} name="eventName" placeholder="Enter name of the event" />
			</label>

			<label class="label">
				<span>Description</span>
				<textarea class="textarea" readonly={!readOnlyInputs} rows="4" value={data.eventInfo['description']} name="description" placeholder="Enter a short description about the event" />
			</label>

			<label class="label">
				<span>Event Start Date</span>
				<input class="input" readonly={!readOnlyInputs} type="datetime-local" value={data.eventInfo['start_datetime'].toJSON().slice(0, 10)} name="startDate" />
			</label>

			<label class="label">
				<span>Event End Date</span>
				<input class="input" readonly={!readOnlyInputs} type="datetime-local" value={data.eventInfo['end_datetime'].toJSON().slice(0, 10)} name="endDate" />
			</label>

			<label class="label">
				<span>Event Location</span>
				<input class="input" readonly={!readOnlyInputs} type="text" value={data.eventInfo['location']} name="location" placeholder="Enter name of the location" />
			</label>

			<label class="label">
				<span>Event Status</span>
				<select class="select" name="status" value={data.eventInfo['status']}>
					<option value="upcoming">Upcoming</option>
					<option value="past">Past</option>
					<option value="canceled">Canceled</option>
				</select>
			</label>

			{#if (readOnlyInputs)}
			<div class="grid grid-cols-6 gap-4">
				<button type="submit" class="btn variant-filled-primary">Submit</button>
				<button type="reset" class="btn variant-filled">Cancel</button>
			</div>
				{/if}

		</form>
	{/if}
</div>