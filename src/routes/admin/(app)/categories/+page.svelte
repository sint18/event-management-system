<script lang="ts">
	import { Accordion, AccordionItem, Table, tableMapperValues, type TableSource } from '@skeletonlabs/skeleton';
	import { enhance } from '$app/forms';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import EditIcon from 'virtual:icons/mdi/create'
	import CreateIcon from 'virtual:icons/mdi/plus'
	import { setTableSource } from '$lib';

	export let data;
	export let form;
	let formElement: HTMLFormElement;
	let currentItemId: string;
	const modalStore = getModalStore();

	function selectionHandler(meta: CustomEvent) {
		currentItemId = meta.detail[0];
		formElement.action = '?/getCategory';
		formElement.requestSubmit();
	}

	$: tableSource = data.categories.length != 0 ? setTableSource(Object.keys(data.categories[0]), data.categories) : undefined;

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
				<svelte:fragment slot="lead"><EditIcon></EditIcon></svelte:fragment>
				<svelte:fragment slot="summary"><strong>Edit Category Information</strong></svelte:fragment>
				<svelte:fragment slot="content">
					<form class="space-y-5" method="post" bind:this={formElement} use:enhance={({ formData, action }) => {
						if(action.search === '?/getCategory' && currentItemId) {
							formData.set('categoryId', currentItemId)
						}
					}}>
						<label class="label">
							<span>ID</span>
							<input class="input" type="number" name="categoryId" placeholder="ID"
										 value={form?.categoryInfo ? form?.categoryInfo['id'] : ''} readonly />
						</label>

						<label class="label">
							<span>Category</span>
							<input class="input" name="name" type="text"
										 value={form?.categoryInfo ? form?.categoryInfo['category_name'] : ''}
										 placeholder="Category Name" />
						</label>

						<label class="label">
							<span>Last Updated</span>
							<input class="input" type="datetime-local"
										 value={form?.categoryInfo ? form?.categoryInfo['last_updated'] : ''}
										 placeholder="" readonly />
						</label>
						<div class="space-x-5">
							<button type="button" on:click={() => {modalStore.trigger(updateModal)}} class="btn variant-filled-primary">
								Update
							</button>

							<button type="reset" class="btn variant-ghost-surface">Reset</button>

							{#if form?.categoryInfo && form?.categoryInfo['active'] === true}
								<button type="button" on:click={() => {modalStore.trigger(deleteModal)}} class="btn variant-ghost-error">
									Delete
								</button>
							{/if}

							{#if form?.categoryInfo && form?.categoryInfo['active'] === false }
								<button type="button" on:click={() => {modalStore.trigger(activateModal)}} class="btn variant-ghost-primary">
									Activate
								</button>
							{/if}
						</div>

					</form>

				</svelte:fragment>
			</AccordionItem>
			<AccordionItem>
				<svelte:fragment slot="lead"><CreateIcon></CreateIcon></svelte:fragment>
				<svelte:fragment slot="summary"><strong>Create New Category</strong></svelte:fragment>
				<svelte:fragment slot="content">
					<form class="space-y-5" method="post" action="?/create">

						<label class="label">
							<span>Category</span>
							<input class="input" name="name" type="text"
										 placeholder="Category Name" />
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