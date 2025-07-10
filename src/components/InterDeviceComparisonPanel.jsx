import React, { useState } from 'react';
import BlandAltmanChart from './BlandAltmanChart';

/**
 * The InterDeviceComparisonPanel renders Bland-Altman plots and a summary table
 * for every pair of devices detected in the uploaded file. It assumes that the
 * parent component passes in the `comparison` object created by
 * computeInterDeviceAgreement.
 */
export default function InterDeviceComparisonPanel({ comparison }) {
  const pairNames = Object.keys(comparison.pairs);
  const [active, setActive] = useState(pairNames[0] || null);

  if (!pairNames.length) {
    return <div className="p-4 border rounded">No pairs available.</div>;
  }

  const activePair = comparison.pairs[active];

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded">
      <h3 className="text-lg font-bold mb-4">Inter-Device Comparison</h3>
      <div className="mb-4">
        {pairNames.map((name) => (
          <button
            key={name}
            onClick={() => setActive(name)}
            className={`px-3 py-1 mr-2 rounded ${active === name ? 'bg-blue-600 text-white' : 'bg-gray-300 dark:bg-gray-700'}`}
          >
            {name}
          </button>
        ))}
      </div>
      {activePair && (
        <>
          <BlandAltmanChart title={active} pair={activePair} />
          <table className="min-w-full border text-sm">
            <thead>
              <tr>
                <th className="border px-2 py-1">Comparison</th>
                <th className="border px-2 py-1">Bias</th>
                <th className="border px-2 py-1">SD Diff</th>
                <th className="border px-2 py-1">Lower LoA</th>
                <th className="border px-2 py-1">Upper LoA</th>
                <th className="border px-2 py-1">n</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-2 py-1">{active}</td>
                <td className="border px-2 py-1">{activePair.bias.toFixed(2)}</td>
                <td className="border px-2 py-1">{activePair.sd.toFixed(2)}</td>
                <td className="border px-2 py-1">{activePair.loaLower.toFixed(2)}</td>
                <td className="border px-2 py-1">{activePair.loaUpper.toFixed(2)}</td>
                <td className="border px-2 py-1">{activePair.n}</td>
              </tr>
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
