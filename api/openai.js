export default async function handler(req, res) {
  // CORS headers to allow requests from anywhere (or specify your domain)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle CORS preflight request (for POST requests)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Ensure it's a POST request
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Extract the input text from the request body
  const { inputText } = req.body;

  // Check if the input text is missing
  if (!inputText) {
    return res.status(400).json({ error: 'No input text provided' });
  }

  try {
    // Send request to OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Make sure your API key is in Vercel env variables
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // ChatGPT model
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: `De-cringe this LinkedIn post: ${inputText}` }
        ],
        max_tokens: 150,
      }),
    });

    const data = await response.json();

    // Send the de-cringed response back to the form
    res.status(200).json({ decringedText: data.choices[0].message.content });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Something went wrong on the server' });
  }
}
