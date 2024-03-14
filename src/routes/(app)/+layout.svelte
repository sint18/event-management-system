<script>
	import { AppBar, AppShell } from '@skeletonlabs/skeleton';
</script>

<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<strong class="text-xl uppercase">Events</strong>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<span>up1234567</span>
				<button type="button" class="btn variant-filled-surface">Log Out</button>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
	<svelte:fragment slot="pageFooter">
		<div class="container mx-auto">
			<nav class="flex justify-center space-x-5">
				<a href="/" class="btn variant-filled">Home</a>
				<a href="/" class="btn variant-filled">Bookings</a>
				<a href="/" class="btn variant-filled">Account</a>
			</nav>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="footer">Footer</svelte:fragment>
</AppShell>