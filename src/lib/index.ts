import { tableMapperValues, type TableSource } from '@skeletonlabs/skeleton';

export const checkStatus = (status: string) => {
	if (status === 'booked') return 'variant-filled-secondary'
	if (status === 'cancelled') return 'variant-filled-error'
	if (status === 'present') return 'variant-filled-primary'
	if (status === 'absent') return 'variant-filled-warning'
}

export function setTableSource(headers: string[], sourceData: string[]): TableSource {
	return {
		head: headers,
		body: tableMapperValues(sourceData, headers),
		meta: tableMapperValues(sourceData, headers)
	};
}