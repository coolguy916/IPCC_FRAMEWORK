// src/hooks/useApi.js - Enhanced hook that works with your existing backend
import { useState, useEffect, useCallback, useRef } from 'react';

class APIClient {
    constructor(baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api') {
        this.baseURL = baseURL;
        this.wsConnection = null;
        this.wsReconnectTimer = null;
        this.listeners = new Map();
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
                throw new Error(data.error || data.message || `HTTP ${response.status}`);
            }
            
            return data;
        } catch (error) {
            console.error(`API Error [${options.method || 'GET'} ${endpoint}]:`, error);
            throw error;
        }
    }

    // Database methods matching your backend API
    async getDataByFilters(table, filters = {}, options = {}) {
        const queryParams = new URLSearchParams({
            filters: JSON.stringify(filters),
            options: JSON.stringify(options)
        });
        
        const response = await this._request(`/data/${table}?${queryParams}`);
        return response.data;
    }

    async insertData(table, data) {
        const response = await this._request(`/data/${table}`, {
            method: 'POST',
            body: { data }
        });
        return response;
    }

    async updateData(table, data, whereClause, whereParams) {
        const response = await this._request(`/data/${table}`, {
            method: 'PUT',
            body: { data, whereClause, whereParams }
        });
        return response;
    }

    async deleteData(table, whereClause, whereParams) {
        const response = await this._request(`/data/${table}`, {
            method: 'DELETE',
            body: { whereClause, whereParams }
        });
        return response;
    }

    // Serial methods (matching your existing API)
    async getSerialStatus() {
        const response = await this._request('/serial/status');
        return response.data;
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

    async sendSerialData(data) {
        return this._request('/serial/send', {
            method: 'POST',
            body: { data }
        });
    }

    // WebSocket methods
    async getWebSocketStatus() {
        const response = await this._request('/websocket/status');
        return response.data;
    }

    // Sensor data methods
    async getSensorData(filters = {}) {
        return this.getDataByFilters('sensors_data', filters, { 
            orderBy: { column: 'created_at', direction: 'DESC' },
            limit: 100 
        });
    }

    async insertSensorData(sensorData) {
        return this._request('/sensor-data', {
            method: 'POST',
            body: sensorData
        });
    }

    // Health check
    async healthCheck() {
        return this._request('/health');
    }

    // WebSocket Connection
    connectWebSocket(callbacks = {}) {
        if (this.wsConnection) {
            this.disconnectWebSocket();
        }

        const wsUrl = this.baseURL.replace('http:', 'ws:').replace('https:', 'wss:').replace('/api', '') + '/ws';
        
        try {
            this.wsConnection = new WebSocket(wsUrl);

            this.wsConnection.onopen = () => {
                console.log('WebSocket connected');
                if (this.wsReconnectTimer) {
                    clearInterval(this.wsReconnectTimer);
                    this.wsReconnectTimer = null;
                }
                if (callbacks.onOpen) callbacks.onOpen();
                this._triggerListeners('connected', true);
            };

            this.wsConnection.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (callbacks.onMessage) callbacks.onMessage(data);
                    this._triggerListeners('message', data);
                } catch (error) {
                    console.error('WebSocket message parse error:', error);
                }
            };

            this.wsConnection.onclose = () => {
                console.log('WebSocket disconnected');
                if (callbacks.onClose) callbacks.onClose();
                this._triggerListeners('connected', false);
                this._attemptReconnect(callbacks);
            };

            this.wsConnection.onerror = (error) => {
                console.error('WebSocket error:', error);
                if (callbacks.onError) callbacks.onError(error);
                this._triggerListeners('error', error);
            };

        } catch (error) {
            console.error('WebSocket connection failed:', error);
            if (callbacks.onError) callbacks.onError(error);
        }

        return this.wsConnection;
    }

    _attemptReconnect(callbacks) {
        if (this.wsReconnectTimer) return;
        
        this.wsReconnectTimer = setInterval(() => {
            console.log('Attempting WebSocket reconnection...');
            this.connectWebSocket(callbacks);
        }, 5000);
    }

    disconnectWebSocket() {
        if (this.wsReconnectTimer) {
            clearInterval(this.wsReconnectTimer);
            this.wsReconnectTimer = null;
        }
        
        if (this.wsConnection) {
            this.wsConnection.close();
            this.wsConnection = null;
        }
    }

    // Event listener methods
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(callback);
    }

    off(event, callback) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).delete(callback);
        }
    }

    _triggerListeners(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event listener for ${event}:`, error);
                }
            });
        }
    }
}

// Create singleton instance
const apiClient = new APIClient();

// Main React Hook
export const useApi = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [wsConnected, setWsConnected] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const reconnectAttempt = useRef(0);

    // Check API connection
    useEffect(() => {
        const checkConnection = async () => {
            try {
                await apiClient.healthCheck();
                setIsConnected(true);
                setError(null);
                reconnectAttempt.current = 0;
            } catch (err) {
                setIsConnected(false);
                setError(err.message);
                
                // Retry connection
                if (reconnectAttempt.current < 5) {
                    reconnectAttempt.current++;
                    setTimeout(checkConnection, Math.pow(2, reconnectAttempt.current) * 1000);
                }
            }
        };

        checkConnection();
        const interval = setInterval(checkConnection, 30000);

        return () => clearInterval(interval);
    }, []);

    // WebSocket connection management
    useEffect(() => {
        if (isConnected) {
            const wsCallbacks = {
                onOpen: () => setWsConnected(true),
                onClose: () => setWsConnected(false),
                onError: (error) => console.error('WebSocket error:', error),
                onMessage: (data) => {
                    // Handle incoming real-time data
                    console.log('WebSocket message:', data);
                }
            };

            apiClient.connectWebSocket(wsCallbacks);
        }

        return () => {
            apiClient.disconnectWebSocket();
        };
    }, [isConnected]);

    // Wrapped API methods with error handling and loading states
    const safeAPICall = useCallback(async (apiMethod, ...args) => {
        try {
            setLoading(true);
            setError(null);
            const result = await apiMethod(...args);
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        // Connection status
        isConnected,
        wsConnected,
        error,
        loading,
        
        // Database methods
        getDataByFilters: useCallback((table, filters, options) => 
            safeAPICall(apiClient.getDataByFilters.bind(apiClient), table, filters, options), 
            [safeAPICall]
        ),
        
        insertData: useCallback((table, data) => 
            safeAPICall(apiClient.insertData.bind(apiClient), table, data), 
            [safeAPICall]
        ),
        
        updateData: useCallback((table, data, whereClause, whereParams) => 
            safeAPICall(apiClient.updateData.bind(apiClient), table, data, whereClause, whereParams), 
            [safeAPICall]
        ),
        
        deleteData: useCallback((table, whereClause, whereParams) => 
            safeAPICall(apiClient.deleteData.bind(apiClient), table, whereClause, whereParams), 
            [safeAPICall]
        ),

        // Sensor-specific methods
        getSensorData: useCallback((filters) => 
            safeAPICall(apiClient.getSensorData.bind(apiClient), filters), 
            [safeAPICall]
        ),

        insertSensorData: useCallback((data) => 
            safeAPICall(apiClient.insertSensorData.bind(apiClient), data), 
            [safeAPICall]
        ),
        
        // Serial methods
        getSerialStatus: useCallback(() => 
            safeAPICall(apiClient.getSerialStatus.bind(apiClient)), 
            [safeAPICall]
        ),
        
        forceReconnect: useCallback(() => 
            safeAPICall(apiClient.forceReconnect.bind(apiClient)), 
            [safeAPICall]
        ),
        
        sendSerialData: useCallback((data) => 
            safeAPICall(apiClient.sendSerialData.bind(apiClient), data), 
            [safeAPICall]
        ),

        // WebSocket methods
        getWebSocketStatus: useCallback(() => 
            safeAPICall(apiClient.getWebSocketStatus.bind(apiClient)), 
            [safeAPICall]
        ),
        
        // Event listeners
        on: apiClient.on.bind(apiClient),
        off: apiClient.off.bind(apiClient),
        
        // Direct API access
        api: apiClient
    };
};

// Specialized hooks for different data types
export const useSensorData = (refreshInterval = 30000) => {
    const { getSensorData, insertSensorData, isConnected, loading, error } = useApi();
    const [data, setData] = useState([]);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchData = useCallback(async (filters = {}) => {
        try {
            const sensorData = await getSensorData(filters);
            setData(sensorData);
            setLastUpdated(new Date());
            return sensorData;
        } catch (err) {
            console.error('Error fetching sensor data:', err);
            throw err;
        }
    }, [getSensorData]);

    // Auto-refresh data
    useEffect(() => {
        if (isConnected) {
            fetchData();
            const interval = setInterval(fetchData, refreshInterval);
            return () => clearInterval(interval);
        }
    }, [isConnected, fetchData, refreshInterval]);

    return {
        data,
        loading,
        error,
        lastUpdated,
        refetch: fetchData,
        insertData: insertSensorData
    };
};

export const useSerialConnection = () => {
    const { getSerialStatus, forceReconnect, sendSerialData, isConnected } = useApi();
    const [status, setStatus] = useState(null);

    const fetchStatus = useCallback(async () => {
        if (isConnected) {
            try {
                const serialStatus = await getSerialStatus();
                setStatus(serialStatus);
                return serialStatus;
            } catch (error) {
                console.error('Error fetching serial status:', error);
            }
        }
    }, [getSerialStatus, isConnected]);

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 5000);
        return () => clearInterval(interval);
    }, [fetchStatus]);

    return {
        status,
        refetch: fetchStatus,
        reconnect: forceReconnect,
        sendData: sendSerialData
    };
};

export default useApi;