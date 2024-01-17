// Inside script.js

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('chat-form'); // Make sure you have a form with this ID in your HTML
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission
        const userInput = document.getElementById('user-input').value;

        // Use fetch to send the userInput to your Flask backend
        fetch('/ask-gpt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: userInput })
        })
        .then(response => response.json()) // Convert the response to JSON
        .then(data => {
            const chatOutput = document.getElementById('chat-output');
            chatOutput.innerHTML = ''; // Clear previous content

      if (data.response) {
        // Display the response from OpenAI's API
        const responseDiv = document.createElement('div');
        responseDiv.textContent = data.response;
        chatOutput.appendChild(responseDiv);
      } else if (data.error) {
        // Display any errors that occurred
        chatOutput.textContent = `Error: ${data.error}`;
      }

      // Clear the input field
      document.getElementById('user-input').value = '';
      })
      .catch(error => {
      console.error('Error:', error);
      const chatOutput = document.getElementById('chat-output');
      chatOutput.textContent = `Error: ${error.message}`;
      });
      });
      });