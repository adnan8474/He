import React from 'react';
import { Link } from 'react-router-dom';

export default function App({ children }) {
  return (
    <div>
      <nav className="p-4 bg-blue-600 text-white flex justify-between">
        <div className="font-bold">POCTify</div>
        <div className="space-x-4">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <Link to="/instructions" className="hover:underline">Instructions</Link>
          <Link to="/about" className="hover:underline">About</Link>
        </div>
      </nav>
      <main className="p-4">{children}</main>
    </div>
  );
}
