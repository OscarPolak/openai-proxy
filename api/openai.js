export default async function handler(req, res) {
  // Add CORS headers to allow requests from any origin
  res.setHeader('Access-Control-Allow-Origin', '*');  // Allows requests from all origins
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS'); // Allow POST and OPTIONS methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allow Content-Type header

  // Handle pre-flight request for CORS (OPTIONS method)
  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // If it's an OPTIONS request, return 200 OK
  }

  // Make sure the request is a POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Get the input text from the request body
  const { inputText } = req.body;

  // If there's no input text, return an error
  if (!inputText) {
    return res.status(400).json({ error: 'No input text provided' });
  }

  try {
    // Make the API call to OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Your OpenAI API key
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: `De-cringe this LinkedIn post: ${inputText}` }
        ],
        max_tokens: 150,
      }),
    });

    const data = await response.json();

    // Return the de-cringed text as the response
    res.status(200).json({ decringedText: data.choices[0].message.content });
  } catch (error) {
    console.error('Error communicating with OpenAI API:', error);
    res.status(500).json({ error: 'Error fetching from OpenAI API' });
  }
}
