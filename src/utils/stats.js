import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { pearsonCorrelation, linearRegression } from './advancedStats';

/**
 * Parse a CSV or XLSX file uploaded by the user.
 * The function accepts typical POCT result formats and
 * returns an array of row objects as well as several
 * summary statistics used across the app.
 */

export async function parseFile(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  let rows = [];

  if (ext === 'csv') {
    const text = await file.text();
    const result = Papa.parse(text, { header: true });
    rows = result.data.filter((r) => r.device_id);
  } else if (ext === 'xlsx') {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    rows = XLSX.utils.sheet_to_json(sheet);
  }

  // After reading rows we compute per-device statistics as well as
  // inter-device agreement metrics. These metrics will power the
  // Bland-Altman plots shown in the dashboard.

  const summary = calculateStats(rows);
  const comparison = computeInterDeviceAgreement(rows);
  const eqaBias = calculateEqaBiasStats(rows);
  const sampleBias = calculateSampleBias(rows);
  return { rows, summary, comparison, eqaBias, sampleBias };
}

export function calculateStats(rows) {
  const devices = {};
  rows.forEach((r) => {
    const key = r.device_id;
    if (!devices[key]) devices[key] = [];
    devices[key].push(Number(r.measured_value));
  });

  const deviceStats = Object.entries(devices).map(([device, values]) => {
    const meanVal = mean(values);
    const sdVal = sampleStandardDeviation(values);
    const cvVal = (sdVal / meanVal) * 100;
    return { device, mean: meanVal, sd: sdVal, cv: cvVal, count: values.length };
  });

  const allValues = rows.map((r) => Number(r.measured_value));
  const globalMean = mean(allValues);
  const globalSD = sampleStandardDeviation(allValues);
  const globalCV = (globalSD / globalMean) * 100;

  return {
    deviceCount: Object.keys(devices).length,
    deviceStats,
    globalMean,
    globalSD,
    globalCV
  };
}

/**
 * Compute inter-device agreement statistics for all pairs of devices.
 * The function first pivots the dataset by sample_id so each object
 * represents a single patient/sample and contains measurements from
 * multiple devices. It then creates every possible device pair and
 * calculates Bland-Altman statistics for each pair.
 */
export function computeInterDeviceAgreement(rows) {
  const pivot = pivotSamples(rows);
  const devices = Object.keys(pivot[0] || {}).filter((k) => k !== 'sample_id');
  const pairs = [];
  for (let i = 0; i < devices.length; i++) {
    for (let j = i + 1; j < devices.length; j++) {
      pairs.push([devices[i], devices[j]]);
    }
  }

  const results = {};
  pairs.forEach(([a, b]) => {
    const data = [];
    pivot.forEach((row) => {
      const valA = safeNumber(row[a]);
      const valB = safeNumber(row[b]);
      if (!isNaN(valA) && !isNaN(valB)) {
        const mean = (valA + valB) / 2;
        const diff = valA - valB;
        data.push({ sample_id: row.sample_id, mean, diff, a: valA, b: valB });
      }
    });
    results[`${a} vs ${b}`] = summarizePair(data);
  });

  return { pairs: results, pivot };
}

/**
 * Convert rows of measurement data into a pivoted format keyed by sample_id.
 * If a file does not include sample_id the function will generate sequential
 * identifiers to allow comparison of measurements that appear on the same row
 * across devices.
 */
export function pivotSamples(rows) {
  const groups = {};
  rows.forEach((row, index) => {
    const id = row.sample_id || `row_${index}`;
    if (!groups[id]) groups[id] = { sample_id: id };
    groups[id][row.device_id] = Number(row.measured_value);
  });
  return Object.values(groups);
}

/**
 * Summarize an array of paired measurement data for a Bland-Altman analysis.
 */
export function summarizePair(data) {
  const diffs = data.map((d) => d.diff);
  const bias = mean(diffs);
  const sd = standardDeviation(diffs);
  const loa = 1.96 * sd;
  return {
    data,
    bias,
    sd,
    loaLower: bias - loa,
    loaUpper: bias + loa,
    n: data.length
  };
}

