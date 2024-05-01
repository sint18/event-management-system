import * as db from '$lib/server/db';
import { error, fail, redirect } from '@sveltejs/kit';
import type { QueryResult } from 'pg';
import { lucia } from '$lib/server/auth';

export async function load({ url, params, locals }) {
	const userId = params.userId;
	const bookingFilter = url.searchParams.get('filter');

	if (isNaN(Number(userId))) {
		error(404, 'Not Found');
	}

	const queryUserInfo = await db.query(`
      select users.id                                             as user_id,
             users.username,
             users.first_name,
             users.last_name,
             users.email,
             users.points,
             r.role_name,
             users.role_id,
             case users.active
                 when true then 'active'
                 when false then 'inactive'
                 end                                              as account_status,
             to_char(users.last_updated, 'YYYY-MM-DD HH24:MI:SS') as last_updated,
             to_char(users.created_at, 'YYYY-MM-DD HH24:MI:SS')   as created_at
      from users
               inner join roles r on r.id = users.role_id
      where users.id = $1;
	`, [userId]);

	const queryRoles = await db.query(`
      select id as role_id, role_name
      from roles;
	`, []);

	let sessionCount = null

	if (locals.user && locals.user.id === Number(userId)) {
		sessionCount = await lucia.getUserSessions(Number(userId));
	}

	let queryBookings: QueryResult;
	if (!bookingFilter || bookingFilter === 'none') {
		queryBookings = await db.query(`
        select bookings.id                                             as booking_id,
               booking_ref,
               e.event_name,
               e.id                                                    as event_id,
               to_char(booking_datetime, 'DD/MM/YYYY HH24:MI:SS')      as booking_datetime,
               ticket_quantity,
               bookings.status,
               to_char(bookings.last_updated, 'DD/MM/YYYY HH24:MI:SS') as last_updated
        from bookings
                 inner join events e on bookings.event_id = e.id
        where user_id = $1;
		`, [userId]);
	} else {
		queryBookings = await db.query(`
        select bookings.id                                             as booking_id,
               booking_ref,
               e.event_name,
               e.id                                                    as event_id,
               to_char(booking_datetime, 'DD/MM/YYYY HH24:MI:SS')      as booking_datetime,
               ticket_quantity,
               bookings.status,
               to_char(bookings.last_updated, 'DD/MM/YYYY HH24:MI:SS') as last_updated
        from bookings
                 inner join events e on bookings.event_id = e.id
        where user_id = $1
          and bookings.status = $2;
		`, [userId, bookingFilter]);
	}

	if (queryUserInfo.rowCount && queryRoles.rowCount && queryUserInfo.rowCount > 0 && queryRoles.rowCount > 0) {
		return { userInfo: queryUserInfo.rows[0], roles: queryRoles.rows, bookings: queryBookings.rows, sessionCount: sessionCount };
	}
}

export const actions = {
	updateUser: async ({ request }) => {
		const data = await request.formData();
		// console.log(data);
		const userId: string = <string>data.get('userId');
		const roleId: string = <string>data.get('roleId');
		const firstName: string = <string>data.get('firstName');
		const lastName: string = <string>data.get('lastName');
		const username: string = <string>data.get('username');
		const email: string = <string>data.get('email');

		if (!firstName) {
			return fail(400, { error: true, errMessage: 'First Name field cannot be empty' });
		}
		if (!lastName) {
			return fail(400, { error: true, errMessage: 'Last Name field cannot be empty' });
		}
		if (!email) {
			return fail(400, { error: true, errMessage: 'Email field cannot be empty' });
		}
		if (!username) {
			return fail(400, { error: true, errMessage: 'Username field cannot be empty' });
		}

		const queryUpdate = await db.query(`
        update users
        set role_id      = $1,
            first_name   = $2,
            last_name    = $3,
            username     = $4,
            email        = $5,
            last_updated = now()
        where id = $6;
		`, [roleId, firstName, lastName, username, email, userId]);

		if (queryUpdate.rowCount && queryUpdate.rowCount > 0) {
			return { success: true, message: 'Record successfully updated' };
		}
	},
	deactivateUser: async ({ request }) => {
		const data = await request.formData();
		const userId: string = <string>data.get('userId');

		const query = await db.query(`
        update users
        set active       = 'false',
            last_updated = now()
        where id = $1;
		`, [userId]);

		if (query.rowCount && query.rowCount > 0) {
			return { success: true, message: 'User account has been deactivated' };
		}
	},
	activateUser: async ({ request }) => {
		const data = await request.formData();
		const userId: string = <string>data.get('userId');

		const query = await db.query(`
        update users
        set active       = 'true',
            last_updated = now()
        where id = $1;
		`, [userId]);

		if (query.rowCount && query.rowCount > 0) {
			return { success: true, message: 'User account has been activated successfully' };
		}
	},
	logoutOtherSessions: async ({ locals }) => {
		if (!locals.user) {
			return redirect(302, '/admin/login');
		}
		const userId = locals.user.id
		await lucia.invalidateUserSessions(Number(userId));
	}
};