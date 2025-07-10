import React, { useContext } from 'react';
import { SettingsContext } from '../context/SettingsContext';

/**
 * Render per-sample bias relative to that sample's mean value.
 * Each row represents a single device result for a specific sample.
 */
export default function SampleBiasTable({ data }) {
  const { settings } = useContext(SettingsContext);
  if (!data || !data.length) return null;
  return (
    <table className="min-w-full border text-sm">
      <thead>
        <tr>
          <th className="border px-2 py-1">Sample ID</th>
          <th className="border px-2 py-1">Device</th>
          <th className="border px-2 py-1">Measured</th>
          <th className="border px-2 py-1">Sample Mean</th>
          <th className="border px-2 py-1">Bias</th>
          <th className="border px-2 py-1">%Bias</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr
            key={idx}
            className={
              Math.abs(row.percent_bias) > settings.percentBiasThreshold ||
              Math.abs(row.bias) > settings.absoluteBiasThreshold
                ? 'bg-red-100 text-red-800'
                : ''
            }
          >
            <td className="border px-2 py-1 font-mono">{row.sample_id}</td>
            <td className="border px-2 py-1">{row.device}</td>
            <td className="border px-2 py-1">{row.measured.toFixed(2)}</td>
            <td className="border px-2 py-1">{row.sample_mean.toFixed(2)}</td>
            <td className="border px-2 py-1">{row.bias.toFixed(2)}</td>
            <td className="border px-2 py-1">{row.percent_bias.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
