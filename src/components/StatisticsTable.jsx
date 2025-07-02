import React from 'react';

export default function StatisticsTable({ data }) {
  return (
    <table className="min-w-full border">
      <thead>
        <tr>
          <th className="border px-2">Device</th>
          <th className="border px-2">Mean</th>
          <th className="border px-2">SD</th>
          <th className="border px-2">CV%</th>
          <th className="border px-2">Tests</th>
        </tr>
      </thead>
      <tbody>
        {data.map((d) => (
          <tr
            key={d.device}
            className={
              d.cv > 10
                ? 'bg-red-100 text-red-800'
                : d.cv > 5
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
            }
          >
            <td className="border px-2">{d.device}</td>
            <td className="border px-2">{d.mean.toFixed(2)}</td>
            <td className="border px-2">{d.sd.toFixed(2)}</td>
            <td className="border px-2">{d.cv.toFixed(2)}</td>
            <td className="border px-2">{d.count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
