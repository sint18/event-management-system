import * as db from '$lib/server/db';

export async function load({params}){
	const eventId: string = params.eventId

	const result = await db.query(`
              select id                                               as event_id,
                     event_name,
                     description,
                     to_char(start_datetime, 'YYYY-MM-DD HH24:MI:SS') as start_datetime,
                     to_char(end_datetime, 'YYYY-MM-DD HH24:MI:SS')   as end_datetime,
                     (end_datetime - start_datetime)::text            as duration,
                     location,
                     status
              from events
              where id = $1
		`, [eventId]
	)

	if (result.rowCount != 0) {
		return { eventInfo: result.rows[0]}
	}

}

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData()
		const eventId = <string> data.get('eventId')
		const username = <string> data.get('username')
		const queryResult = await db.query(`
             insert into bookings (event_id, user_id, status) values ($1, (
                 select id from users where username = $2
								 ), 'booked')
		`, [eventId, username]
		)

		if (queryResult.rowCount && queryResult.rowCount > 0) {
			return { success: true, message: 'Booking successful!\nA confirmation email has been sent.'}
		}
	}
}