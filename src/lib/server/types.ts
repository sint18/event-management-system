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