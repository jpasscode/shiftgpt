document.addEventListener('DOMContentLoaded', function() {
    // Initialize the first, static chat window
    initChatWindow('initial');

    document.getElementById('new-chat-btn').addEventListener('click', function() {
        const sessionID = generateSessionID();
        createNewChatWindow(sessionID);
    });
});

function initChatWindow(sessionID) {
    let formID = sessionID === 'initial' ? 'chat-form' : `form-${sessionID}`;
    const form = document.getElementById(formID);

    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            handleFormSubmission(sessionID);
        });
    }
}

function createNewChatWindow(sessionID) {
    const chatWindow = document.createElement('div');
    chatWindow.classList.add('chat-window');
    chatWindow.innerHTML = `
        <div class="chat-output" id="output-${sessionID}"></div>
        <form class="chat-form" id="form-${sessionID}">
            <input type="text" class="user-input" placeholder="Ask me anything...">
            <button type="submit" class="submit-query">Send</button>
        </form>
        <div class="loading" id="loading-${sessionID}" style="display: none;">
            <div class="loader"></div>
        </div>
    `;
    document.getElementById('chat-windows-container').appendChild(chatWindow);

    // Initialize the event listeners for the new chat window
    initChatWindow(sessionID);
}

function handleFormSubmission(sessionID) {
    let userInputField;
    if (sessionID === 'initial') {
        userInputField = document.querySelector('#user-input');
    } else {
        userInputField = document.querySelector(`#form-${sessionID} .user-input`);
    }

    if (userInputField) {
        const userInput = userInputField.value.trim();
        if (userInput) {
            displayMessage(userInput, 'user', sessionID);
            displayLoading(sessionID);

            fetch('/ask-gpt', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ query: userInput, session_id: sessionID })
            })
            .then(response => response.json())
            .then(data => {
                if (data.response) {
                    displayMessage(data.response, 'bot', sessionID);
                } else if (data.error) {
                    displayMessage(`Error: ${data.error}`, 'error', sessionID);
                }
            })
            .catch(error => {
                displayMessage(`Error: ${error.message}`, 'error', sessionID);
            })
            .finally(() => {
                hideLoading(sessionID);
                userInputField.value = '';
            });
        }
    } else {
        console.error('User input field not found');
        // Handle this error appropriately, perhaps by displaying a message to the user
    }
}

function displayLoading(sessionID) {
    let loadingElementID = sessionID === 'initial' ? 'loading' : `loading-${sessionID}`;
    const loadingElement = document.getElementById(loadingElementID);

    if (loadingElement) {
        loadingElement.style.display = 'flex';
    } else {
        console.error(`Loading element not found for sessionID: ${sessionID}`);
        // Handle this error appropriately
    }
}

function hideLoading(sessionID) {
    let loadingElementID = sessionID === 'initial' ? 'loading' : `loading-${sessionID}`;
    const loadingElement = document.getElementById(loadingElementID);

    if (loadingElement) {
        loadingElement.style.display = 'none';
    } else {
        console.error(`Loading element not found for sessionID: ${sessionID}`);
        // Handle this error appropriately
    }
}

function typeMessage(message, element) {
    let i = 0;
    const speed = 15; // Speed of typing, in milliseconds

    function typeCharacter() {
        if (i < message.length) {
            element.textContent += message.charAt(i);
            i++;
            setTimeout(typeCharacter, speed);
        }
    }

    typeCharacter();
}

function displayMessage(message, sender, sessionID) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);

    // Determine the correct ID for the chat output container
    let chatOutputID = sessionID === 'initial' ? 'chat-output' : `output-${sessionID}`;
    const chatOutput = document.getElementById(chatOutputID);

    if (chatOutput) {
        chatOutput.appendChild(messageDiv);
        typeMessage(message, messageDiv); // Use typeMessage here
        chatOutput.scrollTop = chatOutput.scrollHeight;
    } else {
        console.error(`Chat output container not found for sessionID: ${sessionID}`);
    }
}




function generateSessionID() {
    return Math.random().toString(36).substr(2, 9);
}
