import React, { useState, useEffect } from 'react'

import LogIn from './pages/dialogs/LogIn'

const Connection = ({ setState, userData, setUserData, data, setData, setLoggedIn, setRights }) => {

    const [servers, setServers] = useState([])
    const [message, setMessage] = useState('')
    const [ws, setWs] = useState(null)
    const [loading, setLoading] = useState(true)

    //get list of organisations whos servers are on
    useEffect(() => {
        const fetchServers = async () => {
            try {
                const response = await fetch('http://localhost:3000/servers/list');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                setServers(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch servers:", error);
                setLoading(false);
            }
        };

        fetchServers();
    }, []);

    const serverAddress = (address) => {
        // Get the address without the scheme (http:// or https://)
        let serverAddress = address.split('://')[1];
        
        // Remove trailing slash if present
        if (serverAddress.endsWith('/')) {
            serverAddress = serverAddress.slice(0, -1);
        }
        
        // Extract the domain and port
        const [domain, port] = serverAddress.split(':');
        
        // Increment the port by 1
        const newPort = parseInt(port, 10) + 1;
        
        // Reassemble the address with the new port
        return `${domain}:${newPort}`;
    }

    const loginToServer = async (formValues) => {
        const selectedServer = servers.find((server) => server.id === formValues.server);
    
        if (!selectedServer) {
            alert("Invalid server selected.");
            return;
        }
    
        try {
            const response = await fetch(`${selectedServer.address}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ login: formValues.login, password: formValues.password })
            });

            if (response.status === 200) {
                alert('Login successful');
                
                // Create the WebSocket connection
                const socket = new WebSocket(`ws://${serverAddress(selectedServer.address)}`);
                
                // Set up WebSocket event handlers immediately
                socket.onopen = () => {
                    console.log('WebSocket connection established.');
                };
    
                socket.onmessage = (event) => {
                    setMessage(event.data);
                };
    
                socket.onclose = (event) => {
                    console.log('WebSocket connection closed.', event);
                };
    
                socket.onerror = (error) => {
                    console.error('WebSocket error:', error);
                };
    
                // Now set the state with the WebSocket object
                setWs(socket);  // Update the state with the WebSocket object
            }
            else {
                alert('Login failed');
            }
        } catch (error) {
            alert('An error occurred during login.');
            console.error(error);
        }
    };

    return (
        <div>
            {loading ? (
                <p>Loading servers...</p> // Display loading message while fetching servers
            ) : (
                <LogIn
                    setState={setState}
                    servers={servers}
                    loginToServer={loginToServer}
                />
            )}
            {message && <p>WebSocket Message: {message}</p>}
        </div>
    );
}

export default Connection;
