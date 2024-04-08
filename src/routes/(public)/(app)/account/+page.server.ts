import { error, fail } from '@sveltejs/kit';
import * as db from '$lib/server/db';
import { hash, verify } from '$lib/server/crypto';

export async function load ({ locals}){
	if (!locals.user) {
		error(401, { message: 'You must be logged in to access this feature.'})
	}

	const userId = locals.user.id

	const query = await db.query(`
      select users.id                                  as user_id,
             users.username,
             concat(users.first_name, ' ', users.last_name) as fullname,
             users.email,
             users.points
      from users
               inner join roles r on r.id = users.role_id
      where users.id = $1;
	`, [String(userId)]);

	if (query.rowCount && query.rowCount > 0) {
		return { userInfo: query.rows[0] }
	}
}

export const actions = {
	changePassword: async({ request, locals }) => {
		if (!locals.user) {
			return fail(400, { error: true, message: 'Please log in again'})
		}

		const data = await request.formData()
		const currentPassword = <string> data.get('currentPassword')
		const newPassword = <string> data.get('newPassword')
		const confirmNewPassword = <string> data.get('confirmNewPassword')
		const userId = locals.user.id

		if (newPassword !== confirmNewPassword) {
			return fail(400, { error: true, message: 'Passwords do not match, try again!'})
		}

		const query = await db.query(`
        select password
        from users
        where id = $1;
		`, [String(userId)])

		if(query.rowCount && query.rowCount > 0) {
			const passwordMatched = await verify(currentPassword, query.rows[0]['password'])
			if (passwordMatched) {
				const hashedPassword = await hash(newPassword)
				const updateQuery = await db.query(`
            update users
            set password = $1, last_updated = now()
            where id = $2;
				`, [hashedPassword, String(userId)])

				if (updateQuery.rowCount && updateQuery.rowCount > 0){
					return { success: true, message: 'Password successfully changed'}
				}
			}
			return fail (400, { error: true, message: 'Incorrect password, try again!'})
		}
		return fail (400, { error: true, message: 'Something went wrong, try again!'})
	},
	changeEmail: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(400, { error: true, message: 'Please log in again'})
		}
		const userId = locals.user.id
		const data = await request.formData()
		const newEmail = <string> data.get('newEmail')
		const password = <string> data.get('password')

		const query = await db.query(`
        select password
        from users
        where id = $1;
		`, [String(userId)])

		if(query.rowCount && query.rowCount > 0) {
			const passwordMatched = await verify(password, query.rows[0]['password'])
			if (passwordMatched) {
				const updateQuery = await db.query(`
            update users
            set email = $1, last_updated = now()
            where id = $2;
				`, [newEmail, String(userId)])

				if (updateQuery.rowCount && updateQuery.rowCount > 0){
					return { success: true, message: 'Email successfully changed'}
				}
			}
			return fail (400, { error: true, message: 'Incorrect password, try again!'})
		}
		return fail (400, { error: true, message: 'Something went wrong, try again!'})
	}
}