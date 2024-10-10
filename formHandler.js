<script>
  document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form'); // Form element
    const textarea = document.querySelector('.framer-form-input'); // Textarea element

    form.addEventListener('submit', async function (event) {
      event.preventDefault(); // Prevent form reload

      const inputText = textarea.value; // Get textarea value

      // Log the inputText to verify it's being captured
      console.log('Textarea Input:', inputText);

      if (!inputText) {
        alert('Please enter a LinkedIn post!');
        return;
      }

      try {
        const response = await fetch('https://your-vercel-url.vercel.app/api/openai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ inputText }), // Send inputText as JSON
        });

        // Log request body to verify it's being sent
        console.log('Request Sent:', JSON.stringify({ inputText }));

        // Handle response
        const data = await response.json();
        console.log('Response Data:', data);

        alert(`De-cringed Text: ${data.decringedText}`); // Show de-cringed text

      } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong.');
      }
    });
  });
</script>
