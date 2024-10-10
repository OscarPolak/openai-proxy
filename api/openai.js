export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Make sure it's a POST request
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  console.log('Received request body:', req.body); // Log the request body to see what was received

  const { inputText } = req.body;

  if (!inputText) {
    console.error('No input text provided');
    return res.status(400).json({ error: 'No input text provided' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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

    const data = await response.json();
    console.log('OpenAI Response:', data); // Log the OpenAI response

    res.status(200).json({ decringedText: data.choices[0].message.content });

  } catch (error) {
    console.error('Error communicating with OpenAI API:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}
