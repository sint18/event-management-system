import * as db from '$lib/server/db';
import { fail } from '@sveltejs/kit';

export async function load() {
	const query = await db.query(`
      select id                                             as "ID",
             organizer_name                                 as "Category",
             to_char(last_updated, 'DD/MM/YYYY HH24:MI:SS') as "Last Updated",
             case
                 when active then 'ACTIVE'
                 else
                     'INACTIVE'
                 end
                                                            as "Status"
      from organizers;
	`, []);
	return { organizers: query.rows };
}

export const actions = {
	getOrg: async ({ request }) => {
		const data = await request.formData();
		const orgId = <string>data.get('orgId');

		const query = await db.query(`
        select id,
               organizer_name,
               active,
               description,
               to_char(last_updated, 'YYYY-MM-DD HH24:MI:SS') as last_updated
        from organizers
        where id = $1;
		`, [orgId]);
		return { organizerInfo: query.rows[0] };

	},
	create: async ({ request }) => {
		const data = await request.formData();
		const name = <string>data.get('name');
		const status = <string>data.get('status');
		const description = <string>data.get('description');

		const query = await db.query(`
        insert into organizers (organizer_name, description, active)
        VALUES ($1, $2, $3);
		`, [name, description, status]);

		if (query.rowCount && query.rowCount > 0) {
			return { success: true, message: 'A new organization has been created' };
		}

	},
	update: async ({ request }) => {
		const data = await request.formData();
		const orgId = <string>data.get('orgId');
		const name = <string>data.get('name');
		const description = <string>data.get('description');

		if (!orgId) return fail(400, { error: true, message: 'Organization ID cannot be empty' })
		if (!name) return fail(400, { error: true, message: 'Organization Name cannot be empty' })

		try {
			const query = await db.query(`
          update organizers
          set organizer_name = $1,
              description = $2,
              last_updated  = now()
          where id = $3;
			`, [name, description, orgId]);
			if (query.rowCount && query.rowCount > 0) {
				return { success: true, message: 'Organization information successfully updated' };
			}
		} catch (error: any) {
			return fail(400, { error: true, message: error.message });
		}

	},
	delete: async ({ request }) => {
		const data = await request.formData();
		const orgId = <string>data.get('orgId');

		try {
			const query = await db.query(`
          update organizers
          set active = false
          where id = $1;
			`, [orgId]);
			if (query.rowCount && query.rowCount > 0) {
				return { success: true, message: 'Organization successfully Deactivated' };
			}
		} catch (error: any) {
			return fail(400, { error: true, message: error.message });
		}

	},
	activate: async ({ request }) => {
		const data = await request.formData();
		const orgId = <string>data.get('orgId');

		try {
			const query = await db.query(`
          update organizers
          set active = true
          where id = $1;
			`, [orgId]);
			if (query.rowCount && query.rowCount > 0) {
				return { success: true, message: 'Organization successfully Activated' };
			}
		} catch (error: any) {
			return fail(400, { error: true, message: error.message });
		}

	}
};