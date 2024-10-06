import { json } from 'micro'; // Import micro for JSON parsing

export default async function handler(req, res) {
  // Parse the incoming request body
  const { inputText } = await json(req);

  // Check if inputText is provided
  if (!inputText) {
    return res.status(400).json({ error: "No input text provided" });
  }

  const apiKey = process.env.OPENAI_API_KEY; // Fetch OpenAI API key from environment variables

  try {
    // Make the API request to OpenAI
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt: `Make this LinkedIn post less cringy and more witty: ${inputText}`,
        max_tokens: 150,
      }),
    });

    const data = await response.json();
    res.status(200).json({ decringedText: data.choices[0].text });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    res.status(500).json({ error: 'Error calling OpenAI API' });
  }
}
