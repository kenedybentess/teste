new Chart(document.getElementById('graficoOrigem'), {
    type: 'pie',
    data: {
        labels: Object.keys(origemCount),
        datasets: [{ data: Object.values(origemCount), backgroundColor: ['#dc3545', '#ffc107', '#17a2b8', '#6c757d'] }]
    },
    options: { 
        responsive: true, 
        maintainAspectRatio: false, // adiciona essa linha
        plugins: { legend: { position: 'bottom' } } 
    }
});