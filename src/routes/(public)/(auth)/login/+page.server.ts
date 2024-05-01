import { fail, redirect } from '@sveltejs/kit';
import * as db from '$lib/server/db';
import { verify } from '$lib/server/crypto';
import { lucia } from '$lib/server/auth';

export async function load({ locals }) {
	if (locals.user) {
		return redirect(302, '/');
	}
}

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();

		const username: string = <string>data.get('username');
		const password: string = <string>data.get('password');

		if (!username) {
			return fail(400, { error: true, message: 'Username cannot be empty' });
		} else if (!password) {
			return fail(400, { error: true, message: 'Password cannot be empty' });
		}

		const queryResult = await db.query(`
        select users.id, password, active
        from users
        where username = $1;
		`, [username]);

		// console.log(queryResult);
		if (queryResult.rowCount && queryResult.rowCount > 0) {
			const passwordHash = queryResult.rows[0]['password'];
			const result = await verify(password, passwordHash);
			if (result) {
				const isActive: boolean = queryResult.rows[0]['active'];
				if (!isActive) {
					return fail(403, { error: true, message: 'Account has been deactivated, contact support.'})
				}
				const userId = queryResult.rows[0]['id'];

				// -------------- Auth ------------------
				const session = await lucia.createSession(userId, {});
				const sessionCookie = lucia.createSessionCookie(session.id);
				cookies.set(sessionCookie.name, sessionCookie.value, {
					path: '.',
					...sessionCookie.attributes
				});
				// --------------------------------
				return redirect(302, '/');
			}
		}
		return fail(400, { error: true, message: 'Incorrect password or username' });

	}
};