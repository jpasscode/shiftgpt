document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('chat-form');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            const userInput = document.getElementById('user-input').value.trim();
            if (userInput) {
                displayMessage(userInput, 'user');
                displayLoading();
                fetch('/ask-gpt', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ query: userInput })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.response) {
                        displayMessage(data.response, 'bot');
                    } else if (data.error) {
                        displayMessage(`Error: ${data.error}`, 'error');
                    }
                })
                .catch(error => {
                    displayMessage(`Error: ${error.message}`, 'error');
                })
                .finally(() => {
                    hideLoading();
                    document.getElementById('user-input').value = '';
                });
            }
        });
    }
});

function displayLoading() {
    document.getElementById('loading').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

function displayMessage(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    messageDiv.textContent = message;

    const chatOutput = document.getElementById('chat-output');
    chatOutput.appendChild(messageDiv);
    chatOutput.scrollTop = chatOutput.scrollHeight;
}
