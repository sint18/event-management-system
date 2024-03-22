<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	// Stores
	import { getModalStore } from '@skeletonlabs/skeleton';

	// Props
	/** Exposes parent props to this component. */
	export let parent: SvelteComponent;

	const modalStore = getModalStore();

	let formData = {
		currentPassword: '',
		newPassword: '',
		confirmNewPassword: ''
	}

	// We've created a custom submit function to pass the response and close the modal.
	function onFormSubmit(): void {
		if ($modalStore[0].response) $modalStore[0].response(formData);
		modalStore.close();
	}

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm = 'space-y-4'
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<article>{$modalStore[0].body ?? '(body missing)'}</article>
		<!-- Enable for debugging: -->
		<form class="modal-form {cForm}" on:submit|preventDefault={onFormSubmit}>
			<label class="label">
				<span>Current Password</span>
				<input class="input" type="password" bind:value={formData.currentPassword} placeholder="Enter Current Password . . ."/>
			</label>
			<label class="label">
				<span>New Password</span>
				<input class="input" type="password" bind:value={formData.newPassword} placeholder="Enter New Password . . ."/>
			</label>
			<label class="label">
				<span>Confirm New Password</span>
				<input class="input" type="password" bind:value={formData.confirmNewPassword} placeholder="Confirm New Password . . ."/>
			</label>
			<footer class="modal-footer {parent.regionFooter}">
				<button class="btn variant-ghost-primary">Save</button>
				<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
			</footer>
		</form>
	</div>
{/if}