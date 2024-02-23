<script lang="ts">
	import '../app.postcss';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { Modal } from '@skeletonlabs/skeleton';
	import { initializeStores } from '@skeletonlabs/skeleton';

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	initializeStores();
</script>

<Modal />
<!-- <AppShell>...</AppShell> -->
<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<strong class="text-xl uppercase">Event Management System</strong>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<span>Admin</span>
				<button type="button" class="btn variant-filled-surface">Log Out</button>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<div class="h-full p-4 bg-slate-600/75">
			<nav class="list-nav">
				<ul>
					<li><a href="/">Dashboard</a></li>	
					<li><a href="/events">Manage Events</a></li>
					<li><a href="/users">Manage Users</a></li>
					<!-- <li><a href=""></a></li> -->
					<!-- <li><a href=""></a></li> -->
				</ul>
			</nav>
		</div>
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
</AppShell>
