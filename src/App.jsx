import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SettingsPanel from './components/SettingsPanel';

export default function App({ children }) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div>
      <nav className="p-4 bg-blue-600 text-white flex justify-between">
        <div className="font-bold">POCTify</div>
        <div className="space-x-4 flex items-center">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <Link to="/instructions" className="hover:underline">Instructions</Link>
          <Link to="/about" className="hover:underline">About</Link>
          <button
            className="ml-2 p-1 rounded hover:bg-blue-700"
            title="Settings"
            onClick={() => setShowSettings(true)}
          >
            ⚙️
          </button>
        </div>
      </nav>
      <main className="p-4">{children}</main>
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
    </div>
  );
}
