import React, { useRef } from 'react';

export default function UploadSection({ onFile }) {
  const inputRef = useRef();

  const handleFiles = (files) => {
    if (files.length) {
      onFile(files[0]);
    }
  };

  return (
    <div className="border p-4 rounded" onDragOver={(e) => e.preventDefault()} onDrop={(e) => {e.preventDefault(); handleFiles(e.dataTransfer.files);}}>
      <p className="mb-2">Drag and drop your CSV/XLSX file here or click to select.</p>
      <p className="text-sm text-gray-600 dark:text-gray-400">Include a <code>sample_id</code> column to enable inter-device analysis.</p>
      <input
        type="file"
        accept=".csv,.xlsx"
        ref={inputRef}
        onChange={(e) => handleFiles(e.target.files)}
        className="block mb-2"
      />
      <a href="/template.csv" className="text-blue-600 underline">Download sample template</a>
    </div>
  );
}
