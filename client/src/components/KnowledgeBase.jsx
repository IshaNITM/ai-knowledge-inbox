import React, { useState, useEffect } from 'react';
import { getItems, deleteItem } from '../services/api';
import { FileText, Link as LinkIcon, Trash2, Search, Loader2 } from 'lucide-react';
import ItemDetail from './ItemDetail';

export default function KnowledgeBase() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedItemId, setSelectedItemId] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await getItems();
      setItems(data);
    } catch (err) {
      setError('Failed to load items.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      await deleteItem(id);
      setItems(items.filter(item => item.id !== id));
      if (selectedItemId === id) setSelectedItemId(null);
    } catch (err) {
      alert('Failed to delete item.');
    }
  };

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(search.toLowerCase()) || 
    item.preview.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (selectedItemId) {
    return <ItemDetail id={selectedItemId} onBack={() => setSelectedItemId(null)} />;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Knowledge Base</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none w-full md:w-64"
          />
        </div>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500">No items found. Add some notes or URLs!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div 
              key={item.id} 
              onClick={() => setSelectedItemId(item.id)}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex flex-col h-full group overflow-hidden"
            >
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-3">
                  <div className={`p-2 rounded-lg ${item.source_type === 'url' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {item.source_type === 'url' ? <LinkIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                  </div>
                  <button 
                    onClick={(e) => handleDelete(item.id, e)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-3">{item.preview}...</p>
              </div>
              <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 flex justify-between items-center">
                <span className="capitalize">{item.source_type}</span>
                <span>{new Date(item.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
