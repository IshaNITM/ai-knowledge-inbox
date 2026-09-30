import React, { useState, useEffect } from 'react';
import { getItem } from '../services/api';
import { ArrowLeft, Loader2, Link as LinkIcon, FileText, Calendar } from 'lucide-react';

export default function ItemDetail({ id, onBack }) {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const data = await getItem(id);
      setItem(data);
    } catch (err) {
      setError('Failed to load item details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div>
        <button onClick={onBack} className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Knowledge Base
        </button>
        <div className="text-red-600">{error || 'Item not found'}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <button onClick={onBack} className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6 font-medium transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Knowledge Base
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-100">
          <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-full font-medium capitalize text-gray-700">
              {item.source_type === 'url' ? <LinkIcon className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
              {item.source_type}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(item.created_at).toLocaleString()}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-4">
            {item.title}
          </h1>
          {item.source_url && (
            <a 
              href={item.source_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              <LinkIcon className="w-3.5 h-3.5" /> {item.source_url}
            </a>
          )}
        </div>
        <div className="p-6 md:p-8 bg-gray-50">
          <div className="prose prose-slate max-w-none whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
            {item.raw_content}
          </div>
        </div>
      </div>
    </div>
  );
}
