<script lang="ts">
	export let data
</script>
<div class="p-5 space-y-5 container mx-auto h-full justify-center">
	{#if data.eventInfo }
		<h2 class="h2">{data.eventInfo['event_name']}</h2>
		<h3 class="h3">Description</h3>
		<p>{data.eventInfo['description']}</p>

		<hr>
		<h3 class="h5">Information</h3>

		<div class="table-container">
			<table class="table variant-ghost">
				<tbody>
				<tr>
					<th>Start Date</th>
					<td>{data.eventInfo['start_datetime']}</td>
				</tr>

				<tr>
					<th>End Date</th>
					<td>{data.eventInfo['end_datetime']}</td>
				</tr>

				<tr>
					<th>Duration</th>
					<td>{data.eventInfo['duration']}</td>
				</tr>

				<tr>
					<th>Location</th>
					<td>{data.eventInfo['location']}</td>
				</tr>

				<tr>
					<th>Status</th>
					<td>{data.eventInfo['status']}</td>
				</tr>

				</tbody>
			</table>
		</div>

		<form method="post">
			<input name="eventId" value="{data.eventInfo['event_id']}" hidden>
			<button class="btn variant-filled-primary" disabled={!(data.eventInfo['status'] === 'upcoming')}>Book Event</button>
		</form>

	{/if}
</div>