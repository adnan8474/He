import React from 'react';

/**
 * Render a table of pivoted sample data. Each row represents a single sample
 * with columns for every device measurement found in the uploaded file.
 */
export default function SampleTable({ pivot }) {
  if (!pivot || !pivot.length) return null;
  const deviceNames = Object.keys(pivot[0]).filter(k => k !== 'sample_id');

  return (
    <div className="overflow-auto">
      <table className="min-w-full text-sm border">
        <thead>
          <tr>
            <th className="border px-2 py-1">Sample ID</th>
            {deviceNames.map((name) => (
              <th key={name} className="border px-2 py-1">{name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pivot.map((row) => (
            <tr key={row.sample_id}>
              <td className="border px-2 py-1 font-mono">{row.sample_id}</td>
              {deviceNames.map((name) => (
                <td key={name} className="border px-2 py-1 text-right">
                  {row[name] ?? '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
