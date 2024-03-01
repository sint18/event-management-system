import * as db from '$lib/server/db'
import { error, fail } from '@sveltejs/kit'

export async function load({ params }){
	const userId = params.userId

	if(isNaN(Number(userId))){
		error(404, 'Not Found')
	}

	const queryUserInfo = await db.query(`
      select users.user_id,
             users.username,
             users.first_name,
             users.last_name,
             users.email,
             users.points,
             r.role_name,
             users.role_id,
             to_char(users.last_updated, 'YYYY-MM-DD HH24:MI:SS') as last_updated,
             to_char(users.created_at, 'YYYY-MM-DD HH24:MI:SS')   as created_at
      from users
               inner join roles r on r.role_id = users.role_id
      where users.user_id = $1;
	`, [userId])

	const queryRoles = await db.query(`
      select role_id, role_name
      from roles;
	`, [])

	const queryBookings = await db.query(`
      select booking_id,
             e.event_name,
             e.event_id,
             to_char(booking_datetime, 'DD/MM/YYYY HH24:MI:SS') as booking_datetime,
             ticket_quantity,
             bookings.status,
             to_char(bookings.last_updated, 'DD/MM/YYYY HH24:MI:SS') as last_updated
      from bookings
               inner join events e on bookings.event_id = e.event_id
      where user_id = $1;
	`, [userId])

	if(queryUserInfo.rowCount && queryRoles.rowCount && queryUserInfo.rowCount > 0 && queryRoles.rowCount > 0) {
		return { userInfo: queryUserInfo.rows[0], roles: queryRoles.rows, bookings: queryBookings.rows }
	}
}

export const actions = {
	updateUser: async({ request }) => {
		const data = await request.formData();
		// console.log(data);
		const userId: string = <string>data.get('userId')
		const roleId: string = <string>data.get('roleId')
		const firstName: string = <string>data.get('firstName')
		const lastName: string = <string>data.get('lastName')
		const username: string = <string>data.get('username')
		const email: string = <string>data.get('email')

		if (!firstName) {
			return fail(400, {error: true, errMessage: 'First Name field cannot be empty'})
		}
		if (!lastName) {
			return fail(400, {error: true, errMessage: 'Last Name field cannot be empty'})
		}
		if (!email) {
			return fail(400, {error: true, errMessage: 'Email field cannot be empty'})
		}
		if (!username) {
			return fail(400, {error: true, errMessage: 'Username field cannot be empty'})
		}

		const queryUpdate = await db.query(`
		update users
		set role_id      = $1,
				first_name   = $2,
				last_name    = $3,
				username     = $4,
				email        = $5,
				last_updated = now()
		where user_id = $6;
		`, [roleId, firstName, lastName, username, email, userId])

		if (queryUpdate.rowCount && queryUpdate.rowCount > 0) {
			return { success: true }
		}
	}
}