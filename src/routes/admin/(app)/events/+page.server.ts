import * as db from '$lib/server/db'
export async function load() {
	const result = await db.query(`
      select id                                               as "Event ID",
             event_name                                       as "Event Name",
             to_char(start_datetime, 'DD/MM/YYYY HH24:MI:SS') as "Start Date",
             to_char(end_datetime, 'DD/MM/YYYY HH24:MI:SS')   as "End Date",
             location                                         as "Location",
             upper(status)                                    as "Status"
      from events
			order by start_datetime desc;
	`, [])

	if (result.rows.length != 0) {
		const headers = Object.keys(result.rows[0]);
		return { allEvents: result.rows, headers: headers }
	}
	return { allEvents: [], headers: [] }
}