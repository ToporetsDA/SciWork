import React, { useState, useEffect, useCallback } from 'react'
import useWebSocket from 'react-use-websocket'
import LogIn from './pages/dialogs/LogIn'

const Connection = ({ setState, userData, setUserData, data, setData, isLoggedIn, setLoggedIn, setRights, setUsers, isUserUpdatingData, setIsUserUpdatingData, isUserUpdatingUserData, setIsUserUpdatingUserData, updatedProjectId, setUpdatedProjectId }) => {

    const [servers, setServers] = useState([])
  const [loading, setLoading] = useState(true)
  const [sessionToken, setToken] = useState()
  const [receivedData, setReceivedData] = useState()
  const [formValues, setFormValues] = useState()
  const [wsUrl, setWsUrl] = useState(null)

    //create server address string
    const serverAddress = (address) => {
        // Get the address without the scheme (http:// or https://)
        let serverAddress = address.split('://')[1]
        
        // Remove trailing slash if present
        if (serverAddress.endsWith('/')) {
            serverAddress = serverAddress.slice(0, -1)
        }
        
        // Extract the domain and port
        const [domain, port] = serverAddress.split(':')
        
        // Increment the port by 1
        const newPort = parseInt(port, 10) + 1
        
        // Reassemble the address with the new port
        return `${domain}:${newPort}`
    }

    const { sendMessage, readyState } = useWebSocket(wsUrl, {
        onOpen: () => {
            console.log('WebSocket connection established.')
            // Send the login message after the connection is established
            sendMsg(receivedData.sessionToken, "login", { login: formValues.login });
        },
        onClose: () => console.log('WebSocket connection closed'),
        onMessage: (event) => handleResponse(event),
        onError: (error) => {
            console.error('WebSocket error:', error)
        },
        shouldReconnect: () => true, // Reconnect on disconnection
        queryParams: { token: sessionToken }, // Optional query params
        share: true // Share the WebSocket instance between components
    })

    // Callback to send a message
    const sendMsg = useCallback((sessionToken, type, data) => {
        const message = {
            type: type,          // e.g., "login"
            sessionToken,        // Auth token
            data: data,          // Payload data
            timestamp: new Date().toISOString(), // Optional timestamp
        }

        // Send the message as a JSON string
        sendMessage(JSON.stringify(message))
        console.log('Sent message:', message)

        setIsUserUpdatingData(false) // Reset flag
        setIsUserUpdatingUserData(false) // Reset flag
    }, [sendMessage, setIsUserUpdatingData, setIsUserUpdatingUserData])

    const handleResponse = useCallback((event) => {
        console.log("from handleResponse: ", data)
        try {
            const response = JSON.parse(event.data)
            console.log(response) // This will log the entire response
        
            // Now, you can access specific parts of the response
            switch(response.message) {
            case "data": {
                const { data } = response
                const { type, data: fetchedData } = data
        
                console.log("Received data type:", type)
                console.log("Fetched data:", fetchedData)
        
                // You can handle the data based on the type (user, projects, etc.)
                switch (type) {
                case "all": {
                    setUserData(fetchedData.user)
                    setData(fetchedData.projects)
                    setRights(fetchedData.organisation.rights)
                    setUsers(fetchedData.users)
                    break
                }
                case "user": {
                    setUserData(fetchedData)
                    break
                }
                case "projects": {
                    setData(fetchedData)
                    break
                }
                case "organisation": {
                    setRights(fetchedData.organisation.rights)
                    break
                }
                case "users": {
                    setUsers(fetchedData.users)
                    break
                }
                default: {
                    console.log("Unknown data type:", type)
                }
                }
                break
            }
            case "addEdit": {
                const { type, data: fetchedData } = response.data
        
                console.log("Received data type:", type)
                console.log("Updated:", fetchedData)
        
                // You can handle the data based on the type (user, projects, etc.)
                switch (type) {
                case"project": {
                    const item = fetchedData
                    if (data.find(project => project._id === item._id).length === 0) {
                    setData(prevData => ({ ...prevData, item }))
                    }
                    else {
                        setData(prevData => 
                            prevData.map(project => 
                            project._id === item._id ? item : project
                        ))
                    }
                    break
                }
                case"user": {
                    setUserData(fetchedData)
                    break
                }
                default: {

                }
                }
                break
            }
            default: {
                console.log("Unknown message: ", response.message)
            }
            }
            setLoggedIn(true);
        } catch (error) {
            console.error("Error processing message:", error.message)
        }
    }, [data, setData, setLoggedIn, setRights, setUsers, setUserData])

    // Track user-initiated changes to `data` (projects)
    const updateProject = useCallback((sessionToken, updatedProject) => {

        if (readyState === 1) { // Check if WebSocket is open
            sendMsg(sessionToken, "addEditProject", updatedProject)
            console.log("Sent project update:", updatedProject)
        } else {
            console.error("WebSocket is not open. Cannot send project update.")
        }

    }, [readyState, sendMsg])

    // Trigger project update when a user modifies `data`
    useEffect(() => {
        if (isUserUpdatingData) {
            const updatedProject = data.find((project) => project.id === updatedProjectId)
            if (updatedProject) {
                updateProject(sessionToken, updatedProject) // Pass session token and updated project
            }
        }
    }, [data, updateProject, updatedProjectId, sessionToken, isUserUpdatingData])

    // Track user-initiated changes to `userData`
    const updateUser = useCallback((sessionToken, updatedUserData) => {

        if (readyState === 1) { // Check if WebSocket is open
            sendMsg(sessionToken, "addEditUser", updatedUserData)
            console.log("Sent user update:", updatedUserData)
        } else {
            console.error("WebSocket is not open. Cannot send user update.")
        }
    }, [readyState, sendMsg])

    // Trigger user update when a user modifies `userData`
    useEffect(() => {
        if (isUserUpdatingUserData) {
            updateUser(sessionToken, userData) // Pass session token and updated user data
        }
    }, [userData, updateUser, sessionToken, isUserUpdatingUserData])

    //on login
    const loginToServer = async (formValues) => {
        const selectedServer = servers.find((server) => server.id === formValues.server)
    
        if (!selectedServer) {
            alert("Invalid server selected.")
            return
        }
    
        try {
            const response = await fetch(`${selectedServer.address}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ login: formValues.login, password: formValues.password })
            })

            if (response.status === 200) {
                console.log('Login successful')
                const data = await response.json()
                setToken(data.sessionToken)

                setReceivedData(data)
                setFormValues(formValues)

                // Set WebSocket URL dynamically
                const wsAddress = `ws://${serverAddress(selectedServer.address)}`
                setWsUrl(wsAddress)

                console.log('WebSocket URL:', wsAddress)
            }
            else {
                alert('Login failed')
            }
        } catch (error) {
            alert('An error occurred during login.')
            console.error(error)
        }
    }

    //get list of organisations whos servers are on
    useEffect(() => {
        const fetchServers = async () => {
            try {
                const response = await fetch('http://localhost:3000/servers/list')
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                
                const data = await response.json();
                setServers(data)
                setLoading(false)
            } catch (error) {
                console.error("Failed to fetch servers:", error)
                setLoading(false)
            }
        }

        fetchServers()
    }, [])

    return (
        <div>
            {loading ? (
                <p>Loading servers...</p> // Display loading message while fetching servers
            ) : (
                <LogIn
                    setState={setState}
                    isLoggedIn={isLoggedIn}
                    servers={servers}
                    loginToServer={loginToServer}
                />
            )}
        </div>
    )
}

export default Connection
