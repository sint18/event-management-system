import * as db from '$lib/server/db';
import { fail } from '@sveltejs/kit';

export async function load({ params }) {
	const eventId: string = params.eventId;

	const result = await db.query(`
              select events.id                                               as event_id,
                     event_name,
                     events.description,
                     to_char(start_datetime, 'DD/MM/YYYY HH24:MI:SS') as start_datetime,
                     to_char(end_datetime, 'DD/MM/YYYY HH24:MI:SS')   as end_datetime,
                     (end_datetime - start_datetime)::text            as duration,
                     location,
                     o.organizer_name,
                     o.description as organizer_description,
                     ec.category_name,
                     status
              from events
              join event_category ec on ec.id = events.category_id
              join organizers o on o.id = events.organizer_id
              where events.id = $1
		`, [eventId]
	);

	if (result.rowCount != 0) {
		return { eventInfo: result.rows[0] };
	}

}

export const actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData();
		const eventId = <string>data.get('eventId');
		const username = <string>locals.user?.username ?? data.get('username');
		try {
			const queryResult = await db.query(`
                insert into bookings (event_id, user_id, status)
                values ($1, (select id
                             from users
                             where username = $2), 'booked')
			`, [eventId, username]
			);

			if (queryResult.rowCount && queryResult.rowCount > 0) {
				return { success: true, message: 'Booking successful!\nA confirmation email has been sent.' };
			}
		} catch (error) {
			return fail(404, { error: true, message: 'Something went wrong, try again!'});
		}
	}
};