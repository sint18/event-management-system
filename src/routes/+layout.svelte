<script lang="ts">
	import '../app.postcss';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { Modal } from '@skeletonlabs/skeleton';
	import { initializeStores } from '@skeletonlabs/skeleton';

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	initializeStores();

	$: activeClass = (href: string) => {
		if (href === $page.url.pathname) {
			return '!bg-primary-500 text-slate-950'
		} else {
			return ''
		}
	}
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
		<div class="h-full p-4 space-y-4 bg-slate-600/75">
			<p class="font-bold pl-4 text-2xl">Dashboard</p>
			<nav class="list-nav">
				<ul>
					<li><a href="/" class={activeClass('/')}>Analytics</a></li>
				</ul>
			</nav>
			<hr class="border-stone-300">
			<p class="font-bold pl-4 text-2xl">Events</p>
			<nav class="list-nav">
				<ul>
					<li><a href="/events" class={activeClass('/events')}>View Events</a></li>
					<li><a href="/events/create" class={activeClass('/events/create')}>Create An Event</a></li>
				</ul>
			</nav>
			<hr class="border-stone-300">
			<p class="font-bold pl-4 text-2xl">Users</p>
			<nav class="list-nav">
				<ul>
					<li><a href="/users" class={activeClass('/users')}>User Search</a></li>
					<li><a href="/users/create" class={activeClass('/users/create')}>Register A User</a></li>
					<li><a href="/users/import" class={activeClass('/users/import')}>Import Users</a></li>
				</ul>
			</nav>
			<hr class="border-stone-300">
			<p class="font-bold pl-4 text-2xl">Bookings</p>
			<nav class="list-nav">
				<ul>
					<li><a href="/bookings" class={activeClass('/bookings')}>Bookings Search</a></li>
					<li><a href="/bookings/create" class={activeClass('/bookings/create')}>Create A Booking</a></li>
				</ul>
			</nav>
<!--			<nav class="list-nav">-->
<!--				<ul>-->
<!--					<li><a href="/">Dashboard</a></li>-->
<!--					<li><a href="/events">Manage Events</a></li>-->
<!--					<li><a href="/users">Manage Users</a></li>-->
<!--					<li><a href="/bookings">Manage Bookings</a></li>-->
<!--					&lt;!&ndash; <li><a href=""></a></li> &ndash;&gt;-->
<!--				</ul>-->
<!--			</nav>-->
		</div>
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
</AppShell>
