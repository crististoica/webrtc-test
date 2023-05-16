// Variables to store the count and the button element
let count = 0;
const countButton = document.getElementById('countButton');
const countDisplay = document.getElementById('count');

// Update the count display
function updateCountDisplay() {
  countDisplay.textContent = count;
}

// Create a new Peer object
const peer = new Peer();

// Store connections in an array
const connections = [];

// Event listener for PeerJS connection open event
peer.on('open', (peerId) => {
  console.log('My peer ID is: ' + peerId);
});

// Event listener for incoming data connection
peer.on('connection', (conn) => {
  console.log('Incoming connection from ' + conn.peer);
  connections.push(conn); // Add the new connection to the array
  conn.on('data', (data) => {
    if (data === 'increment') {
      count++;
      updateCountDisplay();
    }
  });
});

// Event listener for button click
countButton.addEventListener('click', () => {
  count++;
  updateCountDisplay();
  console.log(connections);

  // Send the increment message to all connected peers
  connections.forEach((conn) => {
    conn.send('increment');
  });
});
