import { fail, redirect } from '@sveltejs/kit';
import * as db from '$lib/server/db'
import { verify } from '$lib/server/crypto'

// TODO: Create Session
export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData()

		const username: string = <string> data.get('username')
		const password: string = <string> data.get('password')

		if(!username) {
			return fail(400, { error: true, message: 'Username cannot be empty'})
		} else if (!password) {
			return fail(400, { error: true, message: 'Password cannot be empty'})
		}

		const queryResult = await db.query(`
        select user_id, password
        from users
                 join roles r on r.role_id = users.role_id
        where active is true
          and r.role_name ilike 'admin'
          and username = $1;
		`, [username])

		// console.log(queryResult);
		if(queryResult.rowCount && queryResult.rowCount > 0) {
			const passwordHash = queryResult.rows[0]['password']
			const result = await verify(password, passwordHash)
			if (result) {
				// cookies.set('user', queryResult.rows[0]['user_id'], { path: '' })
				const user_id = queryResult.rows[0]['user_id']

				return redirect(300, '/')
			}
		}
		return fail(400, { error: true, message: 'Incorrect password or username'})

	}
}