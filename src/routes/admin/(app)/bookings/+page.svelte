<script lang="ts">
	import { enhance } from '$app/forms';

	export let form

</script>
<div class="p-10 space-y-5 container h-full justify-center">
	<h2 class="h2">Booking Management</h2>
	<hr />
	<a href="bookings/create" class="btn variant-filled">Create A New Booking</a>
	<h3 class="h3">Booking Search</h3>
	{#if form?.error}
		<p class="alert variant-ghost-error">{form?.message}</p>
	{/if}
	<form class="space-y-5" method="post" use:enhance>
		<div class="grid grid-cols-2 gap-4">
			<label class="label">
				<span>Booking Ref</span>
				<input class="input" type="search" name="bookingRef" placeholder="Enter Booking Reference Number" required/>
			</label>
		</div>
		<div class="space-x-4">
			<button type="submit" class="btn variant-filled-primary">Search</button>
			<button type="reset" class="btn variant-filled-surface">Clear</button>
		</div>
	</form>
	<!--	<hr />-->
	<h3 class="h3">Search Result</h3>
	<!-- Responsive Container (recommended) -->
	<div class="table-container">
		<!-- Native Table Element -->
		<table class="table table-hover" >
				<thead>
				<tr>
					<th>Booking ID</th>
					<th>Booking Ref.</th>
					<th>Booking Date</th>
					<th>Seats</th>
					<th>Status</th>
					<th>Actions</th>
				</tr>
				</thead>
			<tbody>
			{#if form?.bookings}
				{#each form.bookings as row}
					<tr>
						<td>{row['booking_id']}</td>
						<td>{row['booking_ref']}</td>
						<td>{row['booking_datetime']}</td>
						<td>{row['ticket_quantity']}</td>
						<td class="capitalize">{row['status']}</td>
						<td>
							<a href="bookings/{row['booking_ref']}" class="btn btn-sm variant-filled-surface">View Details</a>
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