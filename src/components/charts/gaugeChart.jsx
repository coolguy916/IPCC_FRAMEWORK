import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const GaugeChart = ({ data, options }) => {
  return (
    <div className="gauge-chart">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default GaugeChart;
