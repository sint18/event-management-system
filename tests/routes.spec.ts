import { test, expect, type Page } from '@playwright/test';
import { goto } from '$app/navigation';

test.describe('should be able to navigate to different routes WITHOUT logging in', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('home page', async ({ page }) => {
		await page.getByRole('link', { name: 'Home' }).click();
		await page.waitForURL('/');

		await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'Log In' })).toBeVisible();
	});

	test('bookings page', async ({ page }) => {
		await page.getByRole('link', { name: 'Bookings' }).click();
		await page.waitForURL('/bookings');
		await expect(page.getByText('You must be logged in to access this feature.')).toBeVisible();

	});

	test('account page', async ({ page }) => {
		await page.getByRole('link', { name: 'Account' }).click();
		await page.waitForURL('/account');
		await expect(page.getByText('You must be logged in to access this feature.')).toBeVisible();

	});

});

test.describe('should be able to navigate to different routes after logging in', () => {
	test.beforeEach(async ({ page }) => {
		await login(page)
	});

	test('home page', async ({ page }) => {
		await page.getByRole('link', { name: 'Home' }).click();
		await page.waitForURL('/');

		await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Log Out' })).toBeVisible();
	});

	test('bookings page', async ({ page }) => {
		await page.getByRole('link', { name: 'Bookings' }).click();
		await page.waitForURL('/bookings');
		await expect(page.getByRole('heading', { name: 'Bookings' })).toBeVisible();

	});

	test('account page', async ({ page }) => {
		await page.getByRole('link', { name: 'Account' }).click();
		await page.waitForURL('/account');

		await expect(page.getByRole('heading', { name: 'Account Details' })).toBeVisible();

	});

});

