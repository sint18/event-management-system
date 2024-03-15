import { fail, redirect } from '@sveltejs/kit';
import * as db from '$lib/server/db'
import { verify } from '$lib/server/crypto'
import { lucia } from '$lib/server/auth';

export async function load({ locals }) {
	// if (locals.user) {
	// 	return redirect(302, '/admin');
	// }
}

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
        select users.id, password
        from users
                 join roles r on r.id = users.role_id
        where active is true
          and r.role_name ilike 'admin'
          and username = $1;
		`, [username])

		// console.log(queryResult);
		if(queryResult.rowCount && queryResult.rowCount > 0) {
			const passwordHash = queryResult.rows[0]['password']
			const result = await verify(password, passwordHash)
			if (result) {
				const userId = queryResult.rows[0]['id']

				// -------------- Auth ------------------
				const session = await lucia.createSession(userId, {});
				const sessionCookie = lucia.createSessionCookie(session.id);
				cookies.set(sessionCookie.name, sessionCookie.value, {
					path: ".",
					...sessionCookie.attributes
				});
				// --------------------------------
				return redirect(300, '/admin/')
			}
		}
		return fail(400, { error: true, message: 'Incorrect password or username'})

	}
}