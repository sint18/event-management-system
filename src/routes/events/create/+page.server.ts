import * as db from '$lib/server/db'
export const actions = {
	default: async ({ request }) => {
		const data = await request.formData()
		console.log(data)
		const eventName = <string>data.get('eventName')
		const description = <string>data.get('description')
		const startDate = <string>data.get('startDate')
		const endDate = <string> data.get('endDate')
		const location = <string>data.get('venue')
		const status = <string>data.get('status')

		const result = await db.query(
			`INSERT INTO events (event_name, description, start_datetime, end_datetime, location, organizer_id, status, category_id)
		VALUES ($1, $2, $3, $4, $5, NULL, $6, $7);`,
			[eventName, description, startDate, endDate, location, status, '2'])

		console.log(result);

		return { success: true };
	}
}