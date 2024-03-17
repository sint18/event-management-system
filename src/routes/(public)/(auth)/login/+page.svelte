<script lang="ts">
	import { enhance } from '$app/forms';

	export let form
</script>
<form class="space-y-4" method="post" use:enhance>
	<div class="text-center">
		<h3 class="h3">Login</h3>
	</div>
	{#if form?.error}
		<p class="alert variant-ghost-error">{form.message}</p>
	{/if}

	<label class="label">
		<span>Username</span>
		<input class="input" type="text" name="username" placeholder="Enter Username . . ." />
	</label>

	<label class="label">
		<span>Password</span>
		<input class="input" type="password" name="password" placeholder="Enter Password . . ." />
	</label>

	<div class="space-x-4">
		<button type="submit" class="btn variant-filled-primary">Login</button>
		<button type="reset" on:click={() => {history.back()}} class="btn variant-filled">Cancel</button>
	</div>

</form>
