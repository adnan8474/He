import React from 'react';

export default function Instructions() {
  return (
    <div className="prose dark:prose-invert">
      <h2>How to Use EQAlert — a POCTIFY Tool</h2>
      <p className="mb-4 text-sm">Your digital calculator for rapid statistical analysis of POCT device performance.</p>
      <ul>
        <li>Upload your raw EQA/verification data (CSV or XLSX)</li>
        <li>EQAlert automatically calculates CV%, SD, bias, and LoA</li>
        <li>See inter-device agreement through real-time charts</li>
        <li>Identify failing samples, outliers, or drifting devices</li>
        <li>Export complete audit-ready reports in seconds</li>
      </ul>
    </div>
  );
}
