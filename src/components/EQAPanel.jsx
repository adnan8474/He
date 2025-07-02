import React from 'react';
import SummaryPanel from './SummaryPanel';
import ChartsPanel from './ChartsPanel';
import SampleTable from './SampleTable';
import StatisticsTable from './StatisticsTable';
import InterDeviceComparisonPanel from './InterDeviceComparisonPanel';
import ExportSection from './ExportSection';

/**
 * Panel wrapping the original dashboard components for EQA comparisons.
 */
export default function EQAPanel({ data, summary, comparison, pivot }) {
  if (!summary) return null;
  return (
    <div className="space-y-4">
      <SummaryPanel summary={summary} />
      <ChartsPanel data={data} />
      {pivot && <SampleTable pivot={pivot} />}
      <StatisticsTable data={summary.deviceStats} />
      {comparison && <InterDeviceComparisonPanel comparison={comparison} />}
      <ExportSection data={data} summary={summary} comparison={comparison} />
    </div>
  );
}
