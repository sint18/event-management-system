import * as db from '$lib/server/db';
import { parse } from 'csv-parse';
import Papa from 'papaparse'
import fs from 'fs';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const file: File = <File>data.get('csvFile');
		console.log();

		// fs.createReadStream(file)
		// 	.pipe(parse())
		// 	.on('data', function(row) {
		// 		console.log(row);
		// 	});
		let sourceData: object[]

		const config = {
			headers: true,
			complete: (result: Papa.ParseResult<never>) => {
				if (result.data) {
					sourceData = result.data
					console.log(sourceData);
				}
			}
		}
		if (file.size > 0) {
			Papa.parse(file.name, config)
		}
	}
};