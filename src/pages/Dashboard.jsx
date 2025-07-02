import React, { useState } from 'react';
import UploadSection from '../components/UploadSection';
import SummaryPanel from '../components/SummaryPanel';
import ChartsPanel from '../components/ChartsPanel';
import StatisticsTable from '../components/StatisticsTable';
import InterDeviceComparisonPanel from '../components/InterDeviceComparisonPanel';
import SampleTable from '../components/SampleTable';
import ExportSection from '../components/ExportSection';
import { parseFile } from '../utils/stats';

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [pivot, setPivot] = useState(null);

  const handleFile = async (file) => {
    const parsed = await parseFile(file);
    setData(parsed.rows);
    setSummary(parsed.summary);
    setComparison(parsed.comparison);
    setPivot(parsed.comparison.pivot);
  };

  return (
    <div className="space-y-6">
      <UploadSection onFile={handleFile} />
      {summary && (
        <>
          <SummaryPanel summary={summary} />
          <ChartsPanel data={data} />
          {pivot && <SampleTable pivot={pivot} />}
          <StatisticsTable data={summary.deviceStats} />
          {comparison && (
            <InterDeviceComparisonPanel comparison={comparison} />
          )}
          <ExportSection data={data} summary={summary} comparison={comparison} />
        </>
      )}
    </div>
  );
}
