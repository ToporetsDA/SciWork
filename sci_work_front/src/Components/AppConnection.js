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
                console.log("fetched servers: ", data)
                setServers(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch servers:", error);
                setLoading(false);
            }
        };

        fetchServers();
    }, []);

    const loginToServer = async (formValues) => {
        const selectedServer = servers.find((server) => server.id === formValues.server);
        console.log(selectedServer)
    
        if (!selectedServer) {
            alert("Invalid server selected.");
            return;
        }
    
        try {
            const response = await fetch(`${selectedServer.address}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ login: formValues.login, password: formValues.password })
            });
    
            const data = await response.json();
    
            if (data.success) {
                alert('Login successful');
                const socket = new WebSocket(`ws://${selectedServer.address}`);
                setWs(socket);
    
                socket.onmessage = (event) => {
                    setMessage(event.data);
                };
            } else {
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
