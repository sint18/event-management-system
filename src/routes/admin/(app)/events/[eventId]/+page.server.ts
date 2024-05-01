import * as db from '$lib/server/db';
import { redirect, fail } from '@sveltejs/kit';

export async function load({ params }) {
	const eventId: string = params.eventId;

	const result = await db.query(`
              select e.id                                             as event_id,
                     event_name,
                     e.description,
                     ec.category_name                                 as category,
                     o.organizer_name,
                     o.description                                    as organizer_details,
                     to_char(start_datetime, 'YYYY-MM-DD HH24:MI:SS') as start_datetime,
                     to_char(end_datetime, 'YYYY-MM-DD HH24:MI:SS')   as end_datetime,
                     (end_datetime - start_datetime)::text            as duration,
                     location,
                     status,
                     to_char(e.last_updated, 'YYYY-MM-DD HH24:MI:SS') as last_updated,
                     to_char(created_at, 'YYYY-MM-DD HH24:MI:SS')     as created_at
              from events e
                       join event_category ec on ec.id = e.category_id
                       join public.organizers o on o.id = e.organizer_id
              where e.id = $1
		`, [eventId]
	);

	const bookingAnalytics = await db.query(`
              select initcap(bookings.status) as status, count(bookings.id)
              from bookings
                       join events e on e.id = bookings.event_id
              where e.id = $1
              group by bookings.status;
		`, [eventId]
	);

	const bookings = await db.query(`
              select bookings.booking_ref                                        as "Booking Ref.",
                     to_char(bookings.booking_datetime, 'DD/MM/YYYY HH24:MI:SS') as "Booking Date",
                     upper(bookings.status)                                      as "Status",
                     concat(u.first_name, ' ', u.last_name)                      as "Name"
              from bookings
                       join events e on e.id = bookings.event_id
                       join users u on u.id = bookings.user_id
              where e.id = $1
              order by bookings.booking_datetime desc
		`, [eventId]
	);


	if (result.rowCount != 0) {
		return { eventInfo: result.rows[0], bookingAnalytics: bookingAnalytics.rows, bookings: bookings.rows };
	}

}

export const actions = {
	update: async ({ request }) => {
		const data = await request.formData();
		console.log(data);

		const eventId: string = <string>data.get('eventId');
		const event_name: string = <string>data.get('eventName');
		const description: string = <string>data.get('description');
		const startDate: string = <string>data.get('startDate');
		const endDate: string = <string>data.get('endDate');
		const location: string = <string>data.get('location');
		const status: string = <string>data.get('status');

		if (!event_name) {
			return fail(400, { missing: true, item: 'Event Name' });
		}
		if (!startDate) {
			return fail(400, { missing: true, item: 'Start Date' });
		}
		if (!endDate) {
			return fail(400, { missing: true, item: 'End Date' });
		}
		const result = await db.query(`
        update events
        set event_name     = $1,
            description    = $2,
            start_datetime = $3,
            end_datetime   = $4,
            location       = $5,
            status         = $6,
            last_updated   = now()
        where id = $7;
		`, [event_name, description, startDate, endDate, location, status, eventId]);

		if (result.rowCount && result.rowCount > 0) {
			// throw redirect(302, '/events/' + eventId)
			return { success: true };
		}
	},
	delete: async ({ request }) => {
		const data = await request.formData();

		const id: string = <string>data.get('eventId');

		const queryResult = await db.query(`
        delete
        from events
        where id = $1
		`, [id]);

		if (queryResult.rowCount && queryResult.rowCount > 0) {
			return redirect(302, '/events');
		}
	}
};