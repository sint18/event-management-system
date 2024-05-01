import { test, expect } from '@playwright/test';

test.describe('User authentication', () => {

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

	test('should be able to log out', async ({ page }) => {
		// 	Locate fields
		await page.getByLabel('Username').fill('testuser')
		await page.getByLabel('Password').fill('testuser')

		await page.getByRole('button', {name: 'Login'}).click()

		await page.waitForURL('/');
		await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible()
		await expect(page.getByRole('button', { name: 'Log Out' })).toBeVisible();

		await page.getByRole('button', { name: 'Log Out' }).click();
		await expect(page.getByText('Do you want to Log Out of')).toBeVisible();
		await page.getByTestId('modal').getByRole('button', { name: 'Log Out' }).click();

		await page.waitForURL('/login');
		await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

	})


})


