export default async function handler(req, res) {
  // Add CORS headers to allow cross-origin requests from your Framer website
  res.setHeader('Access-Control-Allow-Origin', '*');  // You can replace '*' with your specific domain to restrict access
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle pre-flight CORS request (for POST requests)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Ensure it's a POST request
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Extract the inputText from the request body
  const { inputText } = req.body;

  if (!inputText) {
    return res.status(400).json({ error: 'No input text provided' });
  }

  try {
    // Call the OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Use your OpenAI API key from Vercel environment variables
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // The GPT model you're using
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: `De-cringe this LinkedIn post: ${inputText}` }
        ],
        max_tokens: 150, // Limit the length of the response
      }),
    });

    const data = await response.json();

    // Return the de-cringed text as the response to the form
    res.status(200).json({ decringedText: data.choices[0].message.content });

  } catch (error) {
    console.error('Error communicating with OpenAI API:', error);
    res.status(500).json({ error: 'Error processing the request' });
  }
}
