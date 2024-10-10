export default async function handler(req, res) {
  // Add CORS headers to allow requests from anywhere
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle pre-flight CORS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Ensure it's a POST request
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Log the received request body for debugging
    console.log('Received request body:', req.body);

    const { inputText } = req.body; // Extract inputText

    // If inputText is missing, return an error
    if (!inputText) {
      console.error('No input text provided');
      return res.status(400).json({ error: 'No input text provided' });
    }

    // Make a request to the OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
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

    const data = await openAIResponse.json(); // Parse the OpenAI API response

    // Return the de-cringed text as the response
    res.status(200).json({ decringedText: data.choices[0].message.content });

  } catch (error) {
    console.error('Error communicating with OpenAI API:', error);
    res.status(500).json({ error: 'Error processing the request' });
  }
}
