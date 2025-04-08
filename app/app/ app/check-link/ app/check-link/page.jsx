"use client";

import { useState } from 'react';
import axios from 'axios';

export default function CheckLink() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      // Validate URL format
      if (!url.match(/^(http|https):\/\/[a-zA-Z0-9][-a-zA-Z0-9]*(\.[a-zA-Z0-9][-a-zA-Z0-9]*)+/)) {
        throw new Error('Please enter a valid URL starting with http:// or https://');
      }
      
      const response = await axios.post('/api/check-link', { url });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-800">
        Check Link Status
      </h1>
      
      <div className="bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="url" className="block mb-2 text-sm font-medium text-gray-700">
              Enter URL or Domain
            </label>
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 text-white font-medium rounded-md ${
              loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            } transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          >
            {loading ? 'Checking...' : 'Check Link'}
          </button>
        </form>
        
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {result && (
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
            <h2 className="text-xl font-semibold mb-3">Results</h2>
            <div className="p-4 rounded-md mb-4" 
                 style={{ backgroundColor: result.exists ? '#f0fdf4' : '#fef2f2', borderColor: result.exists ? '#bbf7d0' : '#fecaca' }}>
              <p className={`text-lg font-medium ${result.exists ? 'text-green-800' : 'text-red-800'}`}>
                {result.exists ? 'Link Found' : 'Link Not Found'} in referring domains
              </p>
              <p className="mt-1 text-sm text-gray-600">
                {result.exists 
                  ? 'This URL already exists in your referring domains.' 
                  : 'This URL does not exist in your referring domains.'}
              </p>
            </div>
            
            {result.details && (
              <div>
                <h3 className="font-medium mb-2">Additional Details:</h3>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                  {JSON.stringify(result.details, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
