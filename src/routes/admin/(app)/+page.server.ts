import * as db from '$lib/server/db';

export async function load() {
	const top5Bookings = await db.query(`
      select bookings.booking_ref                                        as "Booking Ref.",
             to_char(bookings.booking_datetime, 'DD/MM/YYYY HH24:MI:SS') as "Booking Date",
             upper(bookings.status),
             concat(u.first_name, ' ', u.last_name)                      as "Name",
             e.event_name                                                as "Event Name"
      from bookings
               join events e on e.id = bookings.event_id
               join users u on u.id = bookings.user_id
      order by bookings.booking_datetime desc
      limit 5;
	`, []);

	const upcomingEvents = await db.query(`
      select e.id as "ID",
             e.event_name as "Event",
             to_char(e.start_datetime, 'DD/MM/YYYY HH24:MI:SS') as "Start Date",
             e.location as "Location",
             upper(e.status) as "Status"
      from events e
      order by start_datetime desc
      limit 5;
	`, []);

	const bookingStatusAnalytics = await db.query(`
      select initcap(status) as status, count(id)
      from bookings
      group by status;
	`, [])

	const totalBookingsByMonth = await db.query(`
      select count(id)                                               as bookings,
             to_char(date_trunc('month', booking_datetime), 'Month') as month
      from bookings
      group by date_trunc('month', booking_datetime)
      order by date_trunc('month', booking_datetime);
	`, [])

	console.log(bookingStatusAnalytics.rows);
	const headers = Object.keys(top5Bookings.rows[0]);
	return {
		recentBookings: top5Bookings.rows,
		recentBookingsHeaders: headers,
		upcomingEvents: upcomingEvents.rows,
		bookingStatusAnalytics: bookingStatusAnalytics.rows,
		totalBookingsByMonth: totalBookingsByMonth.rows
	};
}