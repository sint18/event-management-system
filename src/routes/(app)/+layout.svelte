<script lang="ts">
	import { AppBar, AppShell } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	import HomeIcon from 'virtual:icons/mdi/home'
	import BookIcon from 'virtual:icons/mdi/calendar-check'
	import AccIcon from 'virtual:icons/mdi/account'

	$: activeClass = (href: string) => {return $page.url.pathname === href ? 'variant-filled' : ''}
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
	<svelte:fragment slot="footer">
		<div class="container mx-auto p-4">
			<nav class="flex justify-center space-x-5">
				<a href="/" class="btn btn-lg {activeClass('/')}">
					<span><HomeIcon class="text-xl"></HomeIcon></span>
					<span class="hidden md:block">Home</span>
				</a>
				<a href="/bookings" class="btn btn-lg {activeClass('/bookings')}">
					<span><BookIcon class="text-xl"></BookIcon></span>
					<span class="hidden md:block">Bookings</span>
				</a>
				<a href="/account" class="btn btn-lg {activeClass('/account')}">
					<span><AccIcon class="text-xl"></AccIcon></span>
					<span class="hidden md:block">Account</span>
				</a>
			</nav>
		</div>
	</svelte:fragment>
</AppShell>