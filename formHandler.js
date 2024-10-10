<script>
  document.addEventListener('DOMContentLoaded', function () {
    // Select the form, textarea, and button by their class names or tag names
    const form = document.querySelector('form'); // Select the form element
    const textarea = document.querySelector('.framer-form-input'); // Selects textarea by its class
    const outputDiv = document.getElementById('output'); // Where we'll display the de-cringed text

    // Add event listener for form submission
    form.addEventListener('submit', async function (event) {
      event.preventDefault(); // Prevent form from reloading the page

      const inputText = textarea.value; // Get the value from the textarea

      // Ensure the input isn't empty
      if (!inputText) {
        alert('Please enter a LinkedIn post to de-cringe!');
        return;
      }

      // Send the input text to the Vercel API (Webhook)
      try {
        const response = await fetch('https://your-vercel-api-url/api/openai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ inputText }), // Send inputText as JSON
        });

        const data = await response.json();

        // Display the de-cringed text in the output div
        outputDiv.innerHTML = `<p>De-cringed Text: ${data.decringedText}</p>`;

      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
      }
    });
  });
</script>
