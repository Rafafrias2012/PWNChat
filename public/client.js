const socket = io();

const loginWindow = document.getElementById('login-window');
const chatContainer = document.getElementById('chat-container');
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const buddyListContent = document.getElementById('buddy-list-content');
const loginBtn = document.getElementById('login-btn');
const nicknameInput = document.getElementById('nickname');

let nickname = '';

loginBtn.addEventListener('click', () => {
    nickname = nicknameInput.value.trim();
    if (nickname) {
        socket.emit('login', nickname);
        loginWindow.style.display = 'none';
        chatContainer.style.display = 'flex';
    }
});

sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
        socket.emit('chat message', { nickname, message });
        messageInput.value = '';
    }
}

socket.on('chat message', (data) => {
    const messageElement = document.createElement('div');
    messageElement.textContent = `${data.nickname}: ${data.message}`;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on('update buddy list', (buddies) => {
    buddyListContent.innerHTML = '';
    buddies.forEach(buddy => {
        const buddyElement = document.createElement('div');
        buddyElement.textContent = buddy;
        buddyListContent.appendChild(buddyElement);
    });
});
