import React from 'react';
import { Layers } from 'lucide-react';

export default function Dashboard({ setView }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
      <div className="bg-indigo-100 p-4 rounded-full">
        <Layers className="w-12 h-12 text-indigo-600" />
      </div>
      <h2 className="text-3xl font-bold text-gray-800">Welcome to AI Knowledge Inbox</h2>
      <p className="text-gray-500 max-w-md">
        Your personal knowledge base powered by AI. Save notes, extract web pages, and ask questions to get instant, cited answers.
      </p>
      <div className="flex gap-4 pt-4">
        <button 
          onClick={() => setView('add-note')}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium"
        >
          Add Note
        </button>
        <button 
          onClick={() => setView('add-url')}
          className="px-6 py-2.5 bg-white text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors shadow-sm font-medium"
        >
          Add URL
        </button>
      </div>
    </div>
  );
}
