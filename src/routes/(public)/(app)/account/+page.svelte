<script lang="ts">
	import { enhance } from '$app/forms';
	import { checkStatus } from '$lib';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { ModalComponent, ModalSettings } from '@skeletonlabs/skeleton';
	import ChangePasswordModal from '$lib/ChangePasswordModal.svelte';
	import type { PasswordForm } from '$lib/server/types';


	export let data;
	export let form
	let formElement: HTMLFormElement;
	let passwordFormData: PasswordForm;
	const modalComponent: ModalComponent = { ref: ChangePasswordModal };
	const modalStore = getModalStore();

	const changePasswordModal: ModalSettings = {
		type: 'component',
		component: modalComponent,
		// Data
		title: 'Change Password',
		body: 'You need to know the current password in order to change it to a new one.',
		response: (r) => {
			if (r) {
				passwordFormData = r;
				formElement.action = '?/changePassword';
				formElement.requestSubmit();
			}
		}
	};
</script>
<div class="p-5 space-y-5 container mx-auto h-full justify-center">
	<h1 class="h1">Account Details</h1>
	{#if data.userInfo}
		<div>
			<dl class="divide-y divide-slate-700">
				<div class="grid grid-cols-2 gap-4 py-6">
					<dt>Name</dt>
					<dd>{data.userInfo['fullname']}</dd>
				</div>
				<div class="grid grid-cols-2 gap-4 py-6">
					<dt>Username</dt>
					<dd>{data.userInfo['username']}</dd>
				</div>
				<div class="grid grid-cols-2 gap-4 py-6">
					<dt>Email</dt>
					<dd>{data.userInfo['email']}</dd>
				</div>
				<div class="grid grid-cols-2 gap-4 py-6">
					<dt>Points Earned</dt>
					<dd>{data.userInfo['points']}</dd>
				</div>
			</dl>
		</div>
	{/if}
	<hr>
	<h2 class="h2">Settings</h2>
	{#if form?.error}
		<p class="alert variant-ghost-error">{form.message}</p>
	{/if}
	{#if form?.success}
		<p class="alert variant-ghost-success">{form.message}</p>
	{/if}
	<form class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4" method="post" bind:this={formElement} use:enhance={({formData}) => {
		formData.append('newPassword', passwordFormData.newPassword)
		formData.append('currentPassword', passwordFormData.currentPassword)
		formData.append('confirmNewPassword', passwordFormData.confirmNewPassword)
	}}>
		<button type="button" on:click={() => {modalStore.trigger(changePasswordModal)}} class="btn variant-filled-surface">
			Change Password
		</button>
		<button type="button" class="btn variant-filled-surface">Update Email</button>
	</form>
</div>