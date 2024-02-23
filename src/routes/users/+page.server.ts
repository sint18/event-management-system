import * as db from '$lib/server/db'
import { fail } from '@sveltejs/kit';
// import { redirect, fail } from '@sveltejs/kit';

export async function load(){
	const queryResult = await db.query(`
		select users.user_id    as "User ID",
               users.username   as "Username",
               users.first_name as "First Name",
               users.last_name  as "Last Name",
               users.email      as "Email",
               users.points     as "Points"
		from users
		where user_id = 1;
	`, [])

	if (queryResult.rowCount && queryResult.rowCount > 0) {
		const headers = Object.keys(queryResult.rows[0]);
		return { colHeaders: headers }
	}
}
export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		console.log(data);

		const username: string = <string>data.get('username')

		if (isNaN(Number(username))) {
			return fail(400, { error: true, errMessage: 'Username must be a number'})
		}

		const result = await db.query(`
        select users.user_id,
               users.username,
               users.first_name,
               users.last_name,
               users.email,
               users.points
        from users
        where username = $1;
		`, [username])

		if (result.rowCount && result.rowCount > 0) {
			// throw redirect(302, '/events/' + eventId)
			const headers = Object.keys(result.rows[0]);
			return { userInfo: result.rows, headers: headers }
		} else {
			return fail(404, { incorrect: true, message: "No User Found"})
		}
	}
}
