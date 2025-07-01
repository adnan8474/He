import React, { useState } from 'react';
import UploadSection from '../components/UploadSection';
import SummaryPanel from '../components/SummaryPanel';
import ChartsPanel from '../components/ChartsPanel';
import StatisticsTable from '../components/StatisticsTable';
import ExportSection from '../components/ExportSection';
import { parseFile } from '../utils/stats';

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);

  const handleFile = async (file) => {
    const parsed = await parseFile(file);
    setData(parsed.rows);
    setSummary(parsed.summary);
  };

  return (
    <div className="space-y-6">
      <UploadSection onFile={handleFile} />
      {summary && (
        <>
          <SummaryPanel summary={summary} />
          <ChartsPanel data={data} />
          <StatisticsTable data={summary.deviceStats} />
          <ExportSection data={data} summary={summary} />
        </>
      )}
    </div>
  );
}
