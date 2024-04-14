import { test, expect } from '@playwright/test';

test.describe('Admin Login', () => {

	test.beforeEach(async ({ page }) => {
		await page.goto('/admin/login');
	});


	test('should be able to login with the right credentials', async ({ page }) => {

		// Fill data
		await page.getByLabel('Username').fill('admin')
		await page.getByLabel('Password').fill('admin')

		await page.getByRole('button', {name: 'Login'}).click()

		await page.waitForURL('http://localhost:5173/admin');
		await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()

	})

	test('should NOT be able to login with incorrect credentials', async ({ page }) => {
		// 	Locate fields
		await page.getByLabel('Username').fill('admin')
		await page.getByLabel('Password').fill('wrongpassword')

		await page.getByRole('button', {name: 'Login'}).click()

		await expect(page.getByText('Incorrect password or username')).toBeVisible()
	})

	test('should NOT be able to login with empty username field', async ({ page }) => {
		// 	Locate fields
		await page.getByLabel('Username').fill('')

		await page.getByRole('button', {name: 'Login'}).click()

		await expect(page.getByText('Username cannot be empty')).toBeVisible()
	})

	test('should NOT be able to login with empty password field', async ({ page }) => {
		// 	Locate fields
		await page.getByLabel('Username').fill('test')

		await page.getByRole('button', {name: 'Login'}).click()

		await expect(page.getByText('Password cannot be empty')).toBeVisible()
	})
})

test.describe('Admin account information and log out', () => {

	test.beforeEach(async ({ page }) => {
		await page.goto('/admin/login');

		await page.getByLabel('Username').fill('admin')
		await page.getByLabel('Password').fill('admin')

		await page.getByRole('button', {name: 'Login'}).click()

		// await page.goto('/admin')
		await page.waitForURL('**/admin');
		await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
	});

	test('should display admin account information', async ({ page }) => {

		await page.getByRole('link', { name: 'admin'}).click()
		await page.waitForURL('/admin/users/12')
		await expect(page.getByRole('heading', { name: 'User Information'})).toBeVisible()
	})

	test('should display log out confirmation box', async ({ page }) => {

		await page.getByRole('button', { name: 'Log Out'}).click()
		await expect(page.getByText('Do you want to Log Out of your account?')).toBeVisible()
	})

	test('should be able to log out', async ({ page }) => {

		await page.getByRole('button', { name: 'Log Out'}).click()
		await expect(page.getByText('Do you want to Log Out of your account?')).toBeVisible()
		await page.getByTestId('modal').getByRole('button', {name: 'Log Out'}).click()
		await page.waitForURL('/admin/login')
		await expect(page.getByRole('heading', { name: 'Event Management System'})).toBeVisible()
	})
})

test.describe('User Login', () => {

	test.beforeEach(async ({ page }) => {
		await page.goto('/login');
	});

	test('should be able to login with the right credentials', async ({ page }) => {

		// Fill data
		await page.getByLabel('Username').fill('testuser')
		await page.getByLabel('Password').fill('testuser')

		await page.getByRole('button', {name: 'Login'}).click()

		await page.waitForURL('/');
		await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible()

	})

	test('should NOT be able to login with incorrect credentials', async ({ page }) => {
		// 	Locate fields
		await page.getByLabel('Username').fill('testuser')
		await page.getByLabel('Password').fill('wrongpassword')

		await page.getByRole('button', {name: 'Login'}).click()

		await expect(page.getByText('Incorrect password or username')).toBeVisible()
	})

	test('should NOT be able to login with empty username field', async ({ page }) => {
		// 	Locate fields
		await page.getByLabel('Username').fill('')

		await page.getByRole('button', {name: 'Login'}).click()

		await expect(page.getByText('Username cannot be empty')).toBeVisible()
	})

	test('should NOT be able to login with empty password field', async ({ page }) => {
		// 	Locate fields
		await page.getByLabel('Username').fill('test')

		await page.getByRole('button', {name: 'Login'}).click()

		await expect(page.getByText('Password cannot be empty')).toBeVisible()
	})
})


