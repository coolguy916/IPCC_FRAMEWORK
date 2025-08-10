function initBarChart(canvasId) {
    const colors = {
        blue: '#3b82f6',
        orange: '#f97316',
        gray: '#6b7280',
        text: '#ffffff', // Changed to white
        border: document.documentElement.getAttribute('data-theme') === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
    };

    const ctx = document.getElementById(canvasId).getContext('2d');
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['HTML', 'CSS', 'JavaScript', 'Images', 'Fonts', 'API'],
            datasets: [{
                label: 'Cache Hit',
                data: [85, 92, 78, 95, 88, 72],
                backgroundColor: colors.blue,
                borderRadius: 6,
                borderSkipped: false,
            }, {
                label: 'Cache Miss',
                data: [10, 6, 15, 3, 8, 20],
                backgroundColor: colors.orange,
                borderRadius: 6,
                borderSkipped: false,
            }, {
                label: 'No Cache',
                data: [5, 2, 7, 2, 4, 8],
                backgroundColor: colors.gray,
                borderRadius: 6,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            layout: {
                padding: {
                    top: 20,
                    right: 20,
                    bottom: 40,
                    left: 20
                }
            },
            scales: {
                x: { grid: { color: colors.border, lineWidth: 1 }, ticks: { color: colors.text, font: { size: 12, weight: '500' } } },
                y: { grid: { color: colors.border, lineWidth: 1 }, ticks: { color: colors.text, font: { size: 12, weight: '500' } } }
            }
        }
    });
}

function initLineChart(canvasId) {
    const colors = {
        blue: '#3b82f6',
        orange: '#f97316',
        text: '#ffffff', // Changed to white
        border: document.documentElement.getAttribute('data-theme') === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
    };

    const ctx = document.getElementById(canvasId).getContext('2d');
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Aug 01', 'Aug 02', 'Aug 03', 'Aug 04', 'Aug 05', 'Aug 06'],
            datasets: [{
                label: 'CPU Usage',
                data: [65, 70, 68, 72, 75, 73],
                borderColor: colors.blue,
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointHoverRadius: 6,
            }, {
                label: 'Memory Usage',
                data: [55, 60, 58, 62, 65, 63],
                borderColor: colors.orange,
                backgroundColor: 'rgba(249, 115, 22, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointHoverRadius: 6,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
             layout: {
                padding: {
                    top: 20,
                    right: 20,
                    bottom: 40,
                    left: 20
                }
            },
            scales: {
                x: { grid: { color: colors.border, lineWidth: 1 }, ticks: { color: colors.text, font: { size: 12, weight: '500' } } },
                y: { grid: { color: colors.border, lineWidth: 1 }, ticks: { color: colors.text, font: { size: 12, weight: '500' } }, min: 0, max: 100 }
            },
            interaction: { intersect: false, mode: 'index' }
        }
    });
}

function updateNumericDisplay(containerId, value, label, iconClass, isPercentage = false) {
    const container = document.getElementById(containerId);
    container.innerHTML = `
        <div class="stat-icon">
            <i class="${iconClass}"></i>
        </div>
        <div class="stat-value">${value}${isPercentage ? '%' : ''}</div>
        <div class="stat-label">${label}</div>
    `;
    
    setInterval(() => {
        const newValue = Math.floor(Math.random() * 100);
        container.querySelector('.stat-value').textContent = `${newValue}${isPercentage ? '%' : ''}`;
    }, 5000);
}

function initPentagonalChart(canvasId) {
    const colors = {
        blue: '#3b82f6',
        orange: '#f97316',
        green: '#10b981',
        gray: '#6b7280',
        text: '#ffffff', // Changed to white
        border: document.documentElement.getAttribute('data-theme') === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
    };

    const ctx = document.getElementById(canvasId).getContext('2d');
    return new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Load Time', 'First Paint', 'DOM Loaded', 'Cache Efficiency', 'JS Execution'],
            datasets: [
                {
                    label: 'Chrome',
                    data: [75, 80, 85, 85, 78],
                    borderColor: '#ffffff',
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    borderWidth: 2,
                    pointBackgroundColor: colors.blue
                },
                {
                    label: 'Firefox',
                    data: [68, 75, 80, 78, 72],
                    borderColor: '#ffffff',
                    backgroundColor: 'rgba(249, 115, 22, 0.2)',
                    borderWidth: 2,
                    pointBackgroundColor: colors.orange
                },
                {
                    label: 'Safari',
                    data: [82, 85, 78, 92, 76],
                    borderColor: '#ffffff',
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    borderWidth: 2,
                    pointBackgroundColor: colors.green
                },
                {
                    label: 'IE',
                    data: [55, 60, 52, 65, 58],
                    borderColor: '#ffffff',
                    backgroundColor: 'rgba(107, 114, 128, 0.2)',
                    borderWidth: 2,
                    pointBackgroundColor: colors.gray
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20
                }
            },
            scales: {
                r: {
                    angleLines: { color: colors.border },
                    grid: { color: colors.border },
                    pointLabels: { color: colors.text, font: { size: 12, weight: '500' } },
                    ticks: { color: colors.text, backdropColor: 'transparent' }
                }
            },
            plugins: { legend: { display: false } }
        }
    });
}

