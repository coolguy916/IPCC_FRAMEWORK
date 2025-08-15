import React from 'react';
import { Line } from 'react-chartjs-2';

const LineChart = ({ data, options }) => {
  return (
    <div className="line-chart">
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
