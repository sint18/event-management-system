import * as db from '$lib/server/db'
import { fail } from '@sveltejs/kit';

export async function load() {
	const categoryQuery = await db.query(`
      select id, category_name
      from event_category
      where active is true;
	`, [])

	const organizerQuery = await db.query(`
      select id, organizer_name
      from organizers
      where active is true;
	`, [])

	return { categories: categoryQuery.rows, organizers: organizerQuery.rows }

}

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
		const categoryId = <string>data.get('categoryId')
		const organizerId = <string>data.get('organizerId')

		if(!eventName) {
			return fail(400, { missing: true, item: 'Event Name'})
		} else if (!startDate){
			return fail(400, { missing: true, item: 'Start Date'})
		} else if (!endDate) {
			return fail(400, { missing: true, item: 'End Date'})
		} else if (!location) {
			return fail(400, { missing: true, item: 'Event Location'})
		}

		const result = await db.query(
			`INSERT INTO events (event_name, description, start_datetime, end_datetime, location, organizer_id, status, category_id)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
			[eventName, description, startDate, endDate, location, organizerId, status, categoryId])

		if(result.rowCount && result.rowCount > 0) {
			return { success: true, message: 'New Event Successfully Created!' };
		}
	}
}