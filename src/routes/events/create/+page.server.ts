import * as db from '$lib/server/db'
export const actions = {
	default: async ({ request }) => {
		const data = await request.formData()
		console.log(data)
		const eventName = <string>data.get('eventName')
		const description = <string>data.get('description')
		const startDate = <string>data.get('startDate')
		const endDate = <string> data.get('endDate')
		const venue = <string>data.get('venue')
		const status = <string>data.get('status')

		const result = await db.query(
			`INSERT INTO events (event_name, description, start_date, end_date, venue, organizer_id, status)
		VALUES ($1, $2, $3, $4, $5, NULL, $6);`,
			[eventName, description, startDate, endDate, venue, status])

		console.log(result);

		return { success: true };
	}
}