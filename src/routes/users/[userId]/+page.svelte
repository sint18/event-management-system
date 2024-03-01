<script lang="ts">
	import type { ModalSettings, PopupSettings } from '@skeletonlabs/skeleton';
	import { popup, getModalStore } from '@skeletonlabs/skeleton';
	import { invalidateAll } from '$app/navigation';
	import { enhance } from '$app/forms';

	export let data
	export let form
	let readOnly: boolean = true
	let formElement: HTMLFormElement
	const modelStore = getModalStore()

	$: active_class = data?.userInfo['account_status'] === 'active' ? 'variant-ghost-success' : 'variant-ghost-error'

	// ---------------- Functions ----------------------------

 function submitUpdateReq(response: boolean){
		if(response) {
			formElement.action = "?/updateUser"
			formElement.requestSubmit()
		}
 }

	function submitDeReq(response: boolean){
		if(response) {
			formElement.action = "?/deactivateUser"
			formElement.requestSubmit()
		}
	}

	function submitActivateReq(response: boolean){
		if(response) {
			formElement.action = "?/activateUser"
			formElement.requestSubmit()
		}
	}

	// ---------------- Dropdown Config ----------------------
	let comboboxValue: string = 'actions'

	const popupCombobox: PopupSettings = {
		event: 'click',
		target: 'popupCombobox',
		placement: 'right'
	};

	// --------------- Modal Config -------------------------
	const updateModal: ModalSettings = {
		type: 'confirm',
		// Data
		title: 'Please Confirm Update',
		body: 'Are you sure you wish to proceed?',
		buttonTextConfirm: 'Update',
		// TRUE if confirm pressed, FALSE if cancel pressed
		response: (r: boolean) => submitUpdateReq(r),
	};

	const deactModal: ModalSettings = {
		type: 'confirm',
		// Data
		title: 'Please Confirm Account Deactivation',
		body: 'Are you sure you wish to proceed?',
		buttonTextConfirm: 'Deactivate',
		// TRUE if confirm pressed, FALSE if cancel pressed
		response: (r: boolean) => submitDeReq(r),
	};

	const activateModal: ModalSettings = {
		type: 'confirm',
		// Data
		title: 'Please Confirm Account Activation',
		body: 'Are you sure you wish to proceed?',
		buttonTextConfirm: 'Activate',
		// TRUE if confirm pressed, FALSE if cancel pressed
		response: (r: boolean) => submitActivateReq(r),
	};

