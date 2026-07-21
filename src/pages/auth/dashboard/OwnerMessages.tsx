import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MagnifyingGlassIcon,
  EnvelopeIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
} from '@heroicons/react/24/outline';
import { messages } from './data';

const OwnerMessages: React.FC = () => {
  const { t } = useTranslation();
  const [selectedMessage, setSelectedMessage] = useState(messages[0]);
  const [replyText, setReplyText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const unreadCount = messages.filter(m => m.unread).length;
  const filteredMessages = messages.filter(m =>
    m.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Messages</h2>
        <p className="text-sm text-gray-500 mt-1">
          {unreadCount} message{unreadCount > 1 ? 's' : ''} non lu{unreadCount > 1 ? 's' : ''}
        </p>
      </div>

      {/* Messages Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <div className="lg:col-span-1 bg-white border border-gray-200">
          <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
            {filteredMessages.map((message) => (
              <button
                key={message.id}
                onClick={() => setSelectedMessage(message)}
                className={`w-full text-left px-4 py-4 hover:bg-gray-50 transition-colors ${
                  selectedMessage.id === message.id ? 'bg-emerald-50 border-l-2 border-emerald-600' : ''
                } ${message.unread ? 'bg-gray-50' : ''}`}
              >
                <div className="flex items-start justify-between mb-1">
                  <h4 className={`text-sm ${message.unread ? 'font-bold' : 'font-medium'} text-gray-900 truncate`}>
                    {message.sender}
                  </h4>
                  <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                    il y a {message.time}
                  </span>
                </div>
                {message.unread && (
                  <span className="inline-block bg-emerald-600 text-white px-2 py-0.5 text-xs font-semibold mb-1">
                    NOUVEAU
                  </span>
                )}
                <p className="text-xs text-gray-500 mb-0.5">{message.role}</p>
                <p className="text-xs text-gray-600 truncate">{message.content}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Conversation Detail */}
        <div className="lg:col-span-2 bg-white border border-gray-200 flex flex-col">
          {selectedMessage ? (
            <>
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">{selectedMessage.sender}</h3>
                <p className="text-sm text-gray-500">{selectedMessage.role}</p>
              </div>

              {/* Messages */}
              <div className="flex-1 px-6 py-4 space-y-4 max-h-[400px] overflow-y-auto">
                <div className="bg-gray-50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400">il y a {selectedMessage.time}</span>
                  </div>
                  <p className="text-sm text-gray-700">{selectedMessage.content}</p>
                </div>
              </div>

              {/* Reply Area */}
              <div className="px-6 py-4 border-t border-gray-100">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Votre réponse..."
                    className="flex-1 border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-600 transition-colors"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <button className="p-2.5 border border-gray-300 text-gray-500 hover:text-emerald-600 hover:border-emerald-600 transition-colors">
                    <PaperClipIcon className="w-5 h-5" />
                  </button>
                  <button className="p-2.5 bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">
                    <PaperAirplaneIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <div className="text-center">
                <EnvelopeIcon className="w-12 h-12 mx-auto mb-3" />
                <p className="text-sm">Sélectionnez une conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerMessages;
