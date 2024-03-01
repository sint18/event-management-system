<script lang="ts">
	import { enhance } from '$app/forms';

	export let data
	export let form

</script>
<div class="p-10 space-y-5 container h-full justify-center">
	<h2 class="h2">User Management</h2>
	<hr />
	<a href="users/create" class="btn variant-filled">Create A New User</a>
	<a href="users/import" class="btn variant-filled float-end">Import</a>
	<h3 class="h3">User Search</h3>
	{#if form?.error}
		<p class="alert variant-ghost-error">{form?.errMessage}</p>
	{/if}
	<form class="space-y-5" method="post" use:enhance>
		<div class="grid grid-cols-2 gap-4">
			<label class="label">
				<span>First Name</span>
				<input class="input" type="text" name="firstName" placeholder="Enter First Name" />
			</label>
			<label class="label">
				<span>Last Name</span>
				<input class="input" type="text" name="lastName" placeholder="Enter Last Name" />
			</label>
			<label class="label">
				<span>Username</span>
				<input class="input" type="search" name="username" placeholder="Enter Username" />
			</label>
		</div>
		<button type="submit" class="btn variant-filled-surface">Search</button>
		<button type="reset" class="btn variant-filled-surface">Clear</button>
	</form>
<!--	<hr />-->
	<h3 class="h3">Search Result</h3>
	<!-- Responsive Container (recommended) -->
	<div class="table-container">
		<!-- Native Table Element -->
		<table class="table table-hover" >
			{#if data.colHeaders}
				<thead>
				<tr>
					{#each data.colHeaders as i}
						<th>{i}</th>
					{/each}
					<th>Actions</th>
				</tr>
				</thead>
			{/if}
			<tbody>
			{#if form?.userInfo}
			{#each form.userInfo as row}
				<tr>
					<td>{row['user_id']}</td>
					<td>{row['username']}</td>
					<td>{row['first_name']}</td>
					<td>{row['last_name']}</td>
					<td>{row['email']}</td>
					<td>{row['points']}</td>
					<td>
							<a href="users/{row['user_id']}" class="btn btn-sm variant-filled-surface">View Details</a>
					</td>
				</tr>
			{/each}
				{:else}
				<tr>
					<td colspan="7" class="text-lg text-center">No data to display</td>
				</tr>
			{/if}
			</tbody>
		</table>
	</div>

</div>