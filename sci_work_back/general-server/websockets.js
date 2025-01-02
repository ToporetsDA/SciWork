const WebSocket = require("ws");
const User = require("./models/User");
const Project = require("./models/Project");
const Organisation = require("./models/Organisation");

// Map to store WebSocket connections by session token
const clients = new Map(); // This will store WebSocket connections keyed by session token

const send = (ws, message, sessionToken, type, data) => {
  ws.send(JSON.stringify({ message, sessionToken, data: { type, data } }))
}

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
  send(ws, "data", sessionToken, type, data)
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
            case "addEditProject": {
              const { projectId, updatedProject } = parsedMessage.data

              // Convert projectId to ObjectId for MongoDB query
              const objectId = new ObjectId(projectId)
              
              // Update project in the database
              const project = Project.findByIdAndUpdate(objectId, updatedProject, { new: true })
              
              if (project) {
                console.log(`Project ${projectId} updated successfully.`)

                // Broadcast the updated project to all relevant users except the sender
                project.userList.forEach(user => {
                  try {
                    // Fetch user data from the database to get login
                    const userData = User.findById(user.id)
            
                    if (userData && clients.has(userData.login)) {
                      const targetClient = clients.get(userData.login).socket
          
                      // Check if this is not the sender
                      if (userData.login !== clients.get(sessionToken).login && targetClient.readyState === WebSocket.OPEN) {
                        send(targetClient, "addEdit", sessionToken, "project", project)
                      }
                    }
                  } catch (error) {
                      console.error(`Error fetching user data for ID ${user.id}:`, error.message)
                  }
                })
              }
              else {
                console.error(`Failed to update project with ID ${projectId}.`)
              }
              break
            }
            case "addEditUser": {
              const { userId, updatedUserData } = parsedMessage.data
          
              try {
                  // Update the user in the database

                  // Convert userId to ObjectId for MongoDB query
                  const objectId = new ObjectId(userId)

                  // Update the user in the database
                  const user = User.findByIdAndUpdate(objectId, updatedUserData, { new: true })
          
                  if (user) {
                    console.log(`User ${userId} updated successfully.`)
        
                    // Ensure the user is not the sender before broadcasting the update
                    const senderLogin = clients.get(sessionToken).login

                    // Notify relevant WebSocket client (not the sender)
                    const targetClient = clients.get(user.login)?.socket
        
                    if (user.login !== senderLogin && targetClient.readyState === WebSocket.OPEN) {
                      send(targetClient, "addEdit", sessionToken, "updateUser", user)
                    }
                  }
                  else {
                    console.error(`Failed to update user with ID ${userId}.`)
                  }
              } catch (error) {
                  onsole.error(`Error updating user with ID ${userId}:`, error.message)
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
