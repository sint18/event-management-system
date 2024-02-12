<script lang="ts">
	import { enhance } from '$app/forms';
	import { SlideToggle } from '@skeletonlabs/skeleton';

	export let data

	let readOnlyInputs: boolean = false

</script>
<div class="p-10 space-y-5 container h-full justify-center">
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
				<input class="input" readonly={!readOnlyInputs} type="date" value={data.eventInfo['start_date'].toJSON().slice(0, 10)} name="startDate" />
			</label>

			<label class="label">
				<span>Event End Date</span>
				<input class="input" readonly={!readOnlyInputs} type="date" value={data.eventInfo['end_date'].toJSON().slice(0, 10)} name="endDate" />
			</label>

			<label class="label">
				<span>Event Venue</span>
				<input class="input" readonly={!readOnlyInputs} type="text" value={data.eventInfo['venue']} name="venue" placeholder="Enter name of the venue" />
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