const WebSocket = require('ws');

// Create a WebSocket server
function startWebSocketServer(port) {
  const wss = new WebSocket.Server({ port });

  wss.on('connection', (ws) => {
    console.log('New WebSocket connection established.');
    
    ws.on('message', (message) => {
      console.log('Received message:', message);
      ws.send('Message received!');
    });
  });

  return wss; // Return the WebSocket server to be used where necessary
}

// Function to get WebSocket by login
function getWebSocketByLogin(login) {
    return clients.get(login); // Fetch WebSocket instance by login
}

module.exports = { startWebSocketServer, getWebSocketByLogin };
