import * as db from '$lib/server/db';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const bookingRef: string = params.bookingRef;

	if(isNaN(Number(bookingRef))) return error(404, 'Ref not found')

	const queryResult = await db.query(`
      select bookings.id,
             bookings.booking_ref,
             to_char(bookings.booking_datetime, 'DD/MM/YYYY HH24:MI:SS') as booking_datetime,
             bookings.ticket_quantity,
             bookings.status,
             e.event_name,
             e.location,
             e.description,
             to_char(e.start_datetime, 'DD/MM/YYYY HH24:MI:SS')          as start_datetime,
             to_char(e.end_datetime, 'DD/MM/YYYY HH24:MI:SS')            as end_datetime,
             u.username,
             concat(u.first_name, ' ', u.last_name)                      as fullname
      from bookings
               join public.events e on e.id = bookings.event_id
               join public.users u on u.id = bookings.user_id
      where bookings.booking_ref = $1;
	`, [bookingRef]);

	if (queryResult.rowCount && queryResult.rowCount > 0) {
		return { bookingInfo: queryResult.rows[0] };
	}

}

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData()
		const bookingId = <string>data.get('bookingId')

		if (!bookingId) {
			error(404, { message: 'Something went wrong' })
		}
		// TODO: Check event start date and current time to know if it's before 24 hours or not
		const query = await db.query(`
        update bookings
        set status       = 'cancelled',
            last_updated = now(),
            remark       = 'Cancelled by user before 24 hours of event start date'
        where id = $1;
		`,[bookingId])

		if (query.rowCount && query.rowCount > 0) {
			return { success: true, message: 'Booking Successfully Cancelled'}
		}
	}
}