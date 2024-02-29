import * as db from '$lib/server/db';
import { fail } from '@sveltejs/kit';

export async function load() {
	const queryResult = await db.query(`
      select event_id, event_name
      from events
      where status = 'upcoming'
	`, []);

	if (queryResult.rowCount && queryResult.rowCount > 0) {
		return { events: queryResult.rows };
	}
}

export const actions = {
	checkUsername: async ({ request }) => {
		const data = await request.formData();
		const username: string = <string>data.get('username');

		if (!username) {
			return fail(400, { error: true, errMsg: 'Username is missing' });
		}

		const queryResult = await db.query(`
        select username, user_id, first_name, last_name
        from users
        where username = $1;
		`, [username]);

		if (queryResult.rowCount && queryResult.rowCount > 0) {
			const infoString: string = `${queryResult.rows[0]['username']} - ${queryResult.rows[0]['first_name']} ${queryResult.rows[0]['last_name']}`;
			return { userInfo: infoString, userId: queryResult.rows[0]['user_id'] };
		} else {
			return fail(400, { error: true, errMsg: 'User does not exist' });
		}
	},
	book: async ({ request }) => {
		const data = await request.formData();
		if (!data.get('username') || !data.get('user') || !data.get('userId')) {
			return fail(400, { error: true, errMsg: 'Find the user first' });
		}

		const user: string = <string>data.get('user')
		const userId: string = <string>data.get('userId');
		const eventId: string = <string>data.get('eventId');
		const ticketQty: string = <string>data.get('ticketQty');

		const queryResult = await db.query(`
        insert into bookings (event_id, user_id, status, ticket_quantity)
        values ($1, $2, $3, $4)
        returning booking_id;
		`, [eventId, userId, 'booked', ticketQty]);

		if (queryResult.rowCount && queryResult.rowCount > 0) {
			return { success: true, user: user, bookingId: queryResult.rows[0]['booking_id']}
		}
	}
}