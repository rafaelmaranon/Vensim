class VensimSimulator {
    constructor() {
        this.chart = null;
        this.simulationData = [];
        this.isRunning = false;
        
        this.initializeEventListeners();
        this.initializeChart();
    }

    initializeEventListeners() {
        document.getElementById('runSimulation').addEventListener('click', () => this.runSimulation());
        document.getElementById('resetSimulation').addEventListener('click', () => this.resetSimulation());
    }

    initializeChart() {
        const ctx = document.getElementById('resultsChart').getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Work Accomplished',
                        data: [],
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.1)',
                        tension: 0.1,
                        fill: true
                    },
                    {
                        label: 'Work Remaining',
                        data: [],
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.1)',
                        tension: 0.1,
                        fill: true
                    },
                    {
                        label: 'Work Flow Rate',
                        data: [],
                        borderColor: 'rgb(54, 162, 235)',
                        backgroundColor: 'rgba(54, 162, 235, 0.1)',
                        tension: 0.1,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Time (months)'
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Work (drawings)'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Flow Rate (drawings/month)'
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Project Management Model - System Dynamics Simulation'
                    },
                    legend: {
                        display: true
                    }
                }
            }
        });
    }

    getModelParameters() {
        return {
            initialProjectDefinition: parseFloat(document.getElementById('initialWork').value),
            baseWorkFlow: parseFloat(document.getElementById('workFlow').value),
            simulationTime: parseFloat(document.getElementById('simulationTime').value),
            dt: parseFloat(document.getElementById('timeStep').value)
        };
    }

    runSimulation() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        document.getElementById('runSimulation').disabled = true;
        document.getElementById('runSimulation').textContent = '⏳ Running...';

        const params = this.getModelParameters();
        this.simulationData = this.simulate(params);
        this.updateChart();
        this.updateMetrics();

        this.isRunning = false;
        document.getElementById('runSimulation').disabled = false;
        document.getElementById('runSimulation').textContent = '🚀 Run Simulation';
    }

    simulate(params) {
        const { initialProjectDefinition, baseWorkFlow, simulationTime, dt } = params;
        const data = [];
        
        // Initial conditions
        let time = 0;
        let workAccomplished = 0;
        let workRemaining = initialProjectDefinition;
        let projectIsDone = 0;
        let workFlow = baseWorkFlow;

        // Simulation loop
        while (time <= simulationTime) {
            // Calculate current state
            projectIsDone = workAccomplished >= initialProjectDefinition ? 1 : 0;
            workFlow = projectIsDone ? 0 : baseWorkFlow;
            workRemaining = Math.max(0, initialProjectDefinition - workAccomplished);

            // Store data point
            data.push({
                time: parseFloat(time.toFixed(2)),
                workAccomplished: parseFloat(workAccomplished.toFixed(2)),
                workRemaining: parseFloat(workRemaining.toFixed(2)),
                workFlow: parseFloat(workFlow.toFixed(2)),
                projectIsDone: projectIsDone
            });

            // Integration step (Euler method)
            if (!projectIsDone) {
                workAccomplished += workFlow * dt;
            }

            time += dt;

            // Safety break if project is done and we have enough data
            if (projectIsDone && data.length > 10) {
                // Add a few more points to show the completion clearly
                for (let i = 0; i < 5; i++) {
                    time += dt;
                    data.push({
                        time: parseFloat(time.toFixed(2)),
                        workAccomplished: parseFloat(workAccomplished.toFixed(2)),
                        workRemaining: 0,
                        workFlow: 0,
                        projectIsDone: 1
                    });
                }
                break;
            }
        }

        return data;
    }

    updateChart() {
        const times = this.simulationData.map(d => d.time);
        const workAccomplished = this.simulationData.map(d => d.workAccomplished);
        const workRemaining = this.simulationData.map(d => d.workRemaining);
        const workFlow = this.simulationData.map(d => d.workFlow);

        this.chart.data.labels = times;
        this.chart.data.datasets[0].data = workAccomplished;
        this.chart.data.datasets[1].data = workRemaining;
        this.chart.data.datasets[2].data = workFlow;
        
        this.chart.update();
    }

    updateMetrics() {
        if (this.simulationData.length === 0) return;

        const lastDataPoint = this.simulationData[this.simulationData.length - 1];
        const completionPoint = this.simulationData.find(d => d.projectIsDone === 1);
        
        // Update metrics display
        document.getElementById('completionTime').textContent = 
            completionPoint ? completionPoint.time.toFixed(1) : 'Not completed';
        
        document.getElementById('finalWork').textContent = 
            lastDataPoint.workAccomplished.toFixed(0);
        
        document.getElementById('workRemaining').textContent = 
            lastDataPoint.workRemaining.toFixed(0);
        
        document.getElementById('projectStatus').textContent = 
            lastDataPoint.projectIsDone ? '✅ Complete' : '🔄 In Progress';

        // Add completion animation if project is done
        if (lastDataPoint.projectIsDone) {
            document.getElementById('projectStatus').style.color = '#22c55e';
            document.getElementById('completionTime').style.color = '#22c55e';
        } else {
            document.getElementById('projectStatus').style.color = '#f59e0b';
            document.getElementById('completionTime').style.color = '#f59e0b';
        }
    }

    resetSimulation() {
        this.simulationData = [];
        
        // Clear chart
        this.chart.data.labels = [];
        this.chart.data.datasets.forEach(dataset => {
            dataset.data = [];
        });
        this.chart.update();

        // Reset metrics
        document.getElementById('completionTime').textContent = '-';
        document.getElementById('finalWork').textContent = '-';
        document.getElementById('workRemaining').textContent = '-';
        document.getElementById('projectStatus').textContent = '-';
        
        // Reset colors
        document.getElementById('projectStatus').style.color = '';
        document.getElementById('completionTime').style.color = '';

        // Reset form values to defaults
        document.getElementById('initialWork').value = 1000;
        document.getElementById('workFlow').value = 100;
        document.getElementById('simulationTime').value = 15;
        document.getElementById('timeStep').value = 0.1;
    }
}

// Initialize the simulator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.simulator = new VensimSimulator();
    
    // Add some helpful tooltips and interactions
    addInteractiveFeatures();
});

function addInteractiveFeatures() {
    // Add real-time parameter updates
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', (e) => {
            // Add visual feedback for parameter changes
            e.target.style.borderColor = '#3b82f6';
            setTimeout(() => {
                e.target.style.borderColor = '';
            }, 300);
        });
    });

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'Enter':
                    e.preventDefault();
                    if (!window.simulator.isRunning) {
                        window.simulator.runSimulation();
                    }
                    break;
                case 'r':
                    e.preventDefault();
                    window.simulator.resetSimulation();
                    break;
            }
        }
    });

    // Add parameter validation
    inputs.forEach(input => {
        input.addEventListener('blur', validateInput);
    });
}

function validateInput(e) {
    const input = e.target;
    const value = parseFloat(input.value);
    const min = parseFloat(input.min);
    const max = parseFloat(input.max);
    
    if (isNaN(value) || value < min || value > max) {
        input.style.borderColor = '#ef4444';
        input.style.backgroundColor = '#fef2f2';
        
        // Reset to default if invalid
        setTimeout(() => {
            input.style.borderColor = '';
            input.style.backgroundColor = '';
        }, 2000);
    }
}
