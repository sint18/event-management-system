import * as db from '$lib/server/db'
export async function load() {
	const result = await db.query(`
	select event_id as "Event ID",
	       event_name as "Event Name",
	       description as "Description",
	       to_char(start_date, 'DD/MM/YYYY') as "Start Date",
         to_char(end_date, 'DD/MM/YYYY') as "End Date",
	       venue as "Venue",
	       upper(status) as "Status"
	    from events;
	`, [])
	if (result.rows) {
		const headers = Object.keys(result.rows[0]);
		return { allEvents: result.rows, headers: headers}
	}
	return { allEvents: [], headers: [] }
}