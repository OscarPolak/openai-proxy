export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Collect and parse the incoming request body
    const { inputText } = req.body || {};

    if (!inputText) {
      return res.status(400).json({ error: 'No input text provided' });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    // Send a request to OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: `Please rewrite this LinkedIn post: ${inputText}` }
        ],
        max_tokens: 150,
      }),
    });

    const data = await response.json();
    res.status(200).json({ decringedText: data.choices[0].message.content });
  } catch (error) {
    console.error('Error in serverless function:', error);
    res.status(500).json({ error: 'Error in serverless function' });
  }
}
