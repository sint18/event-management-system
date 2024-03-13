<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { popup, getModalStore } from '@skeletonlabs/skeleton';
	import type { PopupSettings, ModalSettings } from '@skeletonlabs/skeleton';

	export let data;
	export let form;
	let readOnlyInputs: boolean = true;
	let formElement: HTMLFormElement;
	const modalStore = getModalStore();

	// --------------- Functions ----------------------
	function resetForm() {
		invalidateAll();
		readOnlyInputs = true;
	}

	// ---------- Modal Config -------------------
	const modal: ModalSettings = {
		type: 'confirm',
		// Data
		title: 'Please Confirm Deletion',
		body: 'Are you sure you wish to proceed?',
		buttonTextConfirm: 'Delete',
		// TRUE if confirm pressed, FALSE if cancel pressed
		response: (response: boolean) => {
			if (response) {
				formElement.action = '?/delete';
				formElement.requestSubmit();
			}
		}
	};

	const updateModal: ModalSettings = {
		type: 'confirm',
		// Data
		title: 'Please Confirm Update',
		body: 'Are you sure you wish to proceed?',
		buttonTextConfirm: 'Update',
		// TRUE if confirm pressed, FALSE if cancel pressed
		response: (response: boolean) => {
			if (response) {
				formElement.action = '?/update';
				formElement.requestSubmit();
			}
		}
	};

	// ------------ Dropdown Config --------------
	let comboboxValue: string = 'actions';

	const popupCombobox: PopupSettings = {
		event: 'click',
		target: 'popupCombobox',
		placement: 'right'
	};

</script>
<div class="p-10 space-y-5 container h-full justify-center">
	<button type="button" on:click={() => {history.back()}} class="btn variant-filled-surface">Back</button>

	<h2 class="h2">Event Information</h2>
	{#if data.eventInfo }

		<button class="btn variant-filled w-48 justify-between" use:popup={popupCombobox}>
			<span class="capitalize">{comboboxValue ?? 'Trigger'}</span>
		</button>

		<div class="card p-4 w-48" data-popup="popupCombobox">
			<div class="grid grid-cols-1 gap-2">
				<button type="button" class="btn bg-transparent" on:click={() => resetForm()}>Refresh</button>
				<button type="button" class="btn bg-transparent" on:click={() => {readOnlyInputs = false}}>Edit Information
				</button>
				<button on:click={() => {modalStore.trigger(modal)}} class="btn variant-ghost-error">Delete Event</button>
			</div>
		</div>

		{#if form?.success }
			<p class="alert variant-ghost-success">Record Successfully Updated!</p>
		{/if}
		{#if form?.missing}
			<p class="alert variant-ghost-error">{form?.item} is missing!</p>
		{/if}
		<form class="grid grid-cols-2 gap-4" method="post" use:enhance bind:this={formElement}>
			<!--		#TODO: Implement adding multimedia for events-->
			<input class="input" readonly={true} type="text" value={data.eventInfo['event_id']} name="eventId"
						 hidden={true} />
			<label class="label">
				<span>Event Name</span>
				<input class="input" readonly={readOnlyInputs} type="text" bind:value={data.eventInfo['event_name']}
							 name="eventName" placeholder="Enter name of the event" />
			</label>

			<label class="label">
				<span>Event Location</span>
				<input class="input" readonly={readOnlyInputs} type="text" bind:value={data.eventInfo['location']}
							 name="location" placeholder="Enter name of the location" />
			</label>

			<label class="label">
				<span>Event Start Date</span>
				<input class="input" readonly={readOnlyInputs} type="datetime-local"
							 bind:value={data.eventInfo['start_datetime']} name="startDate" />
			</label>
			<label class="label">
				<span>Event End Date</span>
				<input class="input" readonly={readOnlyInputs} type="datetime-local" bind:value={data.eventInfo['end_datetime']}
							 name="endDate" />
			</label>
			<label class="label">
				<span>Event Duration</span>
				<input class="input variant-ghost" readonly={true} type="text" bind:value={data.eventInfo['duration']} />
			</label>
			<label class="label">
				<span>Event Status</span>
				{#if readOnlyInputs}
					<input class="input capitalize" readonly={readOnlyInputs} type="text" bind:value={data.eventInfo['status']} />
				{:else}
					<select class="select" name="status" value={data.eventInfo['status']} disabled={readOnlyInputs}>
						<option value="upcoming">Upcoming</option>
						<option value="past">Past</option>
						<option value="canceled">Canceled</option>
					</select>
				{/if}
			</label>
			<label class="label">
				<span>Last Updated</span>
				<input class="input variant-ghost" readonly={true} type="datetime-local"
							 bind:value={data.eventInfo['last_updated']} />
			</label>
			<label class="label">
				<span>Created Date</span>
				<input class="input variant-ghost" readonly={true} type="datetime-local"
							 bind:value={data.eventInfo['created_at']} />
			</label>

			<div class="grid grid-cols-subgrid gap-4 col-span-2">
				<div class="col-start-1">
					<label class="label">
						<span>Description</span>
						<textarea class="textarea" readonly={readOnlyInputs} rows="4" bind:value={data.eventInfo['description']}
											name="description" placeholder="Enter a short description about the event" />
					</label>
				</div>
			</div>

			{#if (!readOnlyInputs)}
				<div class="grid grid-cols-6 gap-4">
					<button type="button" class="btn variant-filled-primary" on:click={() => modalStore.trigger(updateModal)}>
						Save
					</button>
					<button type="button" on:click={() => resetForm()} class="btn variant-filled">Cancel</button>
				</div>
			{/if}

		</form>
	{/if}
</div>