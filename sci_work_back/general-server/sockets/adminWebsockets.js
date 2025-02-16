const WebSocket = require("ws")
const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')
const User = require("../models/User")
const Project = require("../models/Project")
const Organisation = require("../models/Organisation")
const AdminLog = require("../models/adminLog")

// Map to store WebSocket connections by session token
const admins = new Map(); // This will store WebSocket connections keyed by session token

const send = (ws, message, sessionToken, type, data) => {
  ws.send(JSON.stringify({ message, sessionToken, data: { type, data } }))
}

const getData = async (type, login, ws, sessionToken) => {

  let data;

  switch (type) {
    case "setup": {

      // Fetch all data (user, projects, and organisation)
      const user = await User.findOne({ login })
      if (!user) {
        throw new Error(`User not found for login: ${login}`)
      }

      const organisation = await Organisation.findOne({ name: "default" })

      data = { user, organisation }
      break
    }
    case "projects": {

      const projects = await Project.find({}, {
        activities: 1,
        name: 1,
        startDate: 1,
        endDate: 1,
        userList: 1
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
      data = organisation
      break
    }
    //page specific
    case "Users": {
      const users = await User.find({}, {
        currentSettings: 0,
        notifications: 0,
        password: 0,
        login: 0,
        safetyMail: 0,
        safetyPhone: 0
      })
      data = users
      break
    }
    default: {
      console.log(`Invalid type: ${type}`)
      return
    }
  }
  send(ws, "data", sessionToken, type, data)
}

const logAdminAction = async (adminId, action, targetUserId = null, details = "") => {
  await AdminLog.create({ adminId, action, targetUserId, details })
}

// start the WebSocket server
const startAdminWebSocketServer = (port) => {
  const ws = new WebSocket.Server({ port });

  ws.on("connection", (ws, req) => {
    console.log("New WebSocket connection established.");
    let sessionToken = null

    // When the WebSocket receives a message
    ws.on("message", (message) => {
      try {
        const parsedMessage = JSON.parse(message)

        if (!parsedMessage.sessionToken) {
          return
        }

        switch(parsedMessage.type) {
          case "login": {
            sessionToken = parsedMessage.sessionToken // Store session token
            if (sessionToken) {
              // Store WebSocket connection with session token
              admins.set(sessionToken, {socket: ws, login: parsedMessage.data.login, page: "HomePage"}) // Add WebSocket connection to the map
              console.log(`WebSocket connection associated with session token: ${sessionToken}`)
              
              getData("setup",  parsedMessage.data.login, ws, sessionToken)
            }
            else {
              ws.send(JSON.stringify({ error: "Session token missing" }))
            }
            break
          }
          case "goTo": {
            const page = parsedMessage.data
            admins.get(sessionToken).page = page

            getData(page, parsedMessage.data.login, ws, sessionToken)
            break
          }
          case "addEditData": {
            const {data, type} = parsedMessage.data
            const {item, id} = data
            
            switch (type) {
              case "Users": {
                User.findByIdAndUpdate(id, item, { new: true })
                .then((user) => {
                  if (user) {
                    console.error(`Failed to update user with ID ${userId}.`)
                    return
                  }
                  console.log(`User ${id} updated successfully.`)

                  // Ensure the user is not the sender before broadcasting the update
                  const senderLogin = admins.get(sessionToken).login

                  // Broadcast update to all admins who are on the "Users" page
                  admins.forEach((admin, sessionId) => {
                      if (admin.page === "Users" && admin.login !== senderLogin) {
                          const targetClient = admin.socket;

                          // Ensure the WebSocket is open before sending the message
                          if (targetClient.readyState === WebSocket.OPEN) {
                              send(targetClient, "addEdit", sessionToken, "user", user);
                          }
                      }
                  });
                })
                .catch((err) => {
                  console.error(`Error updating user with ID ${id}:`, err.message)
                })
                break
              }
              case "format": {
                break
              }
              default: {
                console.log("Received unidentified data type:", parsedMessage)
                ws.send(JSON.stringify({ message: "Unknown data type" }))
              }
            }
            break
          }
          default: {
            console.log("Received unidentified message:", parsedMessage)
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
        admins.delete(sessionToken);  // Remove from the clients map when the connection closes
      }
    })
  })

  return ws // Return the WebSocket server
}

// get WebSocket by session token
const getAdminWebSocketByToken = (sessionToken) => {
  return admins.get(sessionToken) || null // Fetch WebSocket instance by session token
}

module.exports = { startAdminWebSocketServer, getAdminWebSocketByToken, clients: admins }
