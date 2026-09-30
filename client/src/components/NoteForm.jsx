import React, { useState } from 'react';
import { ingestItem } from '../services/api';
import { Save, AlertCircle } from 'lucide-react';

export default function NoteForm({ setView }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await ingestItem({ type: 'note', title, content });
      setSuccess('Note saved successfully!');
      setTitle('');
      setContent('');
      // Optional: setView('knowledge') after a delay
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save note.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add a New Note</h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 border border-red-100">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-100">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Note Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
            placeholder="e.g., React Query Concepts"
            required
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow resize-y"
            placeholder="Type your notes here..."
            required
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !title.trim() || !content.trim()}
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Save className="w-4 h-4" />
          {loading ? 'Saving...' : 'Save Note'}
        </button>
      </form>
    </div>
  );
}
