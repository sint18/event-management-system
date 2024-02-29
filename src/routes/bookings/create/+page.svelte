<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';

	export let form
	export let data
	let formElement: HTMLFormElement

	const usernameParam = $page.url.searchParams.get('user') ?? ''
	function checkUsername(){
		formElement.action = "?/checkUsername"
		formElement.requestSubmit()
	}

	function book() {
		formElement.action = "?/book"
		formElement.requestSubmit()
	}

	
</script>
<div class="p-10 space-y-5 container h-full justify-center">
	<button type="button" on:click={() => {history.back()}} class="btn variant-filled-surface">Back</button>
	<h2 class="h2">Create Booking</h2>
	<hr>
	{#if form?.success}
		<aside class="alert variant-ghost-success">
			<!-- Message -->
			<div class="alert-message">
				<p>Booking successful for user: {form?.user}.</p>
			</div>
			<!-- Actions -->
			<div class="alert-actions"><a href="{form?.bookingId}" class="btn variant-filled-surface">View Booking</a></div>
		</aside>
	{/if}
	{#if form?.error}
		<p class="alert variant-ghost-error">{form?.errMsg}</p>
	{/if}

	<form class="grid grid-cols-2 gap-4" method="post"
		use:enhance={() => {
  			return ({ update }) => update({ reset: false });
			}
		}
	bind:this={formElement}>
		<!--		#TODO: Show first name and last name automatically for confirmation-->

		<label class="label">
			<span>Username</span>
			<input class="input" type="text" name="username" placeholder="Enter username" value={usernameParam} required/>
		</label>
		<input class="input" type="number" name="userId" value={form?.userId} hidden={true}/>

		<label class="label">
			<span>User</span>
			<input class="input" type="text" name="user" placeholder="..." value={form?.userInfo ?? ''} readonly={true} />
		</label>

		<div class="col-span-2 col-start-1">
			<button type="button" class="btn variant-filled" on:click={checkUsername}>Find User</button>
		</div>

		{#if data.events }
			<label class="label">
				<span>Event</span>
				<select class="select" name="eventId">
					{#each data.events as row}
						<option value={row['event_id']}>{row['event_id']} - {row['event_name']}</option>
					{/each}
				</select>
			</label>
		{/if}


		<label class="label">
			<span>Ticket Quantity</span>
			<input class="input" type="number" min="1" value="1" name="ticketQty" required/>
		</label>

		<div class="grid grid-cols-6 gap-4">
			<button type="button" class="btn variant-filled-primary" on:click={book}>Book</button>
			<button type="reset" class="btn variant-filled">Cancel</button>
		</div>


	</form>
</div>