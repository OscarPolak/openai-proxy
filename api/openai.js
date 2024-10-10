export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Ensure it's a POST request
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  let body = '';

  // Manually parse the request body
  req.on('data', chunk => {
    body += chunk.toString(); // Convert buffer to string
  });

  req.on('end', async () => {
    try {
      const parsedBody = JSON.parse(body); // Manually parse JSON body
      console.log('Parsed request body:', parsedBody);

      const { inputText } = parsedBody;

      // If inputText is missing, return an error
      if (!inputText) {
        console.error('No input text provided');
        return res.status(400).json({ error: 'No input text provided' });
      }

      // Call OpenAI API
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
      console.log('OpenAI response:', data);

      // Return the de-cringed text as the response
      res.status(200).json({ decringedText: data.choices[0].message.content });

    } catch (error) {
      console.error('Error processing the request:', error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  });
}
