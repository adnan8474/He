import React, { useContext } from 'react';
import { SettingsContext } from '../context/SettingsContext';

/**
 * Display bias of each device relative to the group mean.
 * Rows highlighted red if absolute percent bias exceeds 3%.
 */
export default function EQABiasTable({ data }) {
  const { settings } = useContext(SettingsContext);
  if (!data || !data.length) return null;
  return (
    <table className="min-w-full border text-sm">
      <thead>
        <tr>
          <th className="border px-2 py-1">Device</th>
          <th className="border px-2 py-1">Measured</th>
          <th className="border px-2 py-1">Group Mean</th>
          <th className="border px-2 py-1">Bias</th>
          <th className="border px-2 py-1">%Bias</th>
        </tr>
      </thead>
      <tbody>
        {data.map((d) => (
          <tr
            key={d.device}
            className={
              Math.abs(d.percent_bias) > settings.percentBiasThreshold ||
              Math.abs(d.bias) > settings.absoluteBiasThreshold
                ? 'bg-red-100 text-red-800'
                : ''
            }
          >
            <td className="border px-2 py-1">{d.device}</td>
            <td className="border px-2 py-1">{d.measured.toFixed(2)}</td>
            <td className="border px-2 py-1">{d.group_mean.toFixed(2)}</td>
            <td className="border px-2 py-1">{d.bias.toFixed(2)}</td>
            <td className="border px-2 py-1">{d.percent_bias.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
