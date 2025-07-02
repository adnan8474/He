import React, { useState } from 'react';
import UploadSection from '../components/UploadSection';
import EQAPanel from '../components/EQAPanel';
import MethodComparisonPanel from '../components/MethodComparisonPanel';
import PrecisionPanel from '../components/PrecisionPanel';
import { parseFile, computeMethodComparison, computePrecisionStats } from '../utils/stats';

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [method, setMethod] = useState(null);
  const [precision, setPrecision] = useState([]);
  const [pivot, setPivot] = useState(null);
  const [tab, setTab] = useState('eqa');

  const handleFile = async (file) => {
    const parsed = await parseFile(file);
    setData(parsed.rows);
    setSummary(parsed.summary);
    setComparison(parsed.comparison);
    setPivot(parsed.comparison.pivot);
    setMethod(computeMethodComparison(parsed.rows));
    setPrecision(computePrecisionStats(parsed.rows));
  };

  return (
    <div className="space-y-6">
      <UploadSection onFile={handleFile} />
      {summary && (
        <>
          <div className="space-x-2 mb-4">
            <button
              className={`px-3 py-1 rounded ${tab === 'eqa' ? 'bg-blue-600 text-white' : 'bg-gray-300 dark:bg-gray-700'}`}
              onClick={() => setTab('eqa')}
            >
              EQA Comparison
            </button>
            <button
              className={`px-3 py-1 rounded ${tab === 'method' ? 'bg-blue-600 text-white' : 'bg-gray-300 dark:bg-gray-700'}`}
              onClick={() => setTab('method')}
            >
              Device Verification
            </button>
            <button
              className={`px-3 py-1 rounded ${tab === 'precision' ? 'bg-blue-600 text-white' : 'bg-gray-300 dark:bg-gray-700'}`}
              onClick={() => setTab('precision')}
            >
              Internal Precision
            </button>
          </div>
          {tab === 'eqa' && (
            <EQAPanel data={data} summary={summary} comparison={comparison} pivot={pivot} />
          )}
          {tab === 'method' && method && (
            <MethodComparisonPanel method={method} />
          )}
          {tab === 'precision' && precision.length > 0 && (
            <PrecisionPanel precision={precision} />
          )}
        </>
      )}
    </div>
  );
}
