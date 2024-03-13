import * as db from '$lib/server/db'
import { error, fail } from '@sveltejs/kit'

export const actions = {
	default: async ({request}) => {
		const data = await request.formData();
		const bookingRef: string = <string>data.get('bookingRef')

		if(isNaN(Number(bookingRef))){
			return fail(404, { error: true, message: 'Booking Reference must be a number'})
		}

		const queryResult = await db.query(`
        select bookings.booking_id,
               bookings.booking_ref,
               to_char(bookings.booking_datetime, 'DD/MM/YYYY HH24:MI:SS') as booking_datetime,
               bookings.ticket_quantity,
               bookings.status
        from bookings
        where booking_ref = $1;
		`, [bookingRef])

		if(queryResult.rowCount && queryResult.rowCount > 0) {
			return { bookings: queryResult.rows }
		} else {
			return { error: true, message: 'Booking not found'}
		}

	}
}
