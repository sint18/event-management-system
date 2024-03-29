import * as db from '$lib/server/db';
import { fail } from '@sveltejs/kit';

export async function load() {
	const query = await db.query(`
      select id                                             as "ID",
             category_name                                  as "Category",
             to_char(last_updated, 'DD/MM/YYYY HH24:MI:SS') as "Last Updated",
             case
                 when active then 'ACTIVE'
                 else
                     'INACTIVE'
                 end
                                                            as "Status"
      from event_category;
	`, []);
	return { categories: query.rows };
}

export const actions = {
	getCategory: async ({ request }) => {
		const data = await request.formData();
		const categoryId = <string>data.get('categoryId');

		const query = await db.query(`
        select id,
               category_name,
               to_char(last_updated, 'YYYY-MM-DD HH24:MI:SS') as last_updated
        from event_category
        where id = $1;
		`, [categoryId]);
		return { categoryInfo: query.rows[0] };

	},
	create: async ({ request }) => {
		const data = await request.formData();
		const name = <string>data.get('name');
		const status = <string>data.get('status');

		const query = await db.query(`
        insert into event_category (category_name, active)
        VALUES ($1, $2);
		`, [name, status]);

		if (query.rowCount && query.rowCount > 0) {
			return { success: true, message: 'A new category has been created' };
		}

	},
	update: async ({ request }) => {
		const data = await request.formData();
		const categoryId = <string>data.get('categoryId');
		const name = <string>data.get('name');

		if (!categoryId) return fail(400, { error: true, message: 'Category ID cannot be empty' })
		if (!name) return fail(400, { error: true, message: 'Category Name cannot be empty' })

		try {
			const query = await db.query(`
          update event_category
          set category_name = $1,
              last_updated  = now()
          where id = $2;
			`, [name, categoryId]);
			if (query.rowCount && query.rowCount > 0) {
				return { success: true, message: 'Category information successfully updated' };
			}
		} catch (error: any) {
			return fail(400, { error: true, message: error.message });
		}

	},
	delete: async ({ request }) => {
		const data = await request.formData();
		const categoryId = <string>data.get('categoryId');

		try {
			const query = await db.query(`
          update event_category
          set active = false
          where id = $1;
			`, [categoryId]);
			if (query.rowCount && query.rowCount > 0) {
				return { success: true, message: 'Category successfully Deactivated' };
			}
		} catch (error: any) {
			return fail(400, { error: true, message: error.message });
		}

	}
};