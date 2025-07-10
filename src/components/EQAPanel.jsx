import React, { useRef } from 'react';
import SummaryPanel from './SummaryPanel';
import EQAGroupedChart from './EQAGroupedChart';
import SampleTable from './SampleTable';
import EQABiasTable from './EQABiasTable';
import SampleBiasTable from './SampleBiasTable';
import InterDeviceComparisonPanel from './InterDeviceComparisonPanel';
import ExportSection from './ExportSection';

/**
 * Panel wrapping the original dashboard components for EQA comparisons.
 */
export default function EQAPanel({ data, summary, comparison, pivot, biasStats, sampleBias }) {
  if (!summary) return null;
  const reportRef = useRef(null);
  return (
    <div className="space-y-4">
      <div ref={reportRef} id="report-content" className="space-y-4">
        <SummaryPanel summary={summary} />
        <EQAGroupedChart pivot={pivot} />
        {pivot && <SampleTable pivot={pivot} />}
        <SampleBiasTable data={sampleBias} />
        <EQABiasTable data={biasStats} />
        {comparison && <InterDeviceComparisonPanel comparison={comparison} />}
      </div>
      <ExportSection
        data={data}
        comparison={comparison}
        targetRef={reportRef}
      />
    </div>
  );
}
