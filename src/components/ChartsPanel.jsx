import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function ChartsPanel({ data }) {
  if (!data.length) return null;

  const labels = data.map((row) => row.test_date);
  const measured = data.map((row) => Number(row.measured_value));
  const target = data.map((row) => Number(row.target_value));

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Measured',
        data: measured,
        borderColor: 'rgb(75,192,192)',
        fill: false
      },
      {
        label: 'Target',
        data: target,
        borderColor: 'rgb(255,99,132)',
        fill: false
      }
    ]
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded">
      <Line data={chartData} />
    </div>
  );
}