</script>
<!-- #TODO: view, edit and delete bookings of each user -->
<div class="p-10 space-y-5 container h-full justify-center">
	<button type="button" on:click={() => {history.back()}} class="btn variant-filled-surface">Back</button>
	<h2 class="h2">User Information</h2>
	<hr>

	{#if data.userInfo}

		<button class="btn variant-filled w-48 justify-between" use:popup={popupCombobox}>
			<span class="capitalize">{comboboxValue ?? 'Trigger'}</span>
		</button>

		<div class="card p-4" data-popup="popupCombobox">
			<div class="grid grid-cols-1 gap-2">
				<button type="button" class="btn bg-transparent" on:click={() => {invalidateAll(); readOnly = true}}>Refresh</button>
				<a href="/bookings/create?user={data.userInfo['username']}" class="btn bg-transparent">Create Booking</a>
				<button type="button" class="btn bg-transparent" on:click={() => {readOnly = false}}>Edit Information</button>
				{#if data.userInfo['account_status'] === 'active'}
					<button class="btn variant-ghost-error" on:click={() => modelStore.trigger(deactModal)}>Deactivate User</button>
				{:else}
					<button class="btn variant-ghost-success" on:click={() => modelStore.trigger(activateModal)}>Activate User</button>
				{/if}
<!--				<button class="btn variant-ghost-error">Delete User</button>-->
			</div>
		</div>
		{#if form?.success }
			{#if form?.message}
				<p class="alert variant-ghost-success">{form.message}</p>
			{/if}
		{/if}
		{#if form?.error }
			<p class="alert variant-ghost-error">{form.errMessage}</p>
		{/if}
		<form class="grid grid-cols-2 gap-4" method="post" use:enhance bind:this={formElement}>

			<label class="label">
				<span>User ID</span>
				<input name="userId" class="input" type="number" placeholder="" bind:value={data.userInfo['user_id']} readonly={true}/>
			</label>

			<label class="label">
				<span>Role</span>
				{#if readOnly}
					<input class="input uppercase" type="text" placeholder="" bind:value={data.userInfo['role_name']} readonly={true}/>
				{:else}
					{#if data.roles }
						<select name="roleId" class="select uppercase" bind:value={data.userInfo['role_id']} >
							{#each data.roles as row}
								<option class="uppercase" value={row['role_id']}>{row['role_name']}</option>
							{/each}
						</select>
					{/if}
				{/if}
			</label>


			<label class="label">
				<span>First Name</span>
				<input name="firstName" class="input" type="text" placeholder="Enter first name" bind:value={data.userInfo['first_name']} readonly={readOnly}/>
			</label>

			<label class="label">
				<span>Last Name</span>
				<input name="lastName" class="input" type="text" placeholder="Enter last name" bind:value={data.userInfo['last_name']} readonly={readOnly}/>
			</label>

			<label class="label">
				<span>User Name</span>
				<input name="username" class="input" type="text" placeholder="Enter username" bind:value={data.userInfo['username']} readonly={readOnly}/>
			</label>

			<label class="label">
				<span>Email Address</span>
				<input name="email" class="input" type="email" placeholder="Enter email address" bind:value={data.userInfo['email']} readonly={readOnly}/>
			</label>

			<label class="label">
				<span>Earned Points</span>
				<input class="input" type="number" placeholder="" bind:value={data.userInfo['points']} readonly={true}/>
			</label>

			<label class="label">
				<span>Account Status</span>
				<input class="input uppercase {active_class}" type="text" placeholder="" bind:value={data.userInfo['account_status']} readonly={true}/>
			</label>

			<label class="label">
				<span>Last Updated</span>
				<input class="input variant-ghost" type="datetime-local" placeholder="" bind:value={data.userInfo['last_updated']} readonly={true}/>
			</label>

			<label class="label">
				<span>Created Date</span>
				<input class="input variant-ghost" type="datetime-local" placeholder="" bind:value={data.userInfo['created_at']} readonly={true}/>
			</label>

			{#if !readOnly}
				<div class="grid grid-cols-6 gap-4">
					<button type="button" class="btn variant-filled-primary" on:click={() => modelStore.trigger(updateModal)}>Save</button>
					<button type="button" class="btn variant-filled" on:click={() => {invalidateAll(); readOnly = true}}>Cancel</button>
				</div>
			{/if}
		</form>
		<hr>
		<h3 class="h3">Bookings</h3>
		<!-- Responsive Container (recommended) -->
			<div class="table-container">
				<!-- Native Table Element -->
				<table class="table table-hover">
					<thead>
					<tr>
						<th>Booking ID</th>
						<th>Event</th>
						<th>Booking Date</th>
						<th>Seats</th>
						<th>Status</th>
						<th>Last Updated</th>
						<th></th>
					</tr>
					</thead>
					<tbody>
					{#if data.bookings?.length && data.bookings?.length > 0 }
						{#each data.bookings as row }
							<tr>
								<td>{row['booking_id']}</td>
								<td>{row['event_name']}</td>
								<td>{row['booking_datetime']}</td>
								<td>{row['ticket_quantity']}</td>
								<td class="capitalize">{row['status']}</td>
								<td>{row['last_updated']}</td>
								<td>
									<a href="/bookings/{row['booking_ref']}" class="btn btn-sm variant-filled-surface">View Details</a>
								</td>
							</tr>
						{/each}
					{:else}
						<tr>
							<td colspan="7" class="text-center">No data to display</td>
						</tr>
					{/if}
					</tbody>
				</table>
			</div>



	{/if}
</div>