document.addEventListener('DOMContentLoaded', function () {
	const ctx = document.getElementById('graficoReceitasDespesas').getContext('2d');

	const data = {
		labels: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
		datasets: [
			{
				label: 'Receita',
				data: [500, 1000, 1500, 3000, 4500, 4000, 3500, 2500, 2000, 3000, 5000, 7000],
				borderColor: '#000000',
				backgroundColor: 'rgb(37, 224, 0)',
				tension: 0.1,
			},
			{
				label: 'Despesa',
				data: [300, 500, 800, 1000, 1200, 1000, 900, 850, 1000, 1500, 2000, 2500],
				borderColor: '#000000',
				backgroundColor: 'rgb(255, 17, 0)',
				tension: 0.1,
			},
		],
	};

	const config = {
		type: 'line',
		data: data,
		options: {
			responsive: true,
			plugins: {
				legend: {
					display: true,
					position: 'top',
				},
			},
			scales: {
				y: {
					beginAtZero: true,
				},
			},
		},
	};

	new Chart(ctx, config);
});




