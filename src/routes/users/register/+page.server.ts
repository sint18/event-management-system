import * as db from '$lib/server/db';
import { fail } from '@sveltejs/kit';

export async function load(){
	const queryResult = await db.query(`
      select role_id, role_name
      from roles;
	`, [])

	if (queryResult.rowCount && queryResult.rowCount > 0) {
		return { roles: queryResult.rows }
	}
}

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData()

		const firstName: string = <string> data.get('firstName')
		const lastName: string = <string> data.get('lastName')
		const username: string = <string> data.get('username')
		const email: string = <string> data.get('email')
		const password: string = <string> data.get('password')
		const confirmPassword: string = <string> data.get('confirmPassword')
		const roleId: string = <string> data.get('roleId')

		if (!firstName) {
			return fail(400, { error: true, message: 'First Name cannot be empty'})
		}
		if (!lastName) {
			return fail(400, { error: true, message: 'Last Name cannot be empty'})
		}
		if (!username) {
			return fail(400, { error: true, message: 'Username cannot be empty'})
		}
		if (!email) {
			return fail(400, { error: true, message: 'Email cannot be empty'})
		}
		if (!password || !confirmPassword) {
			return fail(400, { error: true, message: 'Password fields cannot be empty'})
		}

		if (password != confirmPassword) {
			return fail(400, { error: true, message: 'Passwords do not match, try again'})

		}

		const queryResult = await db.query(`
        insert into users (role_id, username, password, email, first_name, last_name)
        values ($1, $2, $3, $4, $5, $6);
		`, [roleId, username, password, email, firstName, lastName])

		if (queryResult.rowCount && queryResult.rowCount > 0) {
			return { success: true, message: 'A new user successfully registered' }
		}

	}
}