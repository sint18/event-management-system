import { Job, scheduleJob } from 'node-schedule';
import * as db from '$lib/server/db';

let currentJob: Job | null = null
export function startJob() {
	if (!currentJob) {
		currentJob = scheduleJob('0 1 * * *', async function() {
			// Calling database function here
			await db.query('call update_task();', [])
			console.log(`Job running : ${new Date().toLocaleString()}`);
		});
	}
}
