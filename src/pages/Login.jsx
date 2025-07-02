import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (password === 'TRIAL') {
      localStorage.setItem('poctify_email', email);
      try {
        await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ 'form-name': 'user-logins', email }).toString(),
        });
      } catch (err) {
        // ignore network errors
      }
      setSuccess('Login successful! Redirecting...');
      navigate('/dashboard');
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
      <div className="bg-white dark:bg-gray-900 p-6 rounded shadow w-80">
        <h1 className="text-2xl font-bold text-center">Welcome to EQAlert — a POCTIFY Tool for Rapid POCT Data Analysis</h1>
        <p className="text-center mb-4 text-sm">Login to begin verifying your devices with statistical precision.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            className="w-full border p-2 rounded"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full border p-2 rounded"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-600">{error}</p>}
          {success && <p className="text-green-600">{success}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700"
          >
            Enter App
          </button>
        </form>
        <form name="user-logins" netlify hidden>
          <input type="email" name="email" />
        </form>
      </div>
    </div>
  );
}
