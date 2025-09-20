// Simple test script to check the API
const testMessages = [
  {
    role: 'user',
    content: 'Hello, can you help me with career guidance?'
  }
];

fetch('http://localhost:3000/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    messages: testMessages
  })
})
.then(response => {
  console.log('Response status:', response.status);
  console.log('Response headers:', response.headers);
  
  if (!response.ok) {
    return response.json().then(errorData => {
      console.error('Error response:', errorData);
      throw new Error(`HTTP ${response.status}: ${JSON.stringify(errorData)}`);
    });
  }
  
  if (response.body) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    function readStream() {
      reader.read().then(({ done, value }) => {
        if (done) {
          console.log('Stream finished');
          return;
        }
        
        const chunk = decoder.decode(value);
        console.log('Received chunk:', chunk);
        readStream();
      }).catch(error => {
        console.error('Stream error:', error);
      });
    }
    
    readStream();
  }
})
.catch(error => {
  console.error('Fetch error:', error);
});