// Utility math helpers
export function mean(arr) {
  if (!arr.length) return NaN;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

export function standardDeviation(arr) {
  return sampleStandardDeviation(arr);
}

/**
 * Calculate sample standard deviation using Bessel's correction (n - 1).
 * Returns NaN for arrays with fewer than 2 values.
 */
export function sampleStandardDeviation(arr) {
  if (arr.length < 2) return NaN;
  const m = mean(arr);
  const variance = arr.map((x) => Math.pow(x - m, 2)).reduce((a, b) => a + b, 0) / (arr.length - 1);
  return Math.sqrt(variance);
}

function safeNumber(v) {
  const n = Number(v);
  return isNaN(n) ? NaN : n;
}

/**
 * Perform a method comparison between pairs of devices.
 * Returns correlation and regression stats in addition to
 * Bland-Altman metrics for each pair.
 */
export function computeMethodComparison(rows) {
  const pivot = pivotSamples(rows);
  const devices = Object.keys(pivot[0] || {}).filter(k => k !== 'sample_id');
  const pairs = [];
  for (let i = 0; i < devices.length; i++) {
    for (let j = i + 1; j < devices.length; j++) {
      pairs.push([devices[i], devices[j]]);
    }
  }
  const results = {};
  pairs.forEach(([a, b]) => {
    const x = [];
    const y = [];
    const data = [];
    pivot.forEach(row => {
      const valA = safeNumber(row[a]);
      const valB = safeNumber(row[b]);
      if (!isNaN(valA) && !isNaN(valB)) {
        x.push(valA);
        y.push(valB);
        const meanVal = (valA + valB) / 2;
        const diffVal = valA - valB;
        data.push({ sample_id: row.sample_id, mean: meanVal, diff: diffVal, a: valA, b: valB });
      }
    });
    const ba = summarizePair(data);
    const r = pearsonCorrelation(x, y);
    const reg = linearRegression(x, y);
    results[`${a} vs ${b}`] = {
      ...ba,
      correlation: r,
      slope: reg.slope,
      intercept: reg.intercept,
      r2: r * r
    };
  });
  return { pairs: results };
}

/**
 * Compute repeatability statistics for each device/analyte combination.
 * The result includes mean, SD and CV% plus arrays of values for
 * plotting Levey-Jennings charts.
 */
export function computePrecisionStats(rows) {
  const groups = {};
  rows.forEach(r => {
    const key = `${r.device_id}-${r.analyte}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push({ date: r.test_date, value: Number(r.measured_value) });
  });

  return Object.entries(groups).map(([key, arr]) => {
    const values = arr.map(v => v.value);
    const meanVal = mean(values);
    const sdVal = standardDeviation(values);
    const cvVal = (sdVal / meanVal) * 100;
    return {
      key,
      device: key.split('-')[0],
      analyte: key.split('-')[1],
      mean: meanVal,
      sd: sdVal,
      cv: cvVal,
      data: arr
    };
  });
}

/**
 * Calculate bias statistics for EQA comparisons. Each device is compared
 * against the group mean of all measured values.
 *
 * @param {Array} rows - Array of row objects containing device_id and measured_value
 * @returns {Array} list of { device, measured, group_mean, bias, percent_bias }
 */
export function calculateEqaBiasStats(rows) {
  const devices = {};
  rows.forEach((r) => {
    const v = Number(r.measured_value);
    if (isNaN(v)) return;
    if (!devices[r.device_id]) devices[r.device_id] = [];
    devices[r.device_id].push(v);
  });

  const allValues = Object.values(devices).flat();
  const groupMean = mean(allValues);

  return Object.entries(devices).map(([device, vals]) => {
    const measured = mean(vals);
    const bias = measured - groupMean;
    const percentBias = (bias / groupMean) * 100;
    return { device, measured, group_mean: groupMean, bias, percent_bias: percentBias };
  });
}

/**
 * Calculate bias for each individual sample relative to the sample mean.
 * Useful for tables that show how each device's result deviates from the
 * consensus value for that sample.
 * @param {Array} rows - Array of measurement records
 * @returns {Array} list of { sample_id, device, measured, sample_mean, bias, percent_bias }
 */
export function calculateSampleBias(rows) {
  const pivot = pivotSamples(rows);
  const result = [];
  pivot.forEach((row) => {
    const entries = Object.entries(row).filter(([k]) => k !== 'sample_id');
    const values = entries.map(([, v]) => Number(v)).filter((v) => !isNaN(v));
    if (!values.length) return;
    const meanVal = mean(values);
    entries.forEach(([device, val]) => {
      const num = Number(val);
      if (isNaN(num)) return;
      const bias = num - meanVal;
      const percentBias = (bias / meanVal) * 100;
      result.push({
        sample_id: row.sample_id,
        device,
        measured: num,
        sample_mean: meanVal,
        bias,
        percent_bias: percentBias
      });
    });
  });
  return result;
}

