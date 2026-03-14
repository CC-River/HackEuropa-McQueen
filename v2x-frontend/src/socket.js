import { io } from 'socket.io-client';

// Dedicated single instance of Socket.io client 
// pointing to Person 1's backend node server running locally on port 3000
const socket = io('http://localhost:3000', {
    transports: ['websocket', 'polling'] // fallback support
});

export default socket;
