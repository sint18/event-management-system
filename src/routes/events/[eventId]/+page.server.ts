import * as db from '$lib/server/db'
export async function load({params}){
	const eventId: string = params.eventId

	const result = await db.query(`
	select event_id, 
	       event_name,
	       description,
         start_datetime,
         end_datetime,
         location,
         status
			from events where event_id = $1
       `, [eventId]
	)

	if (result.rowCount != 0) {
		return { eventInfo: result.rows[0]}
	}

}