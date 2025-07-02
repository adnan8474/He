import React from 'react';

export default function Instructions() {
  return (
    <div className="prose dark:prose-invert">
      <h2>How to Use POCTify</h2>
      <ul>
        <li>Prepare your CSV or XLSX file using the provided template.</li>
        <li>Upload the file in the dashboard.</li>
        <li>Review statistics and charts for early warnings.</li>
        <li>Export reports as needed.</li>
        <li>Include <code>sample_id</code> to enable inter-device Bland-Altman plots.</li>
      </ul>
    </div>
  );
}
