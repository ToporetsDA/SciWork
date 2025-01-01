const WebSocket = require("ws");

// Map to store WebSocket connections by login
const clients = new Map();

// Create a WebSocket server
function startWebSocketServer(port) {
  const wss = new WebSocket.Server({ port });

  wss.on("connection", (ws, req) => {
    console.log("New WebSocket connection established.");
    let userLogin = null; // Track the user's login for this connection

    // Associate WebSocket connection with login
    ws.on("message", (message) => {
      try {
        const parsedMessage = JSON.parse(message);

        // Handle login message
        if (parsedMessage.type === "login") {
          userLogin = parsedMessage.login; // Store user login
          if (userLogin) {
            // Store the WebSocket connection with the user's login
            clients.set(userLogin, ws); // Add WebSocket connection to the map
            console.log(`WebSocket connection associated with login: ${userLogin}`);
            ws.send(JSON.stringify({ message: "WebSocket connection established for login", login: userLogin }));
          } else {
            ws.send(JSON.stringify({ error: "Login identifier missing" }));
          }
        } else {
          console.log("Received non-login message:", parsedMessage);
          ws.send(JSON.stringify({ message: "Message received" }));
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error.message);
      }
    });

    // Handle connection close
    ws.on('close', (code, reason) => {
      if (userLogin) {
        console.log(`WebSocket for ${userLogin} disconnected. Code: ${code}, Reason: ${reason}`);
        clients.delete(userLogin);  // Remove from the clients map
        // You can also perform additional cleanup, like updating a database or notifying other clients
      }
    });
  });

  return wss; // Return the WebSocket server to be used where necessary
}

// Function to get WebSocket by login
function getWebSocketByLogin(login) {
  return clients.get(login) || null; // Fetch WebSocket instance by login
}

module.exports = { startWebSocketServer, getWebSocketByLogin };
