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
            const responseDiv = document.getElementById('chat-output');
            responseDiv.innerHTML = ''; // Clear previous content

            data.forEach((structuredSection, index) => {
                const sectionDiv = document.createElement('div');
                sectionDiv.innerHTML = `<strong>Section ${index + 1}:</strong> ${structuredSection.section}`;
                responseDiv.appendChild(sectionDiv);

                if (structuredSection.bullet_points.length > 0) {
                    const ul = document.createElement('ul');
                    structuredSection.bullet_points.forEach(bullet => {
                        const li = document.createElement('li');
                        li.textContent = bullet;
                        ul.appendChild(li);
                    });
                    sectionDiv.appendChild(ul);
                }
            });

            // Clear the input field after processing the response
            document.getElementById('user-input').value = '';
        })
      .catch(error => {
          console.error('Error:', error);
      });
