const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Serve the HTML and JavaScript files
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/socket.io/socket.io.js', (req, res) => {
  res.sendFile(__dirname + '/node_modules/socket.io/client-dist/socket.io.js');
});

// Keep track of connected peers
let peers = [];

// Handle new connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Add the new peer to the list of connected peers
  peers.push(socket.id);

  // If there are two peers connected, send each other's socket ID
  if (peers.length === 2) {
    io.to(peers[0]).emit('peer-id', peers[1]);
    io.to(peers[1]).emit('peer-id', peers[0]);
  }

  // Handle counter increment messages
  socket.on('counter-incremented', (newCounterValue) => {
    // Broadcast the new counter value to all connected peers
    socket.broadcast.emit('counter-incremented', newCounterValue);
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    // Remove the disconnected peer from the list
    peers = peers.filter((peer) => peer !== socket.id);
  });
});

// Start the server
http.listen(3000, () => {
  console.log('Server listening on *:3000');
});
