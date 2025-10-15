# Vensim Model Simulator

A web-based system dynamics simulator that allows users to interact with Vensim-style models without needing to install Vensim software.

## Features

- **Interactive Project Management Model**: Based on the Vensim documentation example
- **Real-time Visualization**: Dynamic charts showing stock and flow behavior over time
- **Parameter Controls**: Adjust model parameters and see immediate results
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Clean, intuitive interface with accessibility features

## Getting Started

1. Open `index.html` in any modern web browser
2. Adjust the model parameters using the controls on the left
3. Click "🚀 Run Simulation" to execute the model
4. View results in the interactive chart and metrics panel
5. Use "🔄 Reset" to clear results and start over

## Model Description

This simulator implements a **Project Management Model** with the following components:

### Stocks (Levels)
- **Work Accomplished**: Accumulates completed work over time

### Flows (Rates)
- **Work Flow**: The rate at which work is completed (drawings/month)

### Auxiliaries
- **Work Remaining**: Calculated as Initial Project Definition minus Work Accomplished
- **Project Is Done**: Boolean condition that becomes true when work is completed

### Model Logic
```
Work Accomplished(t) = Work Accomplished(t-dt) + Work Flow * dt
Work Remaining = Initial Project Definition - Work Accomplished
Project Is Done = IF Work Accomplished >= Initial Project Definition THEN 1 ELSE 0
Work Flow = IF Project Is Done THEN 0 ELSE Base Work Flow Rate
```

## Parameters

- **Initial Project Definition**: Total amount of work to be completed (drawings)
- **Work Flow Rate**: Speed of work completion when active (drawings/month)
- **Simulation Time**: How long to run the simulation (months)
- **Time Step (dt)**: Integration step size for numerical simulation (months)

## Key Features

### System Dynamics Concepts Demonstrated
- **Stock and Flow Structure**: Shows how stocks accumulate flows over time
- **Feedback Loops**: Work completion affects future work flow
- **Conditional Logic**: Work stops when project is complete
- **Integration**: Numerical integration using Euler method

### Interactive Controls
- Real-time parameter adjustment
- Keyboard shortcuts (Ctrl/Cmd + Enter to run, Ctrl/Cmd + R to reset)
- Input validation and visual feedback
- Responsive design for all screen sizes

### Visualization
- Multi-line chart showing all key variables
- Dual y-axes for different units (work vs. flow rate)
- Key metrics panel with completion status
- Color-coded status indicators

## Technical Implementation

- **Frontend**: Pure HTML5, CSS3, and JavaScript (ES6+)
- **Charting**: Chart.js for interactive visualizations
- **Simulation**: Custom JavaScript implementation of system dynamics
- **Styling**: Modern CSS with CSS Grid and Flexbox
- **Accessibility**: WCAG compliant with keyboard navigation support

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Usage Examples

### Basic Project Simulation
1. Set Initial Project Definition to 1000 drawings
2. Set Work Flow Rate to 100 drawings/month
3. Run simulation to see project completion in 10 months

### Testing Different Scenarios
- **Fast Track**: Increase Work Flow Rate to 200 drawings/month
- **Large Project**: Increase Initial Project Definition to 5000 drawings
- **Resource Constraints**: Decrease Work Flow Rate to 50 drawings/month

### Understanding System Behavior
- Notice how Work Flow drops to 0 when project is complete
- Observe the S-curve behavior in Work Accomplished
- See how Work Remaining decreases linearly until completion

## Educational Value

This simulator helps users understand:
- Basic system dynamics principles
- Stock and flow relationships
- Feedback loop behavior
- Project management dynamics
- Numerical simulation concepts

## Future Enhancements

Potential additions could include:
- Multiple model templates (population growth, inventory management, etc.)
- Model builder interface for creating custom models
- Parameter sensitivity analysis
- Export functionality for results
- Collaborative features for sharing models

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Inspired by [Vensim](https://vensim.com) system dynamics software
- Model example based on Vensim documentation
- Built for educational and demonstration purposes
