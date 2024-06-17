document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});

document.getElementById('set-context-btn').addEventListener('click', setContext);
document.getElementById('minimize-context-btn').addEventListener('click', toggleContext);

let contextMinimized = false;

function sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
    if (message) {
        addMessageToChat('user', message);
        userInput.value = '';
        setTimeout(() => {
            // Simulating bot response
            addMessageToChat('bot', generateBotResponse(message));
        }, 1000);
    }
}

function setContext() {
    const contextInput = document.getElementById('context-input');
    const context = contextInput.value.trim();
    if (context) {
        // Handle context setting logic here
        console.log("Context set:", context);
        contextInput.value = '';
    }
}

function toggleContext() {
    const contextContainer = document.querySelector('.context-container');
    contextMinimized = !contextMinimized;
    if (contextMinimized) {
        contextContainer.style.display = 'none';
    } else {
        contextContainer.style.display = 'flex';
    }
}

function addMessageToChat(sender, message) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}`;
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function generateBotResponse(message) {
    // Simple bot response logic (can be replaced with actual logic)
    return "You said: " + message;
}
