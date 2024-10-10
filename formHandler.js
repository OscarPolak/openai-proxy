<script>
  document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form'); // Use form element
    const textarea = document.querySelector('.framer-form-input'); // Target textarea by its class

    form.addEventListener('submit', async function (event) {
      event.preventDefault(); // Prevent form reload

      const inputText = textarea.value; // Get the text from the textarea

      if (!inputText) {
        alert('Please enter some text!'); // Validate input
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

        const data = await response.json(); // Get response data

        // Show the de-cringed text in a browser pop-up alert
        alert(`De-cringed Text: ${data.decringedText}`);

      } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong.');
      }
    });
  });
</script>
