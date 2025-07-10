import React, { useContext, useState } from 'react';
import { SettingsContext } from '../context/SettingsContext';

export default function SettingsPanel({ onClose }) {
  const { settings, updateSettings } = useContext(SettingsContext);
  const [percentBias, setPercentBias] = useState(settings.percentBiasThreshold);
  const [absBias, setAbsBias] = useState(settings.absoluteBiasThreshold);

  const handleSave = () => {
    updateSettings({
      percentBiasThreshold: Number(percentBias),
      absoluteBiasThreshold: Number(absBias),
    });
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow w-80">
        <h2 className="text-lg font-bold mb-4">Settings</h2>
        <label className="block mb-2 text-sm">
          % Bias Threshold
          <input
            type="number"
            step="0.1"
            className="w-full border p-2 rounded mt-1"
            title="Rows exceeding this percent bias will be highlighted"
            value={percentBias}
            onChange={(e) => setPercentBias(e.target.value)}
          />
        </label>
        <label className="block mb-4 text-sm">
          Absolute Bias Threshold
          <input
            type="number"
            step="0.1"
            className="w-full border p-2 rounded mt-1"
            title="Rows exceeding this absolute bias will be highlighted"
            value={absBias}
            onChange={(e) => setAbsBias(e.target.value)}
          />
        </label>
        <div className="flex justify-end space-x-2">
          <button
            className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded"
            onClick={handleSave}
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
