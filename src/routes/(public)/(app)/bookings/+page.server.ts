import { error } from '@sveltejs/kit';
import * as db from '$lib/server/db';

export async function load({ locals }) {
	if (!locals.user) {
		error(401, { message: 'You must be logged in to access this feature.' });
	}
	const userId = locals.user.id
	const query = await db.query(`
      select bookings.id,
             bookings.booking_ref,
             to_char(bookings.booking_datetime, 'DD/MM/YYYY HH24:MI:SS') as booking_datetime,
             bookings.status,
             e.event_name,
             e.location,
             to_char(e.start_datetime, 'DD/MM/YYYY HH24:MI:SS')          as event_datetime 
      from bookings
               join events e on e.id = bookings.event_id
      where bookings.user_id = $1;
	`, [String(userId)]);

	if (query.rowCount && query.rowCount > 0) {
		return { bookings:query.rows }
	}

}
