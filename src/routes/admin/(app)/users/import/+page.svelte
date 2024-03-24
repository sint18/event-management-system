<script lang="ts">
	import { FileDropzone, ProgressRadial } from '@skeletonlabs/skeleton';
	import Papa from 'papaparse';
	import { enhance } from '$app/forms';

	export let form
	let csvFile: FileList;
	let fileUploaded: boolean = false;
	let formElement: HTMLFormElement;
	let sourceData: Array<object>;
	let loading: boolean = false;

	function onChangeHandler() {
		fileUploaded = true;

		const config = {
			header: true,
			skipEmptyLines: true,
			complete: (result: Papa.ParseResult<never>) => {
				if (result.data) {
					sourceData = result.data;
				}
			}
		};
		if (csvFile) {
			Papa.parse(csvFile[0], config);
		}
	}

	function formatBytes(bytes: number, decimals = 2) {
		if (!+bytes) return '0 Bytes';

		const k = 1024;
		const dm = decimals < 0 ? 0 : decimals;
		const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

		const i = Math.floor(Math.log(bytes) / Math.log(k));

		return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
	}

	function clearTable() {
		sourceData = [];
	}

</script>
<div class="p-10 space-y-5 h-full container justify-center">
	<h2 class="h2">Import User Accounts</h2>
	<hr>
	{#if form?.success}
		<p class="alert variant-ghost-success">{form.message}</p>
	{/if}
	{#if form?.error}
		<p class="alert variant-ghost-error">{form.message}</p>
	{/if}
	<form method="post" use:enhance={({formData}) => {
		loading = true
		formData.append('parsedData', JSON.stringify(sourceData))
		return async ({update}) => {
			await update()
			loading = false
		}
	}} bind:this={formElement} enctype="multipart/form-data">
		<FileDropzone name="csvFile" bind:files={csvFile} accept=".csv" on:change={onChangeHandler} required>
			<svelte:fragment slot="meta">CSV allowed</svelte:fragment>
		</FileDropzone>

		{#if csvFile && fileUploaded && sourceData}
			<dl class="divide-y divide-slate-700">
				<div class="grid grid-cols-2 gap-4 py-6">
					<dt class="font-bold">File Name</dt>
					<dd>{csvFile[0].name}</dd>
				</div>

				<div class="grid grid-cols-2 gap-4 py-6">
					<dt class="font-bold">File Type</dt>
					<dd>{csvFile[0].type}</dd>
				</div>

				<div class="grid grid-cols-2 gap-4 py-6">
					<dt class="font-bold">File Size</dt>
					<dd>{formatBytes(csvFile[0].size)}</dd>
				</div>

				<div class="grid grid-cols-2 gap-4 py-6">
					<dt class="font-bold">Headers</dt>
					<dd>
						{Object.keys(sourceData[0]).join(', ')}
					</dd>
				</div>

				<div class="grid grid-cols-2 gap-4 py-6">
					<dt class="font-bold">Row Count</dt>
					<dd>{sourceData.length}</dd>
				</div>

			</dl>
			<button type="submit" class="btn variant-filled-primary" disabled={loading}>Import</button>
			<button type="reset" class="btn variant-filled-surface" on:click={() => {clearTable}} disabled={loading}>Clear</button>
		{/if}
	</form>

	<div class="space-y-5" hidden={!loading}>
		<h2 class="h2">Importing, Please Wait!</h2>
		<ProgressRadial></ProgressRadial>
	</div>

<!--	Information and Example -->
	<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
		<div>
			<p>The CSV file must include the following headers and data.</p>
			<ol class="list">
				<li>
					<span>1.</span>
					<span class="flex-auto">First Name in the format of 'firstName'.</span>
				</li>
				<li>
					<span>2.</span>
					<span class="flex-auto">Last Name in the format of 'lastName'.</span>
				</li>
				<li>
					<span>3.</span>
					<span class="flex-auto">Username in the format of 'username'.</span>
				</li>
				<li>
					<span>4.</span>
					<span class="flex-auto">Password in the format of 'password'.</span>
				</li>
				<li>
					<span>5.</span>
					<span class="flex-auto">Email in the format of 'email'.</span>
				</li>
				<li>
					<span>6.</span>
					<span class="flex-auto">User's role in the format of 'role'.</span>
				</li>
				<!-- ... -->
			</ol>
		</div>

		<!-- Responsive Container (recommended) -->
<!--		<div class="table-container">-->
<!--			&lt;!&ndash; Native Table Element &ndash;&gt;-->
<!--			<table class="table table-hover">-->
<!--				<caption class="caption-top">-->
<!--					An example of an accepted format of CSV file-->
<!--				</caption>-->
<!--				<thead>-->
<!--				<tr>-->
<!--					<th>firstName</th>-->
<!--					<th>lastName</th>-->
<!--					<th>email</th>-->
<!--					<th>username</th>-->
<!--					<th>password</th>-->
<!--					<th>tole</th>-->
<!--				</tr>-->
<!--				</thead>-->
<!--				<tbody>-->
<!--					<tr>-->
<!--						<td>John</td>-->
<!--						<td>Doe</td>-->
<!--						<td>john.doe@gmail.com</td>-->
<!--						<td>1234567</td>-->
<!--						<td>password hash</td>-->
<!--						<td>user</td>-->
<!--					</tr>-->
<!--				</tbody>-->
<!--			</table>-->
<!--		</div>-->


	</div>

	<!--	{#if headers !== undefined && sourceData !== undefined }-->
	<!--		<Table source={{ head: headers, body: tableMapperValues(sourceData, headers)}}></Table>-->
	<!--&lt;!&ndash;		<Table source={{ head: headers, body: sourceData}}></Table>&ndash;&gt;-->
	<!--	{/if}-->

</div>