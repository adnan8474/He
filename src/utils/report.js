/**
 * Utility helpers to export data from POCTify.
 * These functions handle CSV generation and PDF creation for both the
 * overall statistics and the inter-device comparison section.
 * All logic here is client-side and relies on html2canvas and jsPDF.
 */
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Convert an array of objects to a CSV string.
 * @param {Object[]} rows - dataset rows
 * @param {string[]} headers - ordered list of column names
 */
export function toCSV(rows, headers) {
  const headerLine = headers.join(',');
  const lines = rows.map(r => headers.map(h => r[h]).join(','));
  return [headerLine, ...lines].join('\n');
}

/**
 * Trigger a file download with the given filename and content.
 */
export function downloadCSV(content, filename) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, filename);
}

/**
 * Capture a DOM element and export it as a PDF. The height of the element
 * determines the PDF page height. This is used to allow exporting the entire
 * dashboard including charts and tables.
 */
export async function exportElementPDF(element, filename) {
  export async function exportElementPDF(element, filename) {
  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL('image/png');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' });

  const pageWidth = doc.internal.pageSize.getWidth();
  const ratio = pageWidth / canvas.width;

  // Load the logo image
  const logoImg = new Image();
  logoImg.src = '/logo.png';

  await new Promise((resolve) => {
    logoImg.onload = resolve;
  });

  // Add the logo at the top (x=20, y=20, width=80)
  doc.addImage(logoImg, 'PNG', 20, 20, 80, 30);

  // Leave space below the logo
  const offsetY = 60;

  doc.addImage(imgData, 'PNG', 0, offsetY, pageWidth, canvas.height * ratio);
  doc.save(filename);
}

/**
 * Build a simple CSV file summarising Bland-Altman comparison results.
 * @param {Object} comparison - result from computeInterDeviceAgreement
 */
export function exportComparisonCSV(comparison) {
  const headers = [
    'comparison',
    'bias',
    'sd',
    'lower_loa',
    'upper_loa',
    'n'
  ];
  const rows = Object.entries(comparison.pairs).map(([name, stats]) => ({
    comparison: name,
    bias: stats.bias.toFixed(3),
    sd: stats.sd.toFixed(3),
    lower_loa: stats.loaLower.toFixed(3),
    upper_loa: stats.loaUpper.toFixed(3),
    n: stats.n
  }));
  downloadCSV(toCSV(rows, headers), 'comparison-summary.csv');
}

/**
 * Export the entire inter-device comparison section as a PDF.
 * The caller passes the element reference that should be converted to an image.
 */
export function exportComparisonPDF(element) {
  return exportElementPDF(element, 'comparison-summary.pdf');
}

/**
 * Helper to format a date object as YYYY-MM-DD for CSV exports.
 */
export function formatDate(date) {
  const d = new Date(date);
  const month = ${d.getMonth() + 1}.padStart(2, '0');
  const day = ${d.getDate()}.padStart(2, '0');
  return ${d.getFullYear()}-${month}-${day};
}

/**
 * Group an array of items by a key extractor function.
 * @param {Array} arr
 * @param {(item) => string} keyFn
 */
export function groupBy(arr, keyFn) {
  return arr.reduce((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

/**
 * Build a structured summary object ready for template-driven PDF generation.
 * This is not used directly today but provides an example of how the data
 * could be serialised for serverless report creation in the future.
 */
export function generateReportData(summary, comparison) {
  const deviceTable = summary.deviceStats.map((d) => ({
    device: d.device,
    mean: d.mean.toFixed(2),
    sd: d.sd.toFixed(2),
    cv: d.cv.toFixed(2),
    n: d.count
  }));

  const pairTable = Object.entries(comparison.pairs).map(([name, stats]) => ({
    comparison: name,
    bias: stats.bias.toFixed(2),
    sd: stats.sd.toFixed(2),
    loaLower: stats.loaLower.toFixed(2),
    loaUpper: stats.loaUpper.toFixed(2),
    n: stats.n
  }));

  return { deviceTable, pairTable };
}
