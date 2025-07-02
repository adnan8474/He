import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

/**
 * Render a simple Levey-Jennings chart given a dataset with mean and SD.
 */
export default function LJChart({ title, group }) {
  if (!group) return null;
  const labels = group.data.map((d, i) => d.date || i + 1);
  const values = group.data.map(d => d.value);
  const mean = group.mean;
  const sd = group.sd;
  const lineData = {
    labels,
    datasets: [
      {
        label: 'Result',
        data: values,
        borderColor: '#1d4ed8',
        backgroundColor: '#1d4ed8',
        fill: false,
        tension: 0
      },
      {
        label: 'Mean',
        data: values.map(() => mean),
        type: 'line',
        borderColor: '#dc2626',
        borderDash: [4, 4],
        fill: false
      },
      {
        label: '+2 SD',
        data: values.map(() => mean + 2 * sd),
        type: 'line',
        borderColor: '#16a34a',
        borderDash: [2, 2],
        fill: false
      },
      {
        label: '-2 SD',
        data: values.map(() => mean - 2 * sd),
        type: 'line',
        borderColor: '#16a34a',
        borderDash: [2, 2],
        fill: false
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { title: { display: true, text: 'Run' } },
      y: { title: { display: true, text: 'Value' } }
    }
  };

  return (
    <div className="mb-6">
      <h4 className="font-semibold mb-2">{title}</h4>
      <Line data={lineData} options={options} />
    </div>
  );
}
