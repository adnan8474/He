import React, { useRef } from 'react';
import { downloadCSV, toCSV, exportElementPDF, exportComparisonCSV, exportComparisonPDF } from '../utils/report';

export default function ExportSection({ data, summary, comparison }) {
  const containerRef = useRef(null);

  const exportCSV = () => {
    const headers = ['device_id', 'analyte', 'test_date', 'measured_value', 'target_value'];
    downloadCSV(toCSV(data, headers), 'poctify-export.csv');
  };

  const exportPDF = () => {
    if (containerRef.current) {
      exportElementPDF(containerRef.current, 'poctify-report.pdf');
    }
  };

  const exportPairs = () => {
    if (comparison) {
      exportComparisonCSV(comparison);
    }
  };

  const exportPairsPDF = () => {
    if (comparison && containerRef.current) {
      exportComparisonPDF(containerRef.current);
    }
  };

  return (
    <div ref={containerRef} className="space-x-4">
      <button onClick={exportCSV} className="px-3 py-1 bg-green-600 text-white rounded">Export as CSV</button>
      <button onClick={exportPDF} className="px-3 py-1 bg-purple-600 text-white rounded">Export PDF Report</button>
      {comparison && (
        <>
          <button onClick={exportPairs} className="px-3 py-1 bg-blue-600 text-white rounded">Comparison CSV</button>
          <button onClick={exportPairsPDF} className="px-3 py-1 bg-indigo-600 text-white rounded">Comparison PDF</button>
        </>
      )}
    </div>
  );
}
