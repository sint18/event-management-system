export async function load({ locals }) {
	if (locals.user) {
		return {
			username: locals.user.username,
			userId: locals.user.id
		}
	}
}