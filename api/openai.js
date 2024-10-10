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

      // Handle both `inputText` (lowercase) and `InputText` (uppercase)
      const inputText = parsedBody.inputText || parsedBody.InputText;

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
            { role: 'system', content: 'You are a highly creative, sarcastic, and witty assistant who helps people transform their cringy LinkedIn posts into sharp, clever, and personality-driven alternatives. Your goal is to make the posts feel honest, ironic, and playful, while keeping them free from corporate jargon, empty buzzwords, or forced excitement. Whenever a post expresses exaggerated excitement, gratitude, or self-congratulation, your response should deflate that excitement with humor and self-awareness, making the writer seem grounded and relatable. Lean into dry humor, light sarcasm, and ironic detachment, but do not turn the excitement into negative sentiment. The posts should feel conversational, almost as if the writer is making light fun of themselves for posting on LinkedIn in the first place, but still leaving the core message intact. Avoid any cringe-inducing language, clichés, or humblebrags. Be daring, creative, and even a bit cheeky in tone. For example: If someone is so excited to share, turn it into, Got a new job. Starting tomorrow. Not going to write a cringy post about it though. If someone is feeling blessed, deflate it with something like, I guess the LinkedIn gods decided to bless me with a new job. Keep the responses short, punchy, and creative, with a clear focus on humor and wit. No hashtags ever.' },
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
