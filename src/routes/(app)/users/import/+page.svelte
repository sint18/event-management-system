<script lang="ts">
	import { FileDropzone } from '@skeletonlabs/skeleton';
	import { Table } from '@skeletonlabs/skeleton';
	import { tableMapperValues } from '@skeletonlabs/skeleton';
	import type { TableSource } from '@skeletonlabs/skeleton';
	import Papa from 'papaparse';
	import { enhance } from '$app/forms';

	let csvFile: FileList
	let fileUploaded: boolean = false
	let formElement: HTMLFormElement
	let headers: string[]
	let sourceData: string[]

	// function parseFile() {
	// 	const config = {
	// 		headers: false,
	// 		complete: (result: Papa.ParseResult<any>, file: File) => {
	// 			if (result.data) {
	// 				console.log(result.data[0]);
	// 				sourceData = result.data.slice(1, result.data.length - 1);
	// 				headers = result.data[0];
	// 			}
	// 		}
	// 	};
	// 	Papa.parse(csvFile[0], config);
	// }

	function onChangeHandler() {
		fileUploaded = true

		const config = {
			headers: false,
			complete: (result: Papa.ParseResult<any>, file: File) => {
				if (result.data) {
					sourceData = result.data.slice(1, result.data.length - 1)
					headers = result.data[0]
				}
			}
		}
		if (csvFile) {
			Papa.parse(csvFile[0], config)
		}

	}

	function clearTable() {
		headers = []
		sourceData = []
	}

</script>
<div class="p-10 space-y-5 h-full container justify-center">
	<h2 class="h2">Import User Accounts</h2>
	<hr>

	<form method="post" use:enhance enctype="multipart/form-data" bind:this={formElement}>
		<FileDropzone name="csvFile" bind:files={csvFile} accept=".csv" on:change={onChangeHandler} required>
			<svelte:fragment slot="meta">CSV allowed</svelte:fragment>
		</FileDropzone>

		{#if csvFile && fileUploaded && sourceData}
			<dl class="list-dl">
				<div class="flex-auto">
					<dt class="font-bold">File Name :</dt>
					<dd>{csvFile[0].name}</dd>
				</div>

				<div class="flex-auto">
					<dt class="font-bold">File Type :</dt>
					<dd>{csvFile[0].type}</dd>
				</div>

				<div class="flex-auto">
					<dt class="font-bold">File Size :</dt>
					<dd>{csvFile[0].size}</dd>
				</div>

				<div class="flex-auto">
					<dt class="font-bold">Headers : </dt>
					<dd class="space-x-4">
						{#if headers}
							{#each headers as item}
								<span class="chip variant-filled capitalize">{item}</span>
							{/each}
						{/if}
					</dd>
				</div>

				<div class="flex-auto">
					<dt class="font-bold">Row Count : </dt>
					<dd>{sourceData.length}</dd>
				</div>

			</dl>
			<button type="submit" class="btn variant-filled-primary">Import</button>
			<button type="reset" class="btn variant-filled-surface" on:click={() => {clearTable}}>Clear</button>
		{/if}
	</form>

<!--	{#if headers !== undefined && sourceData !== undefined }-->
<!--		<Table source={{ head: headers, body: tableMapperValues(sourceData, headers)}}></Table>-->
<!--&lt;!&ndash;		<Table source={{ head: headers, body: sourceData}}></Table>&ndash;&gt;-->
<!--	{/if}-->

</div>