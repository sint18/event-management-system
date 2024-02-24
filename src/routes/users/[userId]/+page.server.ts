import * as db from '$lib/server/db'
import { error } from '@sveltejs/kit'

export async function load({ params }){
	const userId = params.userId

	if(isNaN(Number(userId))){
		error(404, 'Not Found')
	}

	const queryResult = await db.query(`
	select users.user_id,
       users.username,
       users.first_name,
       users.last_name,
       users.email,
       users.points,
       r.role_name,
			 to_char(users.last_updated, 'YYYY-MM-DD HH24:MI:SS') as last_updated,
			 to_char(users.created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at
	from users
	inner join roles r on r.role_id = users.role_id
	where users.user_id = $1;
	`, [userId])

	if(queryResult.rowCount && queryResult.rowCount > 0) {
		return { userInfo: queryResult.rows[0] }
	}
}