import React from 'react';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

/**
 * Scatter plot with optional regression line for method comparison.
 * Expects an array of data objects with a and b values and regression stats.
 */
export default function RegressionChart({ title, pair }) {
  if (!pair) return null;
  const scatterData = {
    datasets: [
      {
        label: 'Samples',
        data: pair.data.map(d => ({ x: d.a, y: d.b })),
        backgroundColor: '#1d4ed8'
      }
    ]
  };

  const minX = Math.min(...pair.data.map(d => d.a));
  const maxX = Math.max(...pair.data.map(d => d.a));
  const regLine = {
    label: 'Regression',
    data: [
      { x: minX, y: pair.slope * minX + pair.intercept },
      { x: maxX, y: pair.slope * maxX + pair.intercept }
    ],
    type: 'line',
    borderColor: '#dc2626',
    borderWidth: 1,
    fill: false
  };

  const chartData = { datasets: [...scatterData.datasets, regLine] };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { title: { display: true, text: 'Device A' } },
      y: { title: { display: true, text: 'Device B' } }
    }
  };

  return (
    <div className="mb-6">
      <h4 className="font-semibold mb-2">{title}</h4>
      <Scatter data={chartData} options={options} />
    </div>
  );
}
