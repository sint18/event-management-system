<script lang="ts">
	import { enhance } from '$app/forms';
	export let form

</script>
<div class="p-10 space-y-5 container h-full justify-center">
	<button type="button" on:click={() => {history.back()}} class="btn variant-filled-surface">Back</button>
	<h2 class="h2">Create An Event</h2>
	<hr />
	{#if form?.success}
		<p class="alert variant-ghost-success">New Event Successfully Created!</p>
	{/if}
	{#if form?.missing}
		<p class="alert variant-ghost-error">{form?.item} is missing!</p>
	{/if}
	<form class="space-y-5" method="post" use:enhance>
<!--		#TODO: Implement adding multimedia for events-->
		<label class="label">
			<span>Event Name</span>
			<input class="input" type="text" name="eventName" placeholder="Enter name of the event" />
		</label>

		<label class="label">
			<span>Description</span>
			<textarea class="textarea" rows="4" name="description" placeholder="Enter a short description about the event" />
		</label>

		<label class="label">
			<span>Event Start Date</span>
			<input class="input" type="datetime-local" name="startDate" />
		</label>

		<label class="label">
			<span>Event End Date</span>
			<input class="input" type="datetime-local" name="endDate" />
		</label>

		<label class="label">
			<span>Event Venue</span>
			<input class="input" type="text" name="venue" placeholder="Enter name of the venue" />
		</label>

		<label class="label">
			<span>Event Status</span>
			<select class="select" name="status">
				<option value="upcoming">Upcoming</option>
				<option value="past">Past</option>
				<option value="canceled">Canceled</option>
			</select>
		</label>

		<div class="grid grid-cols-6 gap-4">
			<button type="submit" class="btn variant-filled-primary">Create</button>
			<button type="reset" class="btn variant-filled">Cancel</button>
		</div>

	</form>
</div>