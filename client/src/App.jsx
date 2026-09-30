import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import NoteForm from './components/NoteForm';
import UrlForm from './components/UrlForm';
import KnowledgeBase from './components/KnowledgeBase';
import ChatInterface from './components/ChatInterface';

export default function App() {
  const [currentView, setView] = useState('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard setView={setView} />;
      case 'knowledge': return <KnowledgeBase />;
      case 'add-note': return <NoteForm setView={setView} />;
      case 'add-url': return <UrlForm setView={setView} />;
      case 'ask': return <ChatInterface />;
      default: return <Dashboard setView={setView} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar currentView={currentView} setView={setView} />
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto h-full">
          {renderView()}
        </div>
      </main>
    </div>
  );
}
