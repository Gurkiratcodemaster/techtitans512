require('dotenv').config();

console.log('Testing environment variables...');
console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
console.log('OPENAI_API_KEY starts with sk-:', process.env.OPENAI_API_KEY?.startsWith('sk-'));
console.log('OPENAI_API_KEY length:', process.env.OPENAI_API_KEY?.length);
console.log('First few chars:', process.env.OPENAI_API_KEY?.substring(0, 10));

// Test OpenAI import
try {
  const OpenAI = require('openai');
  console.log('OpenAI import successful');
  
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  console.log('OpenAI client created successfully');
} catch (error) {
  console.error('OpenAI error:', error.message);
}