'use client';

import { useState } from 'react';

export default function DebugPage() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testEnvironment = async () => {
    setLoading(true);
    setResult('Checking environment...');
    
    try {
      const response = await fetch('/api/debug');
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testSimpleChat = async () => {
    setLoading(true);
    setResult('Testing simple chat...');
    
    try {
      const response = await fetch('/api/debug', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Hello, can you help with career guidance?' }]
        })
      });

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Debug Page</h1>
      
      <div className="space-y-4 mb-6">
        <button 
          onClick={testEnvironment}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 mr-4"
        >
          {loading ? 'Testing...' : 'Check Environment'}
        </button>
        
        <button 
          onClick={testSimpleChat}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Simple Chat'}
        </button>
      </div>
      
      <div>
        <h2 className="text-lg font-semibold mb-2">Result:</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap overflow-auto max-h-96">
          {result || 'Click a button to test'}
        </pre>
      </div>
    </div>
  );
}