-- Most Recent Events
select e.id,
       e.event_name,
       e.start_datetime,
       e.location,
       e.status
from events e
order by start_datetime desc
limit 5;

-- Bookings Grouped by Status
select status, count(id)
from bookings
group by status;

-- Top 5 Booking Activities
select bookings.booking_ref,
       to_char(bookings.booking_datetime, 'DD/MM/YYYY HH24:MI:SS') as booking_datetime,
       bookings.status,
       concat(u.first_name, u.last_name)                           as name,
       e.event_name,
       e.location
from bookings
         join events e on e.id = bookings.event_id
         join users u on u.id = bookings.user_id
order by bookings.booking_datetime desc
limit 5;

-- Total Bookings by month and year
select count(id) as bookings,
       to_char(date_trunc('month', booking_datetime), 'Month') as month
from bookings
group by date_trunc( 'month', booking_datetime)
order by date_trunc( 'month', booking_datetime);