import React, { useEffect } from 'react';
import { useWebSocket } from '../lib/websocket';

export const WebSocketTest: React.FC = () => {
  const { connect, disconnect, sendMessage, messages } = useWebSocket();

  useEffect(() => {
    connect();
    return () => disconnect();
  }, []);

  const handleSendMessage = () => {
    sendMessage({
      type: 'test',
      content: 'Hello WebSocket Server!'
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">WebSocket Test</h2>
      
      <button
        onClick={handleSendMessage}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Send Test Message
      </button>

      <div className="space-y-2">
        <h3 className="font-semibold">Messages:</h3>
        {messages.map((msg, index) => (
          <div key={index} className="p-2 bg-gray-100 rounded">
            <pre>{JSON.stringify(msg, null, 2)}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}; 