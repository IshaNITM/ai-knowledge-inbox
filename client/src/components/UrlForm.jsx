import React, { useState } from 'react';
import { ingestItem } from '../services/api';
import { Link, AlertCircle, Loader2 } from 'lucide-react';

export default function UrlForm() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await ingestItem({ type: 'url', url });
      setSuccess('URL fetched and saved successfully!');
      setUrl('');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.details || 'Failed to fetch and save URL.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add a URL</h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 border border-red-100">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-100">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">Webpage URL</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Link className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
              placeholder="https://example.com/article"
              required
              disabled={loading}
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            We will extract the main readable content from this page and add it to your knowledge base.
          </p>
        </div>
        
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing URL...
            </>
          ) : (
            <>
              <Link className="w-4 h-4" />
              Save Webpage
            </>
          )}
        </button>
      </form>
    </div>
  );
}
