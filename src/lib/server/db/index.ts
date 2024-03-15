import pg from 'pg';
import type { ConnectionConfig } from 'pg';
import { NodePostgresAdapter } from "@lucia-auth/adapter-postgresql";
const { Pool } = pg

const config: ConnectionConfig = {
	host: 'localhost',
	user: 'postgres',
	password: 'postgres',
	database: 'event_management_system_db'
}

const pool = new Pool(config)

export const adapter = new NodePostgresAdapter(pool, {
	user: "users",
	session: "user_session"
});

export const query = (text: string, params: string[]) => {
	return pool.query(text, params)
}

