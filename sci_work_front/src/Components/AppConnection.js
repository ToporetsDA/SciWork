import React, { useState, useEffect } from 'react'

import LogIn from './pages/dialogs/LogIn'

const Connection = ({ setState, userData, setUserData, data, setData, isLoggedIn, setLoggedIn, setRights, isUserUpdatingData, setIsUserUpdatingData, isUserUpdatingUserData, setIsUserUpdatingUserData }) => {

    const [servers, setServers] = useState([])
    const [loading, setLoading] = useState(true)
    const [wss, setWss] = useState()

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
        };

        fetchServers()
    }, [])

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

    const sendMessage = (ws, sessionToken, type, data) => {
        const message = {
            type: type,         // e.g., "login", "statusUpdate"
            sessionToken,       
            data: data,         // e.g., { username: "user123", password: "password123" }
            timestamp: new Date().toISOString() // Optionally add a timestamp
        }
        
        // Ensure WebSocket connection is open before sending the message
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(message))  // Send the message as a JSON string
            console.log('Sent message:', message)
        }
        else {
            console.log('WebSocket is not open. Cannot send message.')
        }
    };

    const updateProject = (ws, sessionToken, projectId, updatedProject) => {
        const message = {
            type: "updateProject",
            sessionToken,
            data: { projectId, updatedProject },
        };
    
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(message));
            console.log("Sent project update:", message);
        } else {
            console.error("WebSocket is not open. Cannot send project update.");
        }
    };

    const updateUser = (ws, sessionToken, userId, updatedUserData) => {
        const message = {
            type: "updateUser",
            sessionToken,
            data: { userId, updatedUserData },
        };
    
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(message));
            console.log("Sent user update:", message);
        } else {
            console.error("WebSocket is not open. Cannot send user update.");
        }
    };

    const handleResponse = (event) => {
        try {
            const response = JSON.parse(event.data);
            console.log(response); // This will log the entire response
        
            // Now, you can access specific parts of the response
            if (response.message === "data") {
                const { data } = response;
                const { type, data: fetchedData } = data;
        
                console.log("Received data type:", type);
                console.log("Fetched data:", fetchedData);
        
                // You can handle the data based on the type (user, projects, etc.)
                switch (type) {
                case "all":
                    setUserData(fetchedData.user);
                    setData(fetchedData.projects);
                    setRights(fetchedData.organisation.rights);
                    break;
                case "user":
                    setUserData(fetchedData);
                    break;
                case "projects":
                    setData(fetchedData);
                    break;
                case "organisation":
                    setRights(fetchedData.organisation.rights);
                    break;
                default:
                    console.log("Unknown data type:", type);
                }
            }
            setLoggedIn(true);
        } catch (error) {
            console.error("Error processing message:", error.message);
        }
    }

    // Track user-initiated changes to `data`
    useEffect(() => {
        if (isUserUpdatingData) {
            const updatedProject = data.find((project) => project.isUpdated); // Example condition
            if (updatedProject) {
                updateProject(wss, userData.sessionToken, updatedProject.id, updatedProject); // Pass WebSocket connection
            }
            setIsUserUpdatingData(false); // Reset flag
        }
    }, [data, isUserUpdatingData, userData.sessionToken, setIsUserUpdatingData, wss]);

    // Track user-initiated changes to `userData`
    useEffect(() => {
        if (isUserUpdatingUserData) {
            updateUser(wss, userData.sessionToken, userData.id, userData); // Pass WebSocket connection
            setIsUserUpdatingUserData(false); // Reset flag
        }
    }, [userData, isUserUpdatingUserData, setIsUserUpdatingUserData, wss]);

    //cleanup
    useEffect(() => {
        return () => {
            if (wss) {
                wss.close()
            }
        }
    }, [wss])

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
            });

            if (response.status === 200) {
                console.log('Login successful')
                const data = await response.json();
                
                // Create the WebSocket connection
                const socket = new WebSocket(`ws://${serverAddress(selectedServer.address)}`)
                
                // Set up WebSocket event handlers immediately
                socket.onopen = () => {
                    console.log('WebSocket connection established.')
                    setWss(socket)
                    sendMessage(socket, data.sessionToken, "login", { login: formValues.login })
                };
    
                socket.onmessage = (event) => {
                    handleResponse(event)
                };
    
                socket.onclose = (event) => {
                    console.log('WebSocket connection closed.', event)
                }
    
                socket.onerror = (error) => {
                    console.error('WebSocket error:', error)
                }
            }
            else {
                alert('Login failed')
            }
        } catch (error) {
            alert('An error occurred during login.')
            console.error(error)
        }
    };

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

export default Connection;
