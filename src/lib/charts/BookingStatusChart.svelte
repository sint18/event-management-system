<script lang="ts">
	import { Chart, type ChartConfiguration, type ChartData } from 'chart.js/auto';
	import { onMount } from 'svelte';

	let chart: HTMLCanvasElement
	export let sourceData
	Chart.defaults.color = '#ffffff'

	const chart1Data: ChartData = {
		labels: sourceData.bookingStatusAnalytics.map(row => row['status']),
		datasets: [
			{
				label: 'Booking Counts',
				data: sourceData.bookingStatusAnalytics.map(row => row['count'])
			}
		]
	}

	const chart1Config: ChartConfiguration = {
		type: 'doughnut',
		data: chart1Data,
		options: {
			responsive: true,
			plugins: {
				legend: {
					position: 'top',
					labels: {
						font: {
							size: 14
						}
					}
				},
				title: {
					display: true,
					text: 'Total Bookings grouped by Status',
					font: {
						size: 24
					}
				}
			}
		},
	};

	onMount(()=> {
		const ctx = chart.getContext('2d');
		if (ctx) {
			// Initialize chart using default config set
			new Chart(ctx, chart1Config);
		}
	})

</script>

<canvas bind:this={chart}></canvas>

