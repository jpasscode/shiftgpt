document.addEventListener('DOMContentLoaded', function() {
    // Attach event listener to the form
    const form = document.getElementById('chat-form');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission

            // Get user input
            const userInput = document.getElementById('user-input').value.trim();
            if (userInput) {
                // Send the user input to the Flask backend
                fetch('/ask-gpt', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ query: userInput })
                })
                .then(response => response.json()) // Parse the JSON response
                .then(data => {
                    // Handle the response from the server
                    const chatOutput = document.getElementById('chat-output');
                    chatOutput.innerHTML = ''; // Clear previous output

                    if (data.response) {
                        // Create a div to display the response
                        const responseDiv = document.createElement('div');
                        responseDiv.textContent = data.response;
                        chatOutput.appendChild(responseDiv);
                    } else if (data.error) {
                        // Handle any errors
                        chatOutput.textContent = `Error: ${data.error}`;
                    }
                })
                .catch(error => {
                    // Handle any errors during fetch
                    console.error('Fetch error:', error);
                    const chatOutput = document.getElementById('chat-output');
                    chatOutput.textContent = `Fetch error: ${error.message}`;
                })
                .finally(() => {
                    // Clear the input field after processing
                    document.getElementById('user-input').value = '';
                });
            }
        });
    } else {
        console.error("Form with ID 'chat-form' not found.");
    }
});
