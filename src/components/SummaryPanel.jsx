import React from 'react';

export default function SummaryPanel({ summary }) {
  return (
    <div className="border p-4 rounded bg-white dark:bg-gray-800">
      <h3 className="font-bold mb-2">Summary</h3>
      <p>Devices: {summary.deviceCount}</p>
      <p>Mean: {summary.globalMean.toFixed(2)}</p>
      <p>SD: {summary.globalSD.toFixed(2)}</p>
      <p>CV%: {summary.globalCV.toFixed(2)}</p>
      {summary.globalCV > 5 && (
        <p className="text-red-600">Warning: CV% exceeds 5%</p>
      )}
    </div>
  );
}
