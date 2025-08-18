// src/hooks/useElectronAPI.js - React Hook that provides the same interface as your Electron preload API
import { useState, useEffect, useCallback, useRef } from 'react';
import webAPI from '../services/api';

export const useElectronAPI = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState({
        api: false,
        websocket: false,
        serial: false
    });
    const [error, setError] = useState(null);
    const listenersRef = useRef(new Map());

    // Check connections on mount
    useEffect(() => {
        const checkConnections = async () => {
            try {
                const apiConnected = await webAPI.checkAPIConnection();
                const wsConnected = webAPI.wsConnection?.readyState === WebSocket.OPEN;
                
                setConnectionStatus({
                    api: apiConnected,
                    websocket: wsConnected,
                    serial: false // Serial typically not available in web mode
                });
                
                setIsConnected(apiConnected);
                setError(null);
            } catch (err) {
                setIsConnected(false);
                setError(err.message);
            }
        };

        checkConnections();
        
        // Set up WebSocket if not already connected
        if (!webAPI.wsConnection) {
            webAPI.connectWebSocket();
        }

        // Listen for WebSocket events
        const handleWSConnected = () => {
            setConnectionStatus(prev => ({ ...prev, websocket: true }));
        };
        
        const handleWSDisconnected = () => {
            setConnectionStatus(prev => ({ ...prev, websocket: false }));
        };

        webAPI.on('websocket-connected', handleWSConnected);
        webAPI.on('websocket-disconnected', handleWSDisconnected);

        const interval = setInterval(checkConnections, 30000); // Check every 30s

        return () => {
            clearInterval(interval);
            webAPI.off('websocket-connected', handleWSConnected);
            webAPI.off('websocket-disconnected', handleWSDisconnected);
        };
    }, []);

    // ===============================
    // MIRROR ELECTRON PRELOAD API
    // ===============================

    // Database methods - exact same interface as your preload.js
    const getDataByFilters = useCallback(async (table, filters = {}, options = {}) => {
        try {
            setError(null);
            const result = await webAPI.getDataByFilters(table, filters, options);
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    const insertData = useCallback(async (table, data) => {
        try {
            setError(null);
            const result = await webAPI.insertData(table, data);
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    const updateData = useCallback(async (table, data, whereClause, whereParams) => {
        try {
            setError(null);
            const result = await webAPI.updateData(table, data, whereClause, whereParams);
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    const deleteData = useCallback(async (table, whereClause, whereParams) => {
        try {
            setError(null);
            const result = await webAPI.deleteData(table, whereClause, whereParams);
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    // Serial methods - same interface as Electron
    const getSerialStatus = useCallback(async () => {
        try {
            const result = await webAPI.getSerialStatus();
            return result;
        } catch (err) {
            // Serial might not be available in web mode
            return { success: false, error: 'Serial not available in web mode' };
        }
    }, []);

    const forceReconnect = useCallback(async () => {
        try {
            const result = await webAPI.forceReconnect();
            return result;
        } catch (err) {
            console.warn('Force reconnect not available in web mode');
            return { success: false, error: 'Not available in web mode' };
        }
    }, []);

    const sendData = useCallback(async (data) => {
        try {
            const result = await webAPI.sendData(data);
            return result;
        } catch (err) {
            console.warn('Send data not available in web mode');
            return { success: false, error: 'Not available in web mode' };
        }
    }, []);

    // Real-time data listening - same interface as Electron's receive method
    const receive = useCallback((channel, callback) => {
        // Store the callback reference
        const wrappedCallback = (data) => {
            callback(data);
        };
        
        listenersRef.current.set(channel, wrappedCallback);
        webAPI.on(channel, wrappedCallback);

        // Return cleanup function
        return () => {
            webAPI.off(channel, wrappedCallback);
            listenersRef.current.delete(channel);
        };
    }, []);

    // Remove listener method
    const removeListener = useCallback((channel) => {
        const callback = listenersRef.current.get(channel);
        if (callback) {
            webAPI.off(channel, callback);
            listenersRef.current.delete(channel);
        }
    }, []);

    // Send method for WebSocket
    const send = useCallback((channel, data) => {
        webAPI.sendWebSocketMessage({ channel, data });
    }, []);

    // ===============================
    // ADDITIONAL WEB-SPECIFIC METHODS
    // ===============================

    const connectWebSocket = useCallback(() => {
        return webAPI.connectWebSocket();
    }, []);

    const disconnectWebSocket = useCallback(() => {
        webAPI.disconnectWebSocket();
        setConnectionStatus(prev => ({ ...prev, websocket: false }));
    }, []);

    const broadcastData = useCallback((type, data) => {
        if (webAPI.wsConnection?.readyState === WebSocket.OPEN) {
            webAPI.sendWebSocketMessage({ type, data, timestamp: new Date().toISOString() });
        }
    }, []);

    // Health check method
    const healthCheck = useCallback(async () => {
        try {
            const result = await webAPI.healthCheck();
            setIsConnected(true);
            setError(null);
            return result;
        } catch (err) {
            setIsConnected(false);
            setError(err.message);
            throw err;
        }
    }, []);

    // Cleanup effect
    useEffect(() => {
        return () => {
            // Clean up all listeners when component unmounts
            listenersRef.current.forEach((callback, channel) => {
                webAPI.off(channel, callback);
            });
            listenersRef.current.clear();
        };
    }, []);

    // Return the same interface as your Electron preload API
    return {
        // Connection status
        isConnected,
        connectionStatus,
        error,

        // Database methods - same as preload.js
        getDataByFilters,
        insertData,
        postData: insertData, // Alias
        updateData,
        deleteData,

        // Serial methods - same as preload.js  
        getSerialStatus,
        forceReconnect,
        sendData,
        disconnect,
        scanPorts: useCallback(async () => {
            try {
                return await webAPI.scanPorts();
            } catch (err) {
                return { success: false, error: 'Not available in web mode' };
            }
        }, []),
        setDynamicSwitching,

        // Real-time communication - same as preload.js
        receive,
        send,
        removeListener,

        // Web-specific methods
        connectWebSocket,
        disconnectWebSocket,
        broadcastData,
        healthCheck,
        
        // Direct API access for advanced usage
        api: webAPI,
        
        // Method to check if running in web mode
        isWebMode: true,
        isElectronMode: false
    };
};

// Alternative hook for specific data operations
export const useDatabase = (table) => {
    const api = useElectronAPI();
    
    const getData = useCallback((filters = {}, options = {}) => {
        return api.getDataByFilters(table, filters, options);
    }, [api, table]);

    const insertRow = useCallback((data) => {
        return api.insertData(table, data);
    }, [api, table]);

    const updateRow = useCallback((data, whereClause, whereParams) => {
        return api.updateData(table, data, whereClause, whereParams);
    }, [api, table]);

    const deleteRow = useCallback((whereClause, whereParams) => {
        return api.deleteData(table, whereClause, whereParams);
    }, [api, table]);

    return {
        getData,
        insertRow,
        updateRow,
        deleteRow,
        isConnected: api.isConnected,
        error: api.error
    };
};

// Hook for real-time data listening
export const useRealTimeData = (channels = []) => {
    const [data, setData] = useState({});
    const api = useElectronAPI();

    useEffect(() => {
        const cleanupFunctions = [];

        channels.forEach(channel => {
            const cleanup = api.receive(channel, (receivedData) => {
                setData(prev => ({
                    ...prev,
                    [channel]: receivedData
                }));
            });
            cleanupFunctions.push(cleanup);
        });

        return () => {
            cleanupFunctions.forEach(cleanup => cleanup());
        };
    }, [api, channels]);

    return {
        data,
        isConnected: api.connectionStatus.websocket,
        send: api.send,
        broadcast: api.broadcastData
    };
};