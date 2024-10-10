export default async function handler(req, res) {
  // Add CORS headers to allow cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle pre-flight CORS request (for POST)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Make sure it's a POST request
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Get the LinkedIn post from the request body
  const { inputText } = req.body;

  // If no inputText, return an error
  if (!inputText) {
    return res.status(400).json({ error: 'No input text provided' });
  }

  try {
    // Send the prompt to OpenAI API (chatgpt-3.5-turbo model)
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Add this in Vercel environment variables
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: `De-cringe this LinkedIn post: ${inputText}` },
        ],
        max_tokens: 150,
      }),
    });

    const data = await response.json();

    // Return the de-cringed response back to the client
    res.status(200).json({ decringedText: data.choices[0].message.content });
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
    res.status(500).json({ error: 'Failed to process your request' });
  }
}
