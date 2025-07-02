import React from 'react';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

/**
 * Render a Bland-Altman scatter plot along with bias and limits of agreement lines.
 * The component expects an array of objects containing mean and diff values as
 * produced by the `computeInterDeviceAgreement` util.
 */
export default function BlandAltmanChart({ title, pair }) {
  const labels = pair.data.map((d) => d.sample_id);
  const scatterData = {
    labels,
    datasets: [
      {
        label: 'Difference',
        data: pair.data.map((d) => ({ x: d.mean, y: d.diff })),
        backgroundColor: '#1d4ed8'
      }
    ]
  };

  const biasLine = {
    label: 'Bias',
    data: [{ x: Math.min(...pair.data.map(d => d.mean)), y: pair.bias }, { x: Math.max(...pair.data.map(d => d.mean)), y: pair.bias }],
    type: 'line',
    borderColor: '#dc2626',
    borderWidth: 1,
    fill: false
  };

  const upperLine = {
    label: 'Upper LoA',
    data: [{ x: Math.min(...pair.data.map(d => d.mean)), y: pair.loaUpper }, { x: Math.max(...pair.data.map(d => d.mean)), y: pair.loaUpper }],
    type: 'line',
    borderColor: '#16a34a',
    borderWidth: 1,
    fill: false,
    borderDash: [4,4]
  };

  const lowerLine = {
    label: 'Lower LoA',
    data: [{ x: Math.min(...pair.data.map(d => d.mean)), y: pair.loaLower }, { x: Math.max(...pair.data.map(d => d.mean)), y: pair.loaLower }],
    type: 'line',
    borderColor: '#16a34a',
    borderWidth: 1,
    fill: false,
    borderDash: [4,4]
  };

  const chartData = {
    datasets: [scatterData.datasets[0], biasLine, upperLine, lowerLine]
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const d = pair.data[context.dataIndex];
            return `Sample ${d.sample_id}: diff=${d.diff.toFixed(2)}`;
          }
        }
      },
      legend: { display: false }
    },
    scales: {
      x: { title: { display: true, text: 'Mean' } },
      y: { title: { display: true, text: 'Difference' } }
    }
  };

  return (
    <div className="mb-6">
      <h4 className="font-semibold mb-2">{title}</h4>
      <Scatter data={chartData} options={options} />
    </div>
  );
}
