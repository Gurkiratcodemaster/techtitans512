'use client';

import { useState } from 'react';

export default function TestAPI() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setResult('Testing...');
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Hello, test message' }]
        })
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        const errorData = await response.json();
        setResult(`Error ${response.status}: ${JSON.stringify(errorData, null, 2)}`);
        return;
      }

      // Try to read the stream
      const reader = response.body?.getReader();
      if (!reader) {
        setResult('No response body reader available');
        return;
      }

      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        fullResponse += chunk;
        setResult(prev => prev + '\n' + chunk);
      }

      setResult('Success! Full response:\n' + fullResponse);

    } catch (error) {
      console.error('Test error:', error);
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
      
      <button 
        onClick={testAPI}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Chat API'}
      </button>
      
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Result:</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap overflow-auto max-h-96">
          {result || 'Click the button to test the API'}
        </pre>
      </div>
    </div>
  );
}