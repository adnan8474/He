import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

/**
 * EQAGroupedChart renders a grouped bar chart comparing the same sample
 * measured on multiple devices. It expects pivoted data in the format
 * produced by `pivotSamples` util:
 * [
 *   { sample_id: '001', 'Device A': 5.5, 'Device B': 5.6 },
 *   { sample_id: '002', 'Device A': 6.2, 'Device B': 6.0 }
 * ]
 */
export default function EQAGroupedChart({ pivot }) {
  if (!pivot || !pivot.length) return null;

  const deviceNames = Object.keys(pivot[0]).filter((k) => k !== 'sample_id');
  const labels = pivot.map((row) => row.sample_id);
  const colors = [
    'rgb(75,192,192)',
    'rgb(255,99,132)',
    'rgb(54,162,235)',
    'rgb(255,206,86)',
    'rgb(153,102,255)'
  ];

  const datasets = deviceNames.map((name, idx) => ({
    label: name,
    data: pivot.map((row) => row[name]),
    backgroundColor: colors[idx % colors.length]
  }));

  const data = { labels, datasets };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            return `${context.dataset.label}: ${value}`;
          }
        }
      },
      legend: { position: 'top' }
    },
    scales: {
      x: { title: { display: true, text: 'Sample ID' } },
      y: { title: { display: true, text: 'Measured Value' } }
    }
  };

  return (
    <div className="mb-6">
      <h4 className="font-semibold mb-2">Per-Sample Device Comparison</h4>
      <Bar data={data} options={options} />
    </div>
  );
}
