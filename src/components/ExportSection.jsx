import React from 'react';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function ExportSection({ data, summary }) {
  const exportCSV = () => {
    const csv = [
      'device_id,analyte,test_date,measured_value,target_value',
      ...data.map(
        (r) =>
          `${r.device_id},${r.analyte},${r.test_date},${r.measured_value},${r.target_value}`
      )
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'poctify-export.csv');
  };

  const exportPDF = async () => {
    const doc = new jsPDF();
    const element = document.body;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    const imgProps = doc.getImageProperties(imgData);
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    doc.save('poctify-report.pdf');
  };

  return (
    <div className="space-x-4">
      <button onClick={exportCSV} className="px-3 py-1 bg-green-600 text-white rounded">Export as CSV</button>
      <button onClick={exportPDF} className="px-3 py-1 bg-purple-600 text-white rounded">Export PDF Report</button>
    </div>
  );
}
