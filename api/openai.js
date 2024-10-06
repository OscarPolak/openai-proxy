export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  let body = '';

  req.on('data', chunk => {
    body += chunk.toString(); // Convert Buffer to string
  });

  req.on('end', async () => {
    try {
      const { inputText } = JSON.parse(body);

      if (!inputText) {
        return res.status(400).json({ error: 'No input text provided' });
      }

      // Use your OpenAI API key from environment variables
      const apiKey = 'sk-svcacct-bst2Ee2gOoOV4lSWfjmujgfRsfs9WyJK9-f0mMbI_PlWuBuwvpZWIuiPqypd9AXCZGNRKT3BlbkFJAexqtnVy4VGpJTheYe1ciknwhcR48hbOkZ039GfDgdiNfbO723cKx4sEqqjsocQh_3OAA';

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
      console.error('Error in OpenAI API request:', error);
      res.status(500).json({ error: 'Error in OpenAI API request' });
    }
  });
}
