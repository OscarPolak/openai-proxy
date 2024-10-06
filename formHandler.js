document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.decringe-form');
    const textarea = document.querySelector('.cringe-input');
    const button = document.querySelector('.decringe-button');

    // Check if the form and elements are present before proceeding
    if (form && textarea && button) {
        form.addEventListener('submit', async function(event) {
            event.preventDefault(); // Prevent default form submission

            const inputText = textarea.value;

            // Ensure the input is not empty
            if (!inputText) {
                alert('Please enter a LinkedIn post to de-cringe!');
                return;
            }

            // Make the API call to your Vercel endpoint
            try {
                const response = await fetch('https://openai-proxy-cyan-kappa.vercel.app/api/openai', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ inputText }), // Send the input text as JSON
                });

                const data = await response.json();
                const decringedText = data.decringedText;

                // Show the result in a browser alert
                alert(`Rewritten Post: ${decringedText}`);

            } catch (error) {
                console.error('Error fetching from Vercel API:', error);
                alert('Something went wrong. Please try again later.');
            }
        });
    }
});
