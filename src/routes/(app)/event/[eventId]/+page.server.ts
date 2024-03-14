import * as db from '$lib/server/db';

export async function load({params}){
	const eventId: string = params.eventId

	const result = await db.query(`
              select event_id,
                     event_name,
                     description,
                     to_char(start_datetime, 'YYYY-MM-DD HH24:MI:SS') as start_datetime,
                     to_char(end_datetime, 'YYYY-MM-DD HH24:MI:SS')   as end_datetime,
                     (end_datetime - start_datetime)::text            as duration,
                     location,
                     status
              from events
              where event_id = $1
		`, [eventId]
	)

	if (result.rowCount != 0) {
		return { eventInfo: result.rows[0]}
	}

}