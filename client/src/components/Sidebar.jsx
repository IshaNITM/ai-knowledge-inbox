import React from 'react';
import { Database, MessageSquare, PlusCircle, Link, LayoutDashboard } from 'lucide-react';

export default function Sidebar({ currentView, setView }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'knowledge', label: 'Knowledge Base', icon: Database },
    { id: 'ask', label: 'Ask AI', icon: MessageSquare },
    { id: 'add-note', label: 'Add Note', icon: PlusCircle },
    { id: 'add-url', label: 'Add URL', icon: Link },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed top-0 left-0">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="bg-indigo-500 p-2 rounded-lg">
          <Database className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-lg font-bold tracking-tight">AI Inbox</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              currentView === item.id 
                ? 'bg-indigo-500/10 text-indigo-400' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <item.icon className={`w-5 h-5 ${currentView === item.id ? 'text-indigo-400' : 'text-slate-500'}`} />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
        Knowledge Base v1.0
      </div>
    </div>
  );
}
