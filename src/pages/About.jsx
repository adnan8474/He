import React from 'react';

export default function About() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">About EQAlert</h2>
      <p>
        POCSTAT is a statistical engine built by POCTIFY for Point-of-Care Testing professionals.
        It replaces manual Excel-based calculations with real-time analysis of EQA, verification, and inter-device variation data.
      </p>
      <p className="mt-2">
        Generate Bland–Altman plots, bias tables, and export-ready reports without manual setup.
        POCSTAT helps you act before the official EQA report arrives.
      </p>
    </div>
  );
}
