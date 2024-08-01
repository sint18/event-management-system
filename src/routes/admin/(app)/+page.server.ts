import * as db from '$lib/server/db';

export async function load() {
	const top5Bookings = await db.query(`
      select bookings.booking_ref                                        as "Booking Ref.",
             to_char(bookings.booking_datetime, 'DD/MM/YYYY HH24:MI:SS') as "Booking Date",
             upper(bookings.status)                                      as "Status",
             concat(u.first_name, ' ', u.last_name)                      as "Name",
             e.event_name                                                as "Event Name"
      from bookings
               join events e on e.id = bookings.event_id
               join users u on u.id = bookings.user_id
      order by bookings.booking_datetime desc
      limit 5;
	`, []);

	const upcomingEvents = await db.query(`
      select e.id                                               as "ID",
             e.event_name                                       as "Event",
             to_char(e.start_datetime, 'DD/MM/YYYY HH24:MI:SS') as "Start Date",
             e.location                                         as "Location",
             upper(e.status)                                    as "Status"
      from events e
      order by start_datetime desc
      limit 5;
	`, []);

	const bookingStatusAnalytics = await db.query(`
      select initcap(status) as status, count(id)
      from bookings
      group by status;
	`, []);

	const userCountQuery = await db.query(`
      select count(users.id)
      from users
      join roles r on r.id = users.role_id
      group by r.role_name
	`, []);

	const eventCountQuery = await db.query(`
      select count(id)
      from events
	`, []);

	const bookingCountQuery = await db.query(`
      select count(id)
      from bookings
	`, []);

	const totalBookingsByMonth = await db.query(`
      select count(id)                                               as bookings,
             to_char(date_trunc('month', booking_datetime), 'Month') as month
      from bookings
      group by date_trunc('month', booking_datetime)
      order by date_trunc('month', booking_datetime);
	`, []);

	console.log(bookingStatusAnalytics.rows);

	let expectedAttendees = 0
	let actualAttendees = 0
	bookingStatusAnalytics.rows.forEach(row => {
		if (row.status !== "Present") {
			expectedAttendees += Number(row.count)
		} else {
			actualAttendees = Number(row.count)
		}
	})
	const attendanceRate = (actualAttendees / expectedAttendees) * 100

	return {
		recentBookings: top5Bookings.rows,
		upcomingEvents: upcomingEvents.rows,
		bookingStatusAnalytics: bookingStatusAnalytics.rows,
		totalBookingsByMonth: totalBookingsByMonth.rows,
		counts: {
			users: userCountQuery.rows[0]['count'],
			admins: userCountQuery.rows[1]['count'],
			events: eventCountQuery.rows[0]['count'],
			bookings: bookingCountQuery.rows[0]['count'],
			attendance: attendanceRate
		}
	};
}