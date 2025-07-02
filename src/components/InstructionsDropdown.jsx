import React, { useState } from 'react';

export default function InstructionsDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded"
      >
        {open ? 'Hide Instructions' : 'Show Instructions'}
      </button>
      {open && (
        <div className="mt-2 p-2 border rounded bg-white dark:bg-gray-800">
          <p>Format your file according to the sample template.</p>
          <p>CV% = (SD / Mean) * 100. Values above 5% may indicate issues.</p>
          <p>Altman-Bland plots show the difference vs average of measured and target.</p>
          <p>Include a <code>sample_id</code> column to compare devices on the same sample.</p>
        </div>
      )}
    </div>
  );
}
