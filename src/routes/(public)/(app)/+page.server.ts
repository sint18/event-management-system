import * as db from '$lib/server/db';

export async function load({ url }) {

	const categoryFilter = url.searchParams.get('category')
	const organizerFilter = url.searchParams.get('organizer')
	const statusFilter = url.searchParams.get('status')


	let queryResult

	if (categoryFilter && organizerFilter && statusFilter) {
		queryResult = await db.query(`
        select id                                               as event_id,
               event_name,
               description,
               to_char(start_datetime, 'DD/MM/YYYY HH24:MI:SS') as start_datetime,
               to_char(end_datetime, 'DD/MM/YYYY HH24:MI:SS')   as end_datetime,
               (end_datetime - start_datetime)::text            as duration,
               location,
               status
        from events
        where category_id = $1 and organizer_id = $2 and status = $3
        order by events.start_datetime desc;
		`, [categoryFilter, organizerFilter, statusFilter]);
	} else {
		queryResult = await db.query(`
      select id                                               as event_id,
             event_name,
             description,
             to_char(start_datetime, 'DD/MM/YYYY HH24:MI:SS') as start_datetime,
             to_char(end_datetime, 'DD/MM/YYYY HH24:MI:SS')   as end_datetime,
             (end_datetime - start_datetime)::text            as duration,
             location,
             status
      from events
      order by events.start_datetime desc;
		`, []);
	}

	const categoryQuery = await db.query(`
      select id, category_name
      from event_category
      where active is true;
	`, []);

	const organizerQuery = await db.query(`
      select id, organizer_name
      from organizers
      where active is true;
	`, []);

	return {
		events: queryResult.rows,
		filters: {
			categories: categoryQuery.rows,
			organizers: organizerQuery.rows
		}
	};
}