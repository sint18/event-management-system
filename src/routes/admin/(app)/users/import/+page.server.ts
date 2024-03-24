import * as db from '$lib/server/db';
import { fail } from '@sveltejs/kit';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const rawString = <string>data.get('parsedData');
		const parsedData = JSON.parse(rawString);

		for (const item of parsedData) {
			if (!item.firstName) return fail(400, { error: true, message: 'An error occurred, there is no firstName column. Check your CSV file again' });
			if (!item.lastName) return fail(400, { error: true, message: 'An error occurred, there is no lastName column. Check your CSV file again' });
			if (!item.username) return fail(400, { error: true, message: 'An error occurred, there is no username column. Check your CSV file again' });
			if (!item.email) return fail(400, { error: true, message: 'An error occurred, there is no email column. Check your CSV file again' });
			if (!item.password) return fail(400, { error: true, message: 'An error occurred, there is no password column. Check your CSV file again' });
			if (!item.role) return fail(400, { error: true, message: 'An error occurred, there is no role column. Check your CSV file again' });

			// console.log('firstName :' + item.firstName + '/' + Boolean(item.firstName));
			// console.log('lastName :' + item.lastName + '/' + Boolean(item.lastName));
			// console.log('username :' + item.username + '/' + Boolean(item.username));
			// console.log('email :' + item.email + '/' + Boolean(item.email));
			// console.log('password :' + item.password + '/' + Boolean(item.password));
			// console.log('role :' + item.role + '/' + Boolean(item.role));

			try {
				const query = await db.query(`
            insert into users (role_id, username, password, email, first_name, last_name)
            VALUES ((select id from roles where role_name ilike $1), $2, $3, $4, $5, $6);
				`, [item.role, item.username, item.password, item.email, item.firstName, item.lastName]);
				if (query.rowCount && query.rowCount > 0) {
					console.log('Insert Successful');
				}
			} catch (error) {
				return fail(404, { error: true, message: 'An error occurred while importing into database, check your CSV file again' });
			}
		}

		return { success: true, message: 'New user accounts have been successfully imported' };
	}
};