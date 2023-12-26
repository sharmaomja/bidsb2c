import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [sessionId, setSessionId] = useState(null); // Add state for session ID
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        const savedSessionId = localStorage.getItem('sessionId');
        const savedToken = localStorage.getItem('token');
        const savedExpiryTime = localStorage.getItem('sessionExpiry');
    
        if (savedUser && savedSessionId && savedExpiryTime) {
            const currentTime = new Date().getTime();
            const expiryTime = new Date(savedExpiryTime).getTime();
            if (currentTime > expiryTime) {
                // Session has expired
                logout();
            } else {
                setUser(JSON.parse(savedUser));
                setSessionId(savedSessionId);
                setIsAuthenticated(true); // Set isAuthenticated to true if session is valid
                if (savedToken) {
                    // Set the Axios default authorization header
                    axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
                }
            }
        } else {
            setIsAuthenticated(false); // Set isAuthenticated to false if no valid session
        }
    }, []);

    const login = (userData, sessionId, token, expiryTime) => {
        setUser(userData);
        setSessionId(sessionId); // Set session ID
        setIsAuthenticated(true); // Set isAuthenticated to true when user logs in
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('sessionId', sessionId); // Store session ID in localStorage
        localStorage.setItem('token', token); // Store token in localStorage
        localStorage.setItem('sessionExpiry', expiryTime); 
        // Set the Axios default authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    };
    
    const logout = () => {
        setUser(null);
        setSessionId(null); // Clear session ID
        setIsAuthenticated(false); // Set isAuthenticated to false when user logs out
        localStorage.removeItem('user');
        localStorage.removeItem('sessionId'); // Remove session ID from localStorage
        localStorage.removeItem('token'); // Remove token from localStorage
        // Remove the Axios default authorization header
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, sessionId, login, logout,isAuthenticated, setUser, setIsAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
