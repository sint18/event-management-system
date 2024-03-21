export const checkStatus = (status: string) => {
	if (status === 'booked') return 'variant-filled-secondary'
	if (status === 'cancelled') return 'variant-filled-error'
	if (status === 'present') return 'variant-filled-primary'
	if (status === 'absent') return 'variant-filled-warning'
}