test.describe('View event information', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('should display event information correctly', async ({ page }) => {
		await page.goto('/event/9')
		await expect(page.getByRole('heading', { name: 'Test Undefined Event' })).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Description' })).toBeVisible();
		await expect(page.getByRole('cell', { name: 'Start Date' })).toBeVisible();
		await expect(page.getByRole('cell', { name: 'End Date' })).toBeVisible();
		await expect(page.getByRole('cell', { name: 'Duration' })).toBeVisible();
		await expect(page.getByRole('cell', { name: 'Location' })).toBeVisible();
		await expect(page.getByRole('cell', { name: 'Organizer', exact: true })).toBeVisible();
		await expect(page.getByRole('cell', { name: 'Organizer Description' })).toBeVisible();
		await expect(page.getByRole('cell', { name: 'Category' })).toBeVisible();
		await expect(page.getByRole('cell', { name: 'Status' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Book Event' })).toBeVisible();
	});

})

test.describe('Book an event', () => {

	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('should be able to click the see more link', async ({ page }) => {
		await page.locator('div.card')
			.filter({ has: page.getByText('New Test Event') })
			.getByRole('link', { name: 'See More' })
			.click();
		await expect(page.getByRole('heading', { name: 'New Test Event' })).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Description' })).toBeVisible();
	});

	test('should NOT be able to book an expired event', async ({ page }) => {

		await page.locator('div.card')
			.filter({ has: page.getByText('New Test Event') })
			.getByRole('link', { name: 'See More' })
			.click();

		// await card.getByRole('link', { name: 'See More'}).click()
		await page.waitForURL('/event/5');

		await expect(page.getByRole('heading', { name: 'New Test Event' })).toBeVisible();

		await expect(page.getByRole('button', { name: 'Book Event' })).toBeDisabled();

	});

	test('should display error message on unavailable filter', async ({ page }) => {
		await page.getByRole('button', { name: 'Filter Options' }).click();
		await page.getByLabel('Category').selectOption('3');

		await expect(page.getByText('No available events')).toBeVisible();

	});

	test('should be able to book an event while logged in', async ({ page }) => {
		await login(page)
		const eventName = 'Test Undefined Event'
		await page.locator('div.card')
			.filter({ has: page.getByText(eventName) })
			.getByRole('link', { name: 'See More' })
			.click();

		await page.waitForURL('/event/9');

		await expect(page.getByRole('heading', { name: eventName })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Book Event' })).toBeEnabled();

		await page.getByRole('button', { name: 'Book Event' }).click()

		await expect(page.getByTestId('modal').getByText('Do you wish to book this')).toBeVisible()

		// await expect(page.getByText('Booking successful!\nA confirmation email has been sent.')).toBeVisible()
	});

	test('should be able to book an event without logging in', async ({ page }) => {
		const eventName = 'Test Undefined Event'
		await page.locator('div.card')
			.filter({ has: page.getByText(eventName) })
			.getByRole('link', { name: 'See More' })
			.click();

		await page.waitForURL('/event/9');

		await expect(page.getByRole('heading', { name: eventName })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Book Event' })).toBeEnabled();

		await page.getByRole('button', { name: 'Book Event' }).click()
		await expect(page.getByTestId('modal').getByText('Please enter your username and confirm booking.')).toBeVisible()
		await expect(page.getByPlaceholder('Enter Username . .')).toBeVisible();

		// await expect(page.getByText('Booking successful!\nA confirmation email has been sent.')).toBeVisible()
	});

})

async function login(page: Page){
	await page.goto('/login');
	// Fill data
	await page.getByLabel('Username').fill('testuser')
	await page.getByLabel('Password').fill('testuser')

	await page.getByRole('button', {name: 'Login'}).click()

	await page.waitForURL('/');
	await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible()
	await expect(page.getByText('testuser')).toBeVisible()
}
test.describe('Booking and account information', () => {

	test.beforeEach(async ({ page }) => {
		await login(page)
	});

	test('should display booking page  correctly', async({ page }) => {
		await page.goto('/bookings')
		await expect(page.getByRole('heading', { name: 'Present' })).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Past' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'Test Undefined Event 01/01/' })).toBeVisible();
	})

	test('should display booking information', async ({ page }) => {
		await page.getByRole('link', { name: 'Bookings' }).click();
		await page.waitForURL('/bookings')
		await expect(page.getByRole('heading', { name: 'Bookings' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'New Test Event' })).toBeVisible();
		await page.getByRole('link', { name: 'New Test Event' }).click();
		await page.waitForURL('/bookings/20240414172918314')
		await expect(page.getByRole('heading', { name: 'Booking Details' })).toBeVisible();
	});

	test('should display account information', async ({ page }) => {
		await page.getByRole('link', { name: 'Account' }).click();
		await page.waitForURL('/account')

		await expect(page.getByRole('heading', { name: 'Account Details' })).toBeVisible();
		await expect(page.getByText('Name', { exact: true })).toBeVisible();
		await expect(page.getByText('TEST USER')).toBeVisible();
		await page.getByText('Username').click();
		await expect(page.locator('#page-content').getByText('testuser', { exact: true })).toBeVisible();
		await expect(page.getByText('Email', { exact: true })).toBeVisible();
		await expect(page.getByText('testuser@gmail.com')).toBeVisible();
		await expect(page.getByText('Points Earned')).toBeVisible();
		await expect(page.getByText('0')).toBeVisible();

		await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Change Password' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Update Email' })).toBeVisible();

	});

})

test.describe('Account functionalities', () => {

	test.beforeEach( async({ page }) => {
		await login(page)
		await page.goto('/account')

	})

	test('should be able to change password', async ({ page }) => {
		await page.getByRole('button', { name: 'Change Password' }).click();
		await expect(page.getByTestId('modal-component').getByText('Change Password')).toBeVisible();
		await expect(page.getByPlaceholder('Enter Current Password . .')).toBeEmpty();
		await expect(page.getByPlaceholder('Enter New Password . .')).toBeEmpty();
		await expect(page.getByPlaceholder('Confirm New Password . .')).toBeEmpty();

		await page.getByPlaceholder('Enter Current Password . .').fill('testuser')
		await page.getByPlaceholder('Enter New Password . .').fill('testuser')
		await page.getByPlaceholder('Confirm New Password . .').fill('testuser')

		await page.getByRole('button', { name: 'Save' }).click()
		await expect(page.getByText('Password successfully changed')).toBeVisible()
	});

	test('should be able to change email', async ({ page }) => {
		await page.getByRole('button', { name: 'Update Email' }).click();
		await expect(page.getByTestId('modal-component').getByText('Change Email')).toBeVisible();
		await expect(page.getByPlaceholder('Enter New Email . .')).toBeEmpty();
		await expect(page.getByPlaceholder('Enter Password . .')).toBeEmpty();

		await page.getByPlaceholder('Enter New Email . .').fill('testuser@gmail.com')
		await page.getByPlaceholder('Enter Password . .').fill('testuser')

		await page.getByRole('button', { name: 'Save' }).click()
		await expect(page.getByText('Email successfully changed')).toBeVisible()
	});


})

