import React from 'react';
import { Radar } from 'react-chartjs-2';

const PentagonalChart = ({ data, options }) => {
  return (
    <div className="pentagonal-chart">
      <Radar data={data} options={options} />
    </div>
  );
};

export default PentagonalChart;
