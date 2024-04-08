export interface BookingInfo {
	id: number,
	booking_ref: string,
	booking_datetime: string,
	status: string,
	event_name: string,
	location: string,
	event_datetime: string
}

export interface PasswordForm {
	currentPassword: string,
	newPassword: string,
	confirmNewPassword: string
}

export interface EmailForm {
	newEmail: string,
	password: string
}

export interface UserAccount {
	username: string,
	password: string
	email: string,
	firstName: string,
	lastName: string,
	role: string
}