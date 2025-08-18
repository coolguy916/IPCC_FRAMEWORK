// utils/webAPI.js - API client that mimics your Electron preload API
class WebAPI {
    constructor(baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api') {
        this.baseURL = baseURL;
        this.wsConnection = null;
    }

    async _request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        if (config.body && typeof config.body === 'object') {
            config.body = JSON.stringify(config.body);
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || `HTTP ${response.status}`);
            }
            
            return data;
        } catch (error) {
            console.error(`API Error [${options.method || 'GET'} ${endpoint}]:`, error);
            throw error;
        }
    }

    // Database methods - mirroring your preload.js API
    async getDataByFilters(table, filters = {}, options = {}) {
        const queryParams = new URLSearchParams({
            filters: JSON.stringify(filters),
            options: JSON.stringify(options)
        });
        
        return this._request(`/data/${table}?${queryParams}`);
    }

    async insertData(table, data) {
        return this._request(`/data/${table}`, {
            method: 'POST',
            body: { data }
        });
    }

    async updateData(table, data, whereClause, whereParams) {
        return this._request(`/data/${table}`, {
            method: 'PUT',
            body: { data, whereClause, whereParams }
        });
    }

    async deleteData(table, whereClause, whereParams) {
        return this._request(`/data/${table}`, {
            method: 'DELETE',
            body: { whereClause, whereParams }
        });
    }

    // Serial methods (if available)
    async getSerialStatus() {
        return this._request('/serial/status');
    }

    async forceReconnect() {
        return this._request('/serial/reconnect', { method: 'POST' });
    }

    async disconnect() {
        return this._request('/serial/disconnect', { method: 'POST' });
    }

    async scanPorts() {
        return this._request('/serial/scan', { method: 'POST' });
    }

    async setDynamicSwitching(enabled) {
        return this._request('/serial/dynamic-switching', {
            method: 'POST',
            body: { enabled }
        });
    }

    async sendData(data) {
        return this._request('/serial/send', {
            method: 'POST',
            body: { data }
        });
    }

    // WebSocket methods for real-time data
    connectWebSocket(callbacks = {}) {
        const wsUrl = this.baseURL.replace('http', 'ws').replace('/api', '');
        this.wsConnection = new WebSocket(wsUrl);

        this.wsConnection.onopen = () => {
            console.log('WebSocket connected');
            if (callbacks.onOpen) callbacks.onOpen();
        };

        this.wsConnection.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (callbacks.onMessage) callbacks.onMessage(data);
            } catch (error) {
                console.error('WebSocket message parse error:', error);
            }
        };

        this.wsConnection.onclose = () => {
            console.log('WebSocket disconnected');
            if (callbacks.onClose) callbacks.onClose();
        };

        this.wsConnection.onerror = (error) => {
            console.error('WebSocket error:', error);
            if (callbacks.onError) callbacks.onError(error);
        };

        return this.wsConnection;
    }

    disconnectWebSocket() {
        if (this.wsConnection) {
            this.wsConnection.close();
            this.wsConnection = null;
        }
    }

    // Health check
    async healthCheck() {
        return this._request('/health');
    }
}

// Create singleton instance
const webAPI = new WebAPI();
export default webAPI;

// React Hook for easier usage
import { useState, useEffect, useCallback } from 'react';

export const useWebAPI = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);

    // Check connection on mount
    useEffect(() => {
        const checkConnection = async () => {
            try {
                await webAPI.healthCheck();
                setIsConnected(true);
                setError(null);
            } catch (err) {
                setIsConnected(false);
                setError(err.message);
            }
        };

        checkConnection();
        const interval = setInterval(checkConnection, 30000); // Check every 30s

        return () => clearInterval(interval);
    }, []);

    // Wrapped API methods with error handling
    const safeAPICall = useCallback(async (apiMethod, ...args) => {
        try {
            setError(null);
            const result = await apiMethod(...args);
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    return {
        // Connection status
        isConnected,
        error,
        
        // Database methods
        getDataByFilters: useCallback((table, filters, options) => 
            safeAPICall(webAPI.getDataByFilters.bind(webAPI), table, filters, options), [safeAPICall]),
        
        insertData: useCallback((table, data) => 
            safeAPICall(webAPI.insertData.bind(webAPI), table, data), [safeAPICall]),
        
        updateData: useCallback((table, data, whereClause, whereParams) => 
            safeAPICall(webAPI.updateData.bind(webAPI), table, data, whereClause, whereParams), [safeAPICall]),
        
        deleteData: useCallback((table, whereClause, whereParams) => 
            safeAPICall(webAPI.deleteData.bind(webAPI), table, whereClause, whereParams), [safeAPICall]),
        
        // Serial methods
        getSerialStatus: useCallback(() => 
            safeAPICall(webAPI.getSerialStatus.bind(webAPI)), [safeAPICall]),
        
        forceReconnect: useCallback(() => 
            safeAPICall(webAPI.forceReconnect.bind(webAPI)), [safeAPICall]),
        
        sendData: useCallback((data) => 
            safeAPICall(webAPI.sendData.bind(webAPI), data), [safeAPICall]),
        
        // WebSocket methods
        connectWebSocket: webAPI.connectWebSocket.bind(webAPI),
        disconnectWebSocket: webAPI.disconnectWebSocket.bind(webAPI),
        
        // Direct API access
        api: webAPI
    };
};

// For non-React usage, also export the class
export { WebAPI };