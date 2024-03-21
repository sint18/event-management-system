<script lang="ts">
	import { checkStatus } from '$lib';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';

	export let data
	let formElement: HTMLFormElement
	const modal = getModalStore()

	const cancelBooking: ModalSettings = {
		type: 'confirm',
		title: 'Booking Cancellation',
		body: 'Are you sure you wish to cancel this booking?',
		response: r => {
			if (r) {
				formElement.requestSubmit();
			}
		}
	};
</script>

<div class="p-5 space-y-5 container mx-auto h-full justify-center">
	{#if data.bookingInfo}
		<div>
			<h3 class="h3">Booking Details</h3>
		</div>
		<div>
			<dl class="divide-y divide-slate-700">
				<div class="grid grid-cols-2 gap-4 py-6">
					<dt class="leading-6">Booking Ref</dt>
					<dd>{data.bookingInfo['booking_ref']}</dd>
				</div>
				<div class="grid grid-cols-2 gap-4 py-6">
					<dt>Name</dt>
					<dd>{data.bookingInfo['fullname']}</dd>
				</div>
				<div class="grid grid-cols-2 gap-4 py-6">
					<dt>Username</dt>
					<dd>{data.bookingInfo['username']}</dd>
				</div>
				<div class="grid grid-cols-2 gap-4 py-6">
					<dt>Event Name</dt>
					<dd>{data.bookingInfo['event_name']}</dd>
				</div>
				<div class="grid grid-cols-2 gap-4 py-6">
					<dt>Event Location</dt>
					<dd>{data.bookingInfo['location']}</dd>
				</div>
				<div class="grid grid-cols-2 gap-4 py-6">
					<dt>Event Start Date</dt>
					<dd>{data.bookingInfo['start_datetime']}</dd>
				</div>
				<div class="grid grid-cols-2 gap-4 py-6">
					<dt>Event End Date</dt>
					<dd>{data.bookingInfo['end_datetime']}</dd>
				</div>
				<div class="grid grid-cols-2 gap-4 py-6">
					<dt>About</dt>
					<dd>{data.bookingInfo['description']}</dd>
				</div>
				<div class="grid grid-cols-2 gap-4 py-6">
					<dt>Booking Date</dt>
					<dd>{data.bookingInfo['booking_datetime']}</dd>
				</div>
				<div class="grid grid-cols-2 gap-4 py-6">
					<dt>Seats</dt>
					<dd>{data.bookingInfo['ticket_quantity']}</dd>
				</div>
				<div class="grid grid-cols-2 gap-4 py-6">
					<dt>Status</dt>
					<dd><span class="chip {checkStatus(data.bookingInfo['status'])} uppercase">{data.bookingInfo['status']}</span></dd>
				</div>
			</dl>
		</div>
		{#if data.bookingInfo['status'] === 'booked'}
			<form method="post" bind:this={formElement}>
				<input name="bookingId" bind:value={data.bookingInfo['id']} hidden/>
				<button type="button" on:click={() => {modal.trigger(cancelBooking)}} class="btn variant-ghost-error">Cancel Booking</button>
			</form>
		{/if}
	{/if}
</div>