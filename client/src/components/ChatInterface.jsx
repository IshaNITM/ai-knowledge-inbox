import React, { useState, useRef, useEffect } from 'react';
import { queryAi } from '../services/api';
import { Send, User, Bot, Loader2, BookOpen, ChevronRight } from 'lucide-react';

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hi! I'm your knowledge base AI. Ask me anything about the notes and URLs you've saved." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const result = await queryAi({ question: userMessage.content });
      setMessages(prev => [...prev, { role: 'ai', content: result.answer, sources: result.sources }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I encountered an error while searching your knowledge base. Please make sure the backend is running and the OpenAI API key is valid." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-indigo-600 p-4 text-white flex items-center gap-3 shadow-md z-10">
        <div className="bg-white/20 p-2 rounded-lg">
          <Bot className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-semibold text-lg leading-tight">Ask AI</h2>
          <p className="text-indigo-100 text-xs">Query your saved knowledge</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                <Bot className="w-4 h-4 text-indigo-600" />
              </div>
            )}
            
            <div className={`max-w-[85%] md:max-w-[75%] flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`px-5 py-3.5 rounded-2xl shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
              }`}>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>

              {/* Sources display */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="w-full mt-2 grid gap-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider pl-1">Sources</p>
                  <div className="flex flex-wrap gap-2">
                    {msg.sources.map((source, sIdx) => (
                      <div key={sIdx} className="group relative flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-lg shadow-sm hover:border-indigo-300 transition-colors cursor-help max-w-sm">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                        <span className="text-xs font-medium text-gray-700 truncate">
                          [{sIdx + 1}] {source.title}
                        </span>
                        
                        {/* Tooltip for source snippet */}
                        <div className="absolute bottom-full left-0 mb-2 w-72 bg-gray-900 text-gray-100 text-xs p-3 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 pointer-events-none">
                          <p className="font-semibold text-indigo-300 mb-1 line-clamp-1">{source.title}</p>
                          <p className="line-clamp-4 opacity-90">{source.snippet}</p>
                          <div className="mt-2 text-[10px] text-gray-400 flex justify-between">
                            <span className="capitalize">{source.sourceType}</span>
                            <span>Match: {(source.similarity * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Bot className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="bg-white border border-gray-200 px-5 py-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2 text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              <span className="text-sm font-medium animate-pulse">Searching knowledge base...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <form onSubmit={handleSubmit} className="flex gap-3 max-w-4xl mx-auto relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your saved notes and URLs..."
            className="flex-1 pl-5 pr-14 py-4 bg-gray-50 border border-gray-200 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none transition-all text-sm md:text-base shadow-inner"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
