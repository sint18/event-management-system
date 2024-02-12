import pg from 'pg';
import type { ConnectionConfig } from 'pg';
const { Pool } = pg

const config: ConnectionConfig = {
	host: 'localhost',
	user: 'postgres',
	password: 'postgres',
	database: 'event_management_system_db'
}

const pool = new Pool(config)

export const query = (text: string, params: string[]) => {
	return pool.query(text, params)
}

