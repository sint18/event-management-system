import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	if (!locals.user) {
		return redirect(302, '/admin/login');
	}
	return {
		username: locals.user.username,
		userId: locals.user.userId
	}
}