export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Log the request body to see if data is coming through
  console.log('Request Body:', req.body);

  const { inputText } = req.body;

  if (!inputText) {
    return res.status(400).json({ error: 'No input text provided' });
  }

  try {
    // Make the API call to OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Use your OpenAI API key here
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: `Make this LinkedIn post less cringy: ${inputText}` }
        ],
        max_tokens: 150,
      }),
    });

    const data = await response.json();

    // Log the OpenAI response to see what's returned
    console.log('OpenAI Response:', data);

    // Return the OpenAI response
    res.status(200).json({ decringedText: data.choices[0].message.content });
  } catch (error) {
    console.error('Error communicating with OpenAI API:', error);
    res.status(500).json({ error: 'Error fetching from OpenAI API' });
  }
}