function initGaugeChart(canvasId) {
    const colors = {
        blue: '#3b82f6',
        orange: '#f97316',
        green: '#10b981',
        gray: '#6b7280',
        text: '#ffffff', // Changed to white
        border: document.documentElement.getAttribute('data-theme') === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
    };

    const ctx = document.getElementById(canvasId).getContext('2d');
    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [75, 25],
                backgroundColor: [colors.blue, colors.gray],
                borderWidth: 0,
                cutout: '85%', // Increased cutout for even smaller gauge ring
                circumference: 180,
                rotation: 270
            }]
            
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: 45, // Further reduced padding
                    right: 45,
                    bottom: 75,
                    left: 45
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            },
            animation: {
                animateRotate: true,
                animateScale: true
            }
        },
        plugins: [{
            id: 'gaugeText',
            afterDraw: (chart) => {
                const { width, height, ctx } = chart;
                ctx.restore();
                const fontSize = (height / 180).toFixed(2); // Smaller font size
                ctx.font = `${fontSize}em sans-serif`;
                ctx.textBaseline = 'middle';
                ctx.fillStyle = colors.text; // White text
                const text = '75%';
                const textX = Math.round((width - ctx.measureText(text).width) / 2);
                const textY = height / 1.5; // Adjusted position for smaller gauge
                ctx.fillText(text, textX, textY);
                ctx.save();
            }
        }]
    });
}

function initPieChart(canvasId) {
    const colors = {
        text: '#ffffff', // White text color
        border: document.documentElement.getAttribute('data-theme') === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
    };

    const ctx = document.getElementById(canvasId).getContext('2d');
    return new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ["Monday", "Tuesday", "Wednesday", "Thursday"],
            datasets: [{
                data: [1234, 2234, 3234, 4234],
                backgroundColor: ["rgba(117,169,255,0.6)", "rgba(148,223,215,0.6)", "rgba(208,129,222,0.6)", "rgba(247,127,167,0.6)"]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: 20,
                    right: 20,
                    bottom: 40,
                    left: 20
                }
            },
            plugins: {
                legend: { 
                    position: 'top',
                    padding: 20,
                    labels: {
                        color: colors.text, // Set legend text color to white
                        font: { size: 12, weight: '500' }
                    }
                }
            }
        }
    });
}

