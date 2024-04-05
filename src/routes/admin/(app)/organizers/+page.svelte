<script lang="ts">
	import { Accordion, AccordionItem, Table } from '@skeletonlabs/skeleton';
	import { enhance } from '$app/forms';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import EditIcon from 'virtual:icons/mdi/create';
	import CreateIcon from 'virtual:icons/mdi/plus';
	import { setTableSource } from '$lib';

	export let data;
	export let form;
	let formElement: HTMLFormElement;
	let currentItemId: string;
	const modalStore = getModalStore();

	function selectionHandler(meta: CustomEvent) {
		currentItemId = meta.detail[0];
		formElement.action = '?/getOrg';
		formElement.requestSubmit();
	}

	$: tableSource = data.organizers.length != 0 ? setTableSource(Object.keys(data.organizers[0]), data.organizers) : undefined;

	// ---------- Modal Config -------------------
	const deleteModal: ModalSettings = {
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

	const activateModal: ModalSettings = {
		type: 'confirm',
		// Data
		title: 'Please Confirm Activation',
		body: 'Are you sure you wish to proceed?',
		buttonTextConfirm: 'Activate',
		// TRUE if confirm pressed, FALSE if cancel pressed
		response: (response: boolean) => {
			if (response) {
				formElement.action = '?/activate';
				formElement.requestSubmit();
			}
		}
	};

</script>
<div class="p-10 space-y-5 container h-full justify-center">
	<h2 class="h2">Event Categories</h2>
	<hr />
	{#if form?.success}
		<p class="alert variant-ghost-success">{form?.message}</p>
	{/if}
	{#if form?.error}
		<p class="alert variant-ghost-error">{form?.message}</p>
	{/if}
	<div class="grid grid-cols-2 gap-4">
		{#if tableSource}
			<div class="table-container">
				<Table source={tableSource} interactive={true} on:selected={selectionHandler}></Table>
			</div>
		{/if}


		<Accordion autocollapse>
			<AccordionItem open>
				<svelte:fragment slot="lead">
					<EditIcon></EditIcon>
				</svelte:fragment>
				<svelte:fragment slot="summary"><strong>Edit Organizer Information</strong></svelte:fragment>
				<svelte:fragment slot="content">
					<form class="space-y-5" method="post" bind:this={formElement} use:enhance={({ formData, action }) => {
						if(action.search === '?/getOrg' && currentItemId) {
							formData.set('orgId', currentItemId)
						}
					}}>
						<label class="label">
							<span>ID</span>
							<input class="input" type="number" name="orgId" placeholder="ID"
										 value={form?.organizerInfo ? form?.organizerInfo['id'] : ''} readonly />
						</label>

						<label class="label">
							<span>Category</span>
							<input class="input" name="name" type="text"
										 value={form?.organizerInfo ? form?.organizerInfo['organizer_name'] : ''}
										 placeholder="Category Name" />
						</label>

						<label class="label">
							<span>Description</span>
							<textarea class="textarea" rows="4"
												placeholder="Organization Details"
												name="description"
												value={form?.organizerInfo ? form?.organizerInfo['description'] : ''} />
						</label>

						<label class="label">
							<span>Last Updated</span>
							<input class="input" type="datetime-local"
										 value={form?.organizerInfo ? form?.organizerInfo['last_updated'] : ''}
										 placeholder="" readonly />
						</label>

						<div class="space-x-5">
							<button type="button" on:click={() => {modalStore.trigger(updateModal)}}
											class="btn variant-filled-primary">
								Update
							</button>

							<button type="reset" class="btn variant-ghost-surface">Reset</button>

							{#if form?.organizerInfo && form?.organizerInfo['active'] === true}
								<button type="button" on:click={() => {modalStore.trigger(deleteModal)}}
												class="btn variant-ghost-error">
									Delete
								</button>
							{/if}

							{#if form?.organizerInfo && form?.organizerInfo['active'] === false }
								<button type="button" on:click={() => {modalStore.trigger(activateModal)}}
												class="btn variant-ghost-primary">
									Activate
								</button>
							{/if}
						</div>

					</form>

				</svelte:fragment>
			</AccordionItem>
			<AccordionItem>
				<svelte:fragment slot="lead">
					<CreateIcon></CreateIcon>
				</svelte:fragment>
				<svelte:fragment slot="summary"><strong>Create New Organizer</strong></svelte:fragment>
				<svelte:fragment slot="content">
					<form class="space-y-5" method="post" action="?/create">

						<label class="label">
							<span>Category</span>
							<input class="input" name="name" type="text"
										 placeholder="Organization Name" />
						</label>

						<label class="label">
							<span>Description</span>
							<textarea class="textarea" rows="4" name="description"
												placeholder="Organization Details" />
						</label>

						<label class="label">
							<span>Status</span>
							<select class="select" name="status">
								<option value="true">Active</option>
								<option value="false">Inactive</option>
							</select>
						</label>

						<div class="space-x-5">
							<button type="submit" class="btn variant-filled-primary">
								Create
							</button>

							<button type="reset" class="btn variant-ghost-surface">Reset</button>
						</div>
					</form>

				</svelte:fragment>
			</AccordionItem>
			<!-- ... -->
		</Accordion>
	</div>


</div>