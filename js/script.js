document.addEventListener("DOMContentLoaded", () => {
    loadConversations();
});

function submitContext() {
    const context = document.getElementById('context-input').value;
    // Call your API to submit context
    console.log('Context submitted:', context);
}

function toggleContextBox() {
    const contextBox = document.getElementById('context-box');
    if (contextBox.style.display === 'none') {
        contextBox.style.display = 'block';
    } else {
        contextBox.style.display = 'none';
    }
}

function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    // Call your API to send message and get response
    addMessage(userInput, 'user');
    document.getElementById('user-input').value = '';
    fetchResponse(userInput);
}

function addMessage(message, sender) {
    const messageContainer = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.className = sender;
    messageContainer.appendChild(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

function fetchResponse(userInput) {
    // Simulate API call
    setTimeout(() => {
        const response = 'This is a response from the AI.';
        addMessage(response, 'ai');
    }, 1000);
}

function loadConversations() {
    // Load conversation list from a JSON database or API
    const conversations = ['Conversation 1', 'Conversation 2', 'Conversation 3'];
    const conversationList = document.getElementById('conversation-list');
    conversations.forEach(conversation => {
        const li = document.createElement('li');
        li.textContent = conversation;
        conversationList.appendChild(li);
    });
}
