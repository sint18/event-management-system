import * as db from './db'
export async function addPoints(userId: string, points: number) {
	return await db.query(`
      update users
      set points = points + $1
      from bookings b
      where users.id = b.user_id
        and b.id = $2;
	`, [String(points), userId])
}