import * as db from '$lib/server/db'
export async function load() {
	const queryResult = await db.query(`
      select id                                               as event_id,
             event_name,
             description,
             to_char(start_datetime, 'DD/MM/YYYY HH24:MI:SS') as start_datetime,
             to_char(end_datetime, 'DD/MM/YYYY HH24:MI:SS')   as end_datetime,
             location,
             upper(status)
      from events
      order by events.start_datetime desc;
	`, [])
	if (queryResult.rowCount && queryResult.rowCount > 0) {
		return { events: queryResult.rows }
	}
	return { events: [] }
}