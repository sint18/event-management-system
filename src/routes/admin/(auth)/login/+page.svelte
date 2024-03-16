<script lang="ts">
	import { enhance } from '$app/forms';

	export let form

</script>
<div class="card p-10">
	<header class="card-header text-center space-y-4">
		<h2 class="h2">Event Management System</h2>
	</header>
	<section class="p-4">
		<form class="space-y-4" method="post" use:enhance>
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
				<button type="reset" class="btn variant-filled">Cancel</button>
			</div>

		</form>
	</section>
	<footer class="card-footer">
		<a href="#">Forgot Password or Username?</a>
	</footer>
</div>