function initDigitalClock(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '<div class="digital-clock">00:00:00</div>';
    
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        container.querySelector('.digital-clock').textContent = `${hours}:${minutes}:${seconds}`;
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

function initNavBar(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = `
        <nav class="navbar">
            <div class="navbar-brand">Dashboard</div>
            <ul class="navbar-menu">
                <li><a href="#">Home</a></li>
                <li><a href="#">Charts</a></li>
                <li><a href="#">Reports</a></li>
                <li><a href="#">Settings</a></li>
            </ul>
        </nav>
    `;
}

function initSidebar(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = `
        <aside class="sidebar">
            <ul class="sidebar-menu">
                <li><a href="#"><i class="fas fa-tachometer-alt"></i> Overview</a></li>
                <li><a href="#"><i class="fas fa-chart-bar"></i> Charts</a></li>
                <li><a href="#"><i class="fas fa-history"></i> History</a></li>
                <li><a href="#"><i class="fas fa-file-alt"></i> Reports</a></li>
                <li><a href="#"><i class="fas fa-exclamation-triangle"></i> Alerts</a></li>
            </ul>
        </aside>
    `;
}

function initDataFilter(containerId, onFilterChange) {
    const container = document.getElementById(containerId);
    container.innerHTML = `
        <select class="data-filter">
            <option value="all">All Data</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
        </select>
    `;
    
    container.querySelector('.data-filter').addEventListener('change', (e) => {
        if (onFilterChange) onFilterChange(e.target.value);
    });
}

function initExportButtons(containerId, dataCallback) {
    const container = document.getElementById(containerId);
    container.innerHTML = `
        <button class="export-pdf">Export to PDF</button>
        <button class="export-csv">Export to CSV</button>
    `;
    
    container.querySelector('.export-pdf').addEventListener('click', () => {
        const data = dataCallback ? dataCallback() : [];
        if (typeof jsPDF !== 'undefined') {
            const doc = new jsPDF();
            doc.text('Exported Data', 10, 10);
            data.forEach((row, i) => doc.text(JSON.stringify(row), 10, 20 + i*10));
            doc.save('data.pdf');
        } else {
            console.warn('jsPDF not loaded');
        }
    });
    
    container.querySelector('.export-csv').addEventListener('click', () => {
        const data = dataCallback ? dataCallback() : [];
        const csvContent = 'data:text/csv;charset=utf-8,' + data.map(row => row.join(',')).join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'data.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}

function showAlert(message, type = 'info') {
    const alertContainer = document.createElement('div');
    alertContainer.className = `alert alert-${type}`;
    alertContainer.textContent = message;
    document.body.appendChild(alertContainer);
    setTimeout(() => alertContainer.remove(), 5000);
}

function initNotificationSection(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '<div class="notifications"></div>';
    
    function addNotification(message) {
        const notif = document.createElement('div');
        notif.className = 'notification';
        notif.textContent = message;
        container.querySelector('.notifications').appendChild(notif);
        setTimeout(() => notif.remove(), 10000);
    }
    
    container.addNotification = addNotification;
}

function initStatusIndicator(containerId, initialStatus = 'online') {
    const container = document.getElementById(containerId);
    container.innerHTML = '<div class="status-indicator"></div>';
    
    function updateStatus(status) {
        const indicator = container.querySelector('.status-indicator');
        indicator.className = `status-indicator ${status}`;
        indicator.textContent = status.charAt(0).toUpperCase() + status.slice(1);
    }
    
    updateStatus(initialStatus);
    container.updateStatus = updateStatus;
}

function initLogTable(containerId, initialLogs = []) {
    const container = document.getElementById(containerId);
    container.innerHTML = `
        <table class="log-table">
            <thead>
                <tr>
                    <th>Timestamp</th>
                    <th>Message</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    `;
    
    const tbody = container.querySelector('tbody');
    
    function addLog(message) {
        const row = document.createElement('tr');
        const timestamp = new Date().toLocaleString();
        row.innerHTML = `<td>${timestamp}</td><td>${message}</td>`;
        tbody.appendChild(row);
    }
    
    initialLogs.forEach(addLog);
    container.addLog = addLog;
}

function initExecutionLog(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '<div class="execution-log"></div>';
    
    function logExecution(message) {
        const logElem = document.createElement('p');
        logElem.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        container.querySelector('.execution-log').appendChild(logElem);
    }
    
    container.logExecution = logExecution;
}

function initSuggestionCorner(containerId, suggestions = []) {
    const container = document.getElementById(containerId);
    container.innerHTML = `
        <div class="suggestion-corner">
            <h3>Suggestions / Citations</h3>
            <ul></ul>
        </div>
    `;
    
    const ul = container.querySelector('ul');
    
    function addSuggestion(text) {
        const li = document.createElement('li');
        li.textContent = text;
        ul.appendChild(li);
    }
    
    suggestions.forEach(addSuggestion);
    container.addSuggestion = addSuggestion;
}

function initConclusionCorner(containerId, initialText = '') {
    const container = document.getElementById(containerId);
    container.innerHTML = `
        <div class="conclusion-corner">
            <h3>Conclusion / Overview</h3>
            <p>${initialText}</p>
        </div>
    `;
    
    function updateConclusion(text) {
        container.querySelector('p').textContent = text;
    }
    
    container.updateConclusion = updateConclusion;
}

$(function() {
    var from_$input = $('#input_from').pickadate(),
        from_picker = from_$input.pickadate('picker');

    var to_$input = $('#input_to').pickadate(),
        to_picker = to_$input.pickadate('picker');

    // Set initial value to current date (12:11 PM WIB, August 9, 2025)
    const now = new Date('2025-08-09T12:11:00+07:00');
    from_picker.set('select', now);
    to_picker.set('select', now);

    // Check if there’s a “from” or “to” date to start with.
    if (from_picker.get('value')) {
        to_picker.set('min', from_picker.get('select'));
    }
    if (to_picker.get('value')) {
        from_picker.set('max', to_picker.get('select'));
    }

    // When something is selected, update the “from” and “to” limits.
    from_picker.on('set', function(event) {
        if (event.select) {
            to_picker.set('min', from_picker.get('select'));    
        } else if ('clear' in event) {
            to_picker.set('min', false);
        }
    });
    to_picker.on('set', function(event) {
        if (event.select) {
            from_picker.set('max', to_picker.get('select'));
        } else if ('clear' in event) {
            from_picker.set('max', false);
        }
    });
});

window.addEventListener('load', () => {
    if (document.getElementById('barChartCanvas')) initBarChart('barChartCanvas');
    if (document.getElementById('lineChartCanvas')) initLineChart('lineChartCanvas');
    if (document.getElementById('numericDisplayContainer')) updateNumericDisplay('numericDisplayContainer', 85, 'Cache Hit Rate', 'fas fa-database', true);
    if (document.getElementById('pentagonalChartCanvas')) initPentagonalChart('pentagonalChartCanvas');
    if (document.getElementById('gaugeChartCanvas')) initGaugeChart('gaugeChartCanvas');
    if (document.getElementById('pieChartCanvas')) initPieChart('pieChartCanvas');
    if (document.getElementById('digitalClockContainer')) initDigitalClock('digitalClockContainer');
});