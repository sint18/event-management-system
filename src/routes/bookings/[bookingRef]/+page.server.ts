import * as db from '$lib/server/db'
import { fail } from '@sveltejs/kit';
export async function load({ params }) {
	const bookingRef: string = params.bookingRef

	const queryResult = await db.query(`
      select bookings.booking_id,
             bookings.booking_ref,
             to_char(bookings.booking_datetime, 'YYYY-MM-DD HH24:MI:SS') as booking_datetime,
             bookings.ticket_quantity,
             bookings.status,
             bookings.remark,
             to_char(bookings.last_updated, 'YYYY-MM-DD HH24:MI:SS') as last_updated,
             e.event_name,
             e.location,
             to_char(e.start_datetime, 'YYYY-MM-DD HH24:MI:SS') as start_datetime,
             to_char(e.end_datetime, 'YYYY-MM-DD HH24:MI:SS') as end_datetime,
             u.username,
             concat(u.first_name, ' ', u.last_name) as fullname
      from bookings
               join public.events e on e.event_id = bookings.event_id
               join public.users u on u.user_id = bookings.user_id
      where bookings.booking_ref = $1;
	`, [bookingRef])

  if(queryResult.rowCount && queryResult.rowCount > 0) {
    return { bookingInfo: queryResult.rows[0] }
  }

}

export const actions = {
  amendBooking: async ({ request }) => {
    const data = await request.formData()
    const bookingId: string = <string>data.get('bookingId')
    const seats: string = <string>data.get('seats')
    const status: string = <string>data.get('status')
    const remark: string = <string>data.get('remark')

    if (!status) {
      return fail(400, { error: true, message: 'An Error Occurred, try again!'})
    }
    if (!bookingId) {
      return fail(400, { error: true, message: 'An Error Occurred, try again!'})
    }

    if (status === 'cancelled') {
      const queryResult = await db.query(`
        update bookings
        set status       = 'cancelled',
            remark       = $1,
            last_updated = now()
        where booking_id = $2;
      `, [remark, bookingId])

      if(queryResult.rowCount && queryResult.rowCount > 0) {
        return { success: true, message: 'Booking successfully cancelled'}
      }
    } else {
      const queryResult = await db.query(`
          update bookings
          set ticket_quantity = $1,
              status          = $2,
              last_updated    = now()
          where booking_id = $3;
			`, [seats, status, bookingId])

      if(queryResult.rowCount && queryResult.rowCount > 0) {
        return { success: true, message: 'Booking successfully updated'}
      }
    }
    console.log(data);



  }
}