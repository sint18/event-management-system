<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { enhance } from '$app/forms';
	import type { ModalSettings } from '@skeletonlabs/skeleton';

	const modalStore = getModalStore();

	export let data
	export let form
	let username: string
	let formElement: HTMLFormElement

	// ------------------------------- Modal Config --------------------------------------

	const bookModal: ModalSettings = {
		type: 'prompt',
		title: 'Event Booking',
		body: 'Please enter your username and confirm booking.',
		valueAttr: { type: 'text', required: true, placeholder: 'Enter Username . . .' },
		buttonTextSubmit: 'Confirm',
		response: r => {
			if (r) {
				username = r;
				formElement.requestSubmit();
			}
		}
	};

</script>
<div class="p-5 space-y-5 container mx-auto h-full justify-center">
	{#if data.eventInfo }
		<h2 class="h2">{data.eventInfo['event_name']}</h2>
		<h3 class="h3">Description</h3>
		<p>{data.eventInfo['description']}</p>

		<hr>
		<h3 class="h5">Information</h3>

		<div class="table-container">
			<table class="table variant-ghost">
				<tbody>
				<tr>
					<th>Start Date</th>
					<td>{data.eventInfo['start_datetime']}</td>
				</tr>

				<tr>
					<th>End Date</th>
					<td>{data.eventInfo['end_datetime']}</td>
				</tr>

				<tr>
					<th>Duration</th>
					<td>{data.eventInfo['duration']}</td>
				</tr>

				<tr>
					<th>Location</th>
					<td>{data.eventInfo['location']}</td>
				</tr>

				<tr>
					<th>Status</th>
					<td>{data.eventInfo['status']}</td>
				</tr>

				</tbody>
			</table>
		</div>
		{#if form?.success }
			<p class="alert variant-ghost-success">{form?.message}</p>
		{/if}
		<form method="post" use:enhance={({formData}) => {
			formData.append('username', username)
		}} bind:this={formElement}>
			<input name="eventId" value="{data.eventInfo['event_id']}" hidden>
			<button type="button" on:click={() => {modalStore.trigger(bookModal)}} class="btn variant-filled-primary" disabled={!(data.eventInfo['status'] === 'upcoming')}>Book Event</button>
		</form>

	{/if}
</div>