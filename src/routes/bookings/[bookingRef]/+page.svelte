<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { popup, getModalStore } from '@skeletonlabs/skeleton';
	import type { PopupSettings, ModalSettings } from '@skeletonlabs/skeleton';

	export let data
	export let form
	let formElement: HTMLFormElement
	let readOnly: boolean = true
	let comboboxValue: string = 'actions'
	const modalStore = getModalStore()
	let hideTextarea: boolean = true
	// ---------- Functions ----------------------

	function amendBooking(response: string){
		if (response) {
			formElement.action = "?/amendBooking"
			formElement.requestSubmit()
		}
	}

	function selectHandler(this: any) {
		hideTextarea = this.value !== 'cancelled';
	}

	// ---------- Modal Config -------------------
	const amendBookingModal: ModalSettings = {
		type: 'confirm',
		title: 'Update Booking',
		body: 'Are you sure you wish to amend this booking?',
		response: r => amendBooking(r)
	};

	const popupCombobox: PopupSettings = {
		event: 'click',
		target: 'popupCombobox',
		placement: 'right'
	};
</script>

<div class="p-10 space-y-5 h-full container justify-center">
	<button type="button" on:click={() => {history.back()}} class="btn variant-filled-surface">Back</button>

	<h2 class="h2">Booking Information</h2>
	{#if data.bookingInfo }

		<button class="btn variant-filled w-48 justify-between" use:popup={popupCombobox}>
			<span class="capitalize">{comboboxValue ?? 'Trigger'}</span>
		</button>

		<div class="card p-4 w-48" data-popup="popupCombobox">
			<div class="grid grid-cols-1 gap-2">
				<button type="button" class="btn bg-transparent" on:click={() => {invalidateAll(); readOnly = true}}>Refresh</button>
				<button type="button" class="btn bg-transparent">Resend Email</button>
				<button type="button" class="btn bg-transparent" on:click={() => {readOnly = false}}>Amend Booking</button>
			</div>
		</div>

		{#if form?.success }
			<p class="alert variant-ghost-success">{form?.message}</p>
		{/if}
		{#if form?.error}
			<p class="alert variant-ghost-error">{form?.message} is missing!</p>
		{/if}
		<form class="grid grid-cols-2 gap-4" method="post" use:enhance bind:this={formElement}>
			<input class="input" readonly={true} type="text" value={data.bookingInfo['booking_id']} name="bookingId" hidden={true} />
			<label class="label">
				<span>Booking Reference No.</span>
				<input class="input" readonly={true} type="text" bind:value={data.bookingInfo['booking_ref']} name="bookingRef" />
			</label>

			<label class="label">
				<span>Booking Date</span>
				<input class="input" readonly={true} type="datetime-local" bind:value={data.bookingInfo['booking_datetime']} name="bookingDatetime"/>
			</label>

			<label class="label">
				<span>Number of Seats</span>
				<input class="input" readonly={readOnly} type="number" min="1" max="10" bind:value={data.bookingInfo['ticket_quantity']} name="seats" />
			</label>

			<label class="label">
				<span>Booking Status</span>
				{#if readOnly}
					<input class="input capitalize" readonly={true} type="text" bind:value={data.bookingInfo['status']}/>
				{:else}
					<select class="select" name="status" on:change={selectHandler} value={data.bookingInfo['status']}>
						<option value="booked">Booked</option>
						<option value="present">Present</option>
						<option value="absent">Absent</option>
						<option value="cancelled">Cancelled</option>
					</select>
				{/if}
			</label>

			<div class="grid grid-cols-subgrid gap-4 col-span-2">
				<div class="col-start-1">
					<label class="label">
						<span>Last Updated</span>
						<input class="input variant-ghost" readonly={true} type="datetime-local" bind:value={data.bookingInfo['last_updated']} />
					</label>
				</div>
			</div>

			<div class="grid grid-cols-subgrid gap-4 col-span-2">
				<div class="col-start-1">


					<label class="label" hidden={!data.bookingInfo['remark']}>
						<span>Reason for cancellation</span>
						{#if data.bookingInfo['remark']}
							<textarea class="textarea" rows="4" name="remark" readonly value={data.bookingInfo['remark']}/>
						{:else}
							<textarea class="textarea" rows="4" placeholder="Reason for cancellation" name="remark" required={!hideTextarea}/>
						{/if}
						</label>
				</div>
			</div>

			{#if (!readOnly)}
				<div class="grid grid-cols-6 gap-4">
					<button type="button" class="btn variant-filled-primary" on:click={() => {modalStore.trigger(amendBookingModal)}}>Save</button>
					<button type="button" class="btn variant-filled" on:click={() => {readOnly = true; hideTextarea = true}}>Cancel</button>
				</div>
			{/if}
		</form>


		<h3 class="h3">Event Details</h3>
		<div class="grid grid-cols-2 gap-4">

			<label class="label">
				<span>Event Name</span>
				<input class="input variant-ghost" readonly={true} type="text" bind:value={data.bookingInfo['event_name']} />
			</label>

			<label class="label">
				<span>Location</span>
				<input class="input variant-ghost" readonly={true} type="text" bind:value={data.bookingInfo['location']} />
			</label>

			<label class="label">
				<span>Event Start Date</span>
				<input class="input variant-ghost" readonly={true} type="datetime-local" bind:value={data.bookingInfo['start_datetime']} name="startDate"/>
			</label>

			<label class="label">
				<span>Event End Date</span>
				<input class="input variant-ghost" readonly={true} type="datetime-local" bind:value={data.bookingInfo['end_datetime']} name="endDate"/>
			</label>

		</div>

		<h3 class="h3">User Details</h3>
		<div class="grid grid-cols-2 gap-4">

			<label class="label">
				<span>Username</span>
				<input class="input variant-ghost" readonly={true} type="text" bind:value={data.bookingInfo['username']} />
			</label>

			<label class="label">
				<span>Full Name</span>
				<input class="input variant-ghost" readonly={true} type="text" bind:value={data.bookingInfo['fullname']} />
			</label>

		</div>

	{/if}
</div>