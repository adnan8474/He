import React, { useState } from 'react';
import LJChart from './LJChart';

/**
 * Panel for internal precision / repeatability calculations.
 */
export default function PrecisionPanel({ precision }) {
  const [active, setActive] = useState(precision[0]?.key || null);

  if (!precision.length) {
    return <div className="p-4 border rounded">No precision data.</div>;
  }

  const activeGroup = precision.find(p => p.key === active);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded">
      <h3 className="text-lg font-bold mb-4">Internal Precision</h3>
      <div className="mb-4">
        {precision.map(p => (
          <button
            key={p.key}
            onClick={() => setActive(p.key)}
            className={`px-3 py-1 mr-2 rounded ${active === p.key ? 'bg-blue-600 text-white' : 'bg-gray-300 dark:bg-gray-700'}`}
          >
            {p.device} {p.analyte}
          </button>
        ))}
      </div>
      {activeGroup && (
        <>
          <LJChart title={`${activeGroup.device} ${activeGroup.analyte}`} group={activeGroup} />
          <table className="min-w-full border text-sm">
            <thead>
              <tr>
                <th className="border px-2 py-1">Mean</th>
                <th className="border px-2 py-1">SD</th>
                <th className="border px-2 py-1">CV%</th>
                <th className="border px-2 py-1">n</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-2 py-1">{activeGroup.mean.toFixed(2)}</td>
                <td className="border px-2 py-1">{activeGroup.sd.toFixed(2)}</td>
                <td className="border px-2 py-1">{activeGroup.cv.toFixed(2)}</td>
                <td className="border px-2 py-1">{activeGroup.data.length}</td>
              </tr>
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
