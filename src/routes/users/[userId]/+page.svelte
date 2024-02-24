<script lang="ts">
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import { popup } from '@skeletonlabs/skeleton';
	import { invalidateAll } from '$app/navigation';

	export let data
	let readOnly: boolean = true

	// ---------------- Dropdown Config ----------------------
	let comboboxValue: string = 'actions'

	const popupCombobox: PopupSettings = {
		event: 'click',
		target: 'popupCombobox',
		placement: 'right'
	};

</script>
<!-- #TODO: view, edit and delete bookings of each user -->
<div class="p-10 space-y-5 container h-full justify-center">
	<button type="button" on:click={() => {history.back()}} class="btn variant-filled-surface">Back</button>
	<h2 class="h2">User Information</h2>

	{#if data.userInfo}

		<button class="btn variant-filled w-48 justify-between" use:popup={popupCombobox}>
			<span class="capitalize">{comboboxValue ?? 'Trigger'}</span>
		</button>

		<div class="card p-4 w-48" data-popup="popupCombobox">
			<div class="grid grid-cols-1 gap-2">
				<button type="button" class="btn bg-transparent">Refresh</button>
				<button type="button" class="btn bg-transparent" on:click={() => {readOnly = false}}>Edit Information</button>
				<button class="btn variant-ghost-error">Delete User</button>
			</div>
		</div>

		<div class="grid grid-cols-2 gap-4">

			<label class="label">
				<span>User ID</span>
				<input class="input" type="number" placeholder="" value={data.userInfo['user_id']} readonly={true}/>
			</label>

			<label class="label">
				<span>Role</span>
				<input class="input uppercase" type="text" placeholder="" value={data.userInfo['role_name']} readonly={true}/>
			</label>

			<label class="label">
				<span>First Name</span>
				<input class="input" type="text" placeholder="" value={data.userInfo['first_name']} readonly={readOnly}/>
			</label>

			<label class="label">
				<span>Last Name</span>
				<input class="input" type="text" placeholder="" value={data.userInfo['last_name']} readonly={readOnly}/>
			</label>

			<label class="label">
				<span>User Name</span>
				<input class="input" type="text" placeholder="" value={data.userInfo['username']} readonly={readOnly}/>
			</label>

			<label class="label">
				<span>Email Address</span>
				<input class="input" type="email" placeholder="" value={data.userInfo['email']} readonly={readOnly}/>
			</label>

			<div class="grid grid-cols-subgrid gap-4 col-span-2">
				<div class="col-start-1">
					<label class="label">
						<span>Earned Points</span>
						<input class="input" type="number" placeholder="" value={data.userInfo['points']} readonly={true}/>
					</label>
				</div>
			</div>

			<label class="label">
				<span>Last Updated</span>
				<input class="input variant-ghost" type="datetime-local" placeholder="" value={data.userInfo['last_updated']} readonly={true}/>
			</label>

			<label class="label">
				<span>Created Date</span>
				<input class="input variant-ghost" type="datetime-local" placeholder="" value={data.userInfo['created_at']} readonly={true}/>
			</label>

			{#if !readOnly}
				<div class="grid grid-cols-6 gap-4">
					<button type="button" class="btn variant-filled-primary">Save</button>
					<button type="button" class="btn variant-filled" on:click={() => {invalidateAll(); readOnly = true}}>Cancel</button>
				</div>
			{/if}
		</div>
	{/if}
</div>