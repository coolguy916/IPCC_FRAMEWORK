// Import chart setup first to ensure all controllers are registered
import './chartSetup';

// Export all chart components
export { default as BarChart } from './barChart';
export { default as LineChart } from './lineChart';
export { default as PentagonalChart } from './pentagonalChart';
export { default as GaugeChart } from './gaugeChart';
export { default as PieChart } from './pieChart';