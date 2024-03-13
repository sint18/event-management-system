<script lang="ts">
	import { enhance } from '$app/forms'

	export let form
	export let data
</script>
<div class="p-10 space-y-5 h-full container justify-center">
	<h2 class="h2">User Registration</h2>
	<hr>
	{#if form?.success}
		<p class="alert variant-ghost-success">{form?.message}</p>
	{/if}
	{#if form?.error}
		<p class="alert variant-ghost-error">{form?.message}</p>
	{/if}
	<form class="grid grid-cols-2 gap-4" method="post" use:enhance>
		<label class="label">
			<span>First Name</span>
			<input class="input" type="text" name="firstName" placeholder="Enter first name" required/>
		</label>

		<label class="label">
			<span>Last Name</span>
			<input class="input" type="text" name="lastName" placeholder="Enter last name" required/>
		</label>

		<label class="label">
			<span>Username</span>
			<input class="input" type="text" name="username" placeholder="Enter username" required/>
		</label>

		<label class="label">
			<span>Email</span>
			<input class="input" type="email" name="email" placeholder="Enter email address" required/>
		</label>

		<div class="grid grid-cols-2 gap-4">
			<label class="label">
				<span>Password</span>
				<input class="input" type="password" name="password" placeholder="Enter Password" required/>
			</label>
			<label class="label">
				<span>Confirm Password</span>
				<input class="input" type="password" name="confirmPassword" placeholder="Enter Confirm Password" required/>
			</label>
		</div>

		<label class="label">
			<span>Role</span>
			{#if data.roles }
				<select name="roleId" class="select uppercase" required>
					{#each data.roles as row}
						<option class="uppercase" value={row['role_id']}>{row['role_name']}</option>
					{/each}
				</select>
			{/if}
		</label>
		
		<div class="grid grid-cols-6 gap-4">
			<button type="submit" class="btn variant-filled-primary">Create</button>
			<button type="reset" class="btn variant-filled">Cancel</button>
		</div>

	</form>

</div>