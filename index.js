const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

const buddies = new Set();

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('login', (nickname) => {
        socket.nickname = nickname;
        buddies.add(nickname);
        io.emit('update buddy list', Array.from(buddies));
    });

    socket.on('chat message', (data) => {
        io.emit('chat message', data);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
        if (socket.nickname) {
            buddies.delete(socket.nickname);
            io.emit('update buddy list', Array.from(buddies));
        }
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
