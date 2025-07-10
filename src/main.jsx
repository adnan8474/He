import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import { SettingsProvider } from './context/SettingsContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Instructions from './pages/Instructions';
import About from './pages/About';
import Interpretation from './pages/Interpretation';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SettingsProvider>
      <Router>
        <App>
          <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/interpretation" element={<Interpretation />} />
          <Route path="/about" element={<About />} />
        </Routes>
        </App>
      </Router>
    </SettingsProvider>
  </React.StrictMode>
);
