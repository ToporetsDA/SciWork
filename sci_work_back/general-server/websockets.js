const WebSocket = require("ws");
const User = require("./models/User");
const Project = require("./models/Project");
const Organisation = require("./models/Organisation");

// Map to store WebSocket connections by session token
const clients = new Map(); // This will store WebSocket connections keyed by session token

const getData = async (type, login, ws, sessionToken) => {

  let data;

  switch (type) {
    case "all": {

      // Fetch all data (user, projects, and organisation)
      const user = await User.findOne({ login })
      if (!user) {
        throw new Error(`User not found for login: ${login}`)
      }
      const projects = await Project.find({
        "userList.id": user._id.toString(),
      });
      const organisation = await Organisation.findOne({ name: "default" })

      data = { user, projects, organisation }
      break
    }
    case "user": {

      // Fetch user by login
      const user = await User.findOne({ login })
      if (!user) {
        throw new Error(`User not found for login: ${login}`)
      }
      data =  user
      break
    }
    case "projects": {

      // Fetch projects where user is in userList
      const user = await User.findOne({ login })
      if (!user) {
        throw new Error(`User not found for login: ${login}`)
      }
      const projects = await Project.find({
        "userList.id": user._id.toString(),
      })

      data =  projects
      break
    }
    case "organisation": {

      // Fetch organisation with name "default"
      const organisation = await Organisation.findOne({ name: "default" })
      if (!organisation) {
        throw new Error("Organisation with name 'default' not found")
      }
      data =  organisation
      break
    }
    default: {
      throw new Error(`Invalid type: ${type}`)
    }
  }
  ws.send(JSON.stringify({ message: "data", sessionToken, data: { type, data } }))
} 

// start the WebSocket server
const startWebSocketServer = (port) => {
  const wss = new WebSocket.Server({ port });

  wss.on("connection", (ws, req) => {
    console.log("New WebSocket connection established.");
    let sessionToken = null

    // When the WebSocket receives a message
    ws.on("message", (message) => {
      try {
        const parsedMessage = JSON.parse(message)

        // Handle login message (associating WebSocket with sessionToken)
        if (parsedMessage.sessionToken) {

          switch(parsedMessage.type) {
            case "login": {
              sessionToken = parsedMessage.sessionToken // Store session token
              if (sessionToken) {
                // Store WebSocket connection with session token
                clients.set(sessionToken, {socket: ws, login: parsedMessage.data.login}) // Add WebSocket connection to the map
                console.log(`WebSocket connection associated with session token: ${sessionToken}`)
                
                getData("all",  parsedMessage.data.login, ws, sessionToken)
              }
              else {
                ws.send(JSON.stringify({ error: "Session token missing" }))
              }
              break
            }
            default: {
              console.log("Received unidentified message:", parsedMessage)
              ws.send(JSON.stringify({ message: "Message received" }))
            }
          }
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error.message)
      }
    })

    // Handle WebSocket connection close
    ws.on('close', () => {
      if (sessionToken) {
        console.log(`WebSocket for session token ${sessionToken} disconnected.`)
        clients.delete(sessionToken);  // Remove from the clients map when the connection closes
      }
    })
  })

  return wss // Return the WebSocket server
}

// get WebSocket by session token
const getWebSocketByToken = (sessionToken) => {
  return clients.get(sessionToken) || null // Fetch WebSocket instance by session token
}

module.exports = { startWebSocketServer, getWebSocketByToken, clients }
