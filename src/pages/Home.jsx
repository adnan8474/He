import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl font-bold mb-4">Get Ahead of EQA Failures.</h1>
      <p className="mb-6">Upload and analyze your EQA results before submitting.</p>
      <Link
        to="/dashboard"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Launch Dashboard
      </Link>
    </div>
  );
}
