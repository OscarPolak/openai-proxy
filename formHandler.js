<script>
  document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const textarea = document.querySelector('.framer-form-input');

    form.addEventListener('submit', async function (event) {
      event.preventDefault(); // Prevent the form from refreshing the page

      const inputText = textarea.value; // Get the textarea value

      // Check if the input is empty
      if (!inputText) {
        alert('Please enter a LinkedIn post!');
        return;
      }

      console.log('Sending input:', inputText); // Log the input text

      try {
        const response = await fetch('https://openai-proxy-cyan-kappa.vercel.app//api/openai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ inputText }), // Send inputText as JSON
        });

        // Check if the request was successful
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Response data:', data); // Log the response data

        // Show the de-cringed text in a pop-up
        alert(`De-cringed Text: ${data.decringedText}`);

      } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong.');
      }
    });
  });
</script>
