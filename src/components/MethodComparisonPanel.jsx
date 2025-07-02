import React, { useState, useRef } from 'react';
import BlandAltmanChart from './BlandAltmanChart';
import RegressionChart from './RegressionChart';
import ExportSection from './ExportSection';

/**
 * Panel to display method comparison statistics for pairs of devices.
 */
export default function MethodComparisonPanel({ method, data }) {
  const pairNames = Object.keys(method.pairs || {});
  const [active, setActive] = useState(pairNames[0] || null);
  const reportRef = useRef(null);

  if (!pairNames.length) {
    return <div className="p-4 border rounded">No device pairs found.</div>;
  }

  const activePair = method.pairs[active];

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded">
      <h3 className="text-lg font-bold mb-4">Device Verification</h3>
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
        <div ref={reportRef} className="space-y-4">
          <RegressionChart title={`${active} Regression`} pair={activePair} />
          <BlandAltmanChart title={`${active} Bland-Altman`} pair={activePair} />
          <table className="min-w-full border text-sm">
            <thead>
              <tr>
                <th className="border px-2 py-1">Correlation r</th>
                <th className="border px-2 py-1">Slope</th>
                <th className="border px-2 py-1">Intercept</th>
                <th className="border px-2 py-1">Bias</th>
                <th className="border px-2 py-1">SD Diff</th>
                <th className="border px-2 py-1">LoA Lower</th>
                <th className="border px-2 py-1">LoA Upper</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-2 py-1">{activePair.correlation.toFixed(2)}</td>
                <td className="border px-2 py-1">{activePair.slope.toFixed(2)}</td>
                <td className="border px-2 py-1">{activePair.intercept.toFixed(2)}</td>
                <td className="border px-2 py-1">{activePair.bias.toFixed(2)}</td>
                <td className="border px-2 py-1">{activePair.sd.toFixed(2)}</td>
                <td className="border px-2 py-1">{activePair.loaLower.toFixed(2)}</td>
                <td className="border px-2 py-1">{activePair.loaUpper.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      <ExportSection data={data} comparison={method} targetRef={reportRef} />
    </div>
  );
}
