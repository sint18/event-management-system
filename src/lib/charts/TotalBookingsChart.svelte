<script lang="ts">
	import { Chart, type ChartConfiguration, type ChartData } from 'chart.js/auto';
	import { onMount } from 'svelte';

	let chart: HTMLCanvasElement
	export let sourceData
	Chart.defaults.color = '#ffffff'
	Chart.defaults.borderColor = '#f0f0f2'

	const chart1Data: ChartData = {
		labels: sourceData.totalBookingsByMonth.map(row => row['month']),
		datasets: [
			{
				label: 'Booking Counts',
				data: sourceData.totalBookingsByMonth.map(row => row['bookings'])
			}
		]
	}

	const chart1Config: ChartConfiguration = {
		type: 'line',
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
					text: 'Total Bookings by Month',
					font: {
						size: 24
					}
				}
			},
			scales: {
				y: {
					beginAtZero: true
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

