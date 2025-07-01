import Papa from 'papaparse';
import * as XLSX from 'xlsx';

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

  const summary = calculateStats(rows);
  return { rows, summary };
}

export function calculateStats(rows) {
  const devices = {};
  rows.forEach((r) => {
    const key = r.device_id;
    if (!devices[key]) devices[key] = [];
    devices[key].push(Number(r.measured_value));
  });

  const deviceStats = Object.entries(devices).map(([device, values]) => {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const sd = Math.sqrt(
      values.map((v) => Math.pow(v - mean, 2)).reduce((a, b) => a + b, 0) /
        values.length
    );
    const cv = (sd / mean) * 100;
    return { device, mean, sd, cv, count: values.length };
  });

  const allValues = rows.map((r) => Number(r.measured_value));
  const globalMean = allValues.reduce((a, b) => a + b, 0) / allValues.length;
  const globalSD = Math.sqrt(
    allValues.map((v) => Math.pow(v - globalMean, 2)).reduce((a, b) => a + b, 0) /
      allValues.length
  );
  const globalCV = (globalSD / globalMean) * 100;

  return {
    deviceCount: Object.keys(devices).length,
    deviceStats,
    globalMean,
    globalSD,
    globalCV
  };
}
