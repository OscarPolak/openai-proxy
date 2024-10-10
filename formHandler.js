<script>
  document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const textarea = document.querySelector('.framer-form-input');

    form.addEventListener('submit', async function (event) {
      event.preventDefault(); // Prevent form reload

      const inputText = textarea.value; // Get the input value from the textarea

      if (!inputText) {
        alert('Please enter a LinkedIn post!');
        return;
      }

      console.log('Sending input:', inputText); // Log the input text to be sure

      try {
        const response = await fetch('https://openai-proxy-cyan-kappa.vercel.app/api/openai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ inputText }), // Send the inputText as JSON
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Received response from OpenAI:', data); // Log the response from Vercel

        // Extract the de-cringed text from the OpenAI response
        const decringedText = data.decringedText || data.choices[0].message.content;

        // Show the de-cringed text in a pop-up or update the page
        alert(`De-cringed Text: ${decringedText}`);

      } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong. Please try again.');
      }
    });
  });
</script>
