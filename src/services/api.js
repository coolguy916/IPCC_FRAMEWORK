// src/services/api.js - Enhanced Web API Client that mirrors your Electron preload API
import EventEmitter from 'events';

class WebAPI extends EventEmitter {
    constructor(baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api') {
        super();
        this.baseURL = baseURL;
        this.wsConnection = null;
        this.wsUrl = this.baseURL.replace('http', 'ws').replace('/api', '');
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectInterval = 3000;
        this.isConnected = false;
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
            this.emit('api-error', { endpoint, error: error.message });
            throw error;
        }
    }

    // ===============================
    // DATABASE METHODS - Mirror your preload.js API
    // ===============================
    
    async getDataByFilters(table, filters = {}, options = {}) {
        const queryParams = new URLSearchParams({
            filters: JSON.stringify(filters),
            options: JSON.stringify(options)
        });
        
        try {
            const result = await this._request(`/data/${table}?${queryParams}`);
            this.emit('database-query-success', { table, result });
            return result;
        } catch (error) {
            this.emit('database-query-error', { table, error: error.message });
            throw error;
        }
    }

    async postData(table, data) {
        try {
            const result = await this._request(`/data/${table}`, {
                method: 'POST',
                body: { data }
            });
            this.emit('database-insert-success', { table, result });
            return result;
        } catch (error) {
            this.emit('database-insert-error', { table, error: error.message });
            throw error;
        }
    }

    async insertData(table, data) {
        return this.postData(table, data); // Alias for consistency
    }

    async updateData(table, data, whereClause, whereParams) {
        try {
            const result = await this._request(`/data/${table}`, {
                method: 'PUT',
                body: { data, whereClause, whereParams }
            });
            this.emit('database-update-success', { table, result });
            return result;
        } catch (error) {
            this.emit('database-update-error', { table, error: error.message });
            throw error;
        }
    }

    async deleteData(table, whereClause, whereParams) {
        try {
            const result = await this._request(`/data/${table}`, {
                method: 'DELETE',
                body: { whereClause, whereParams }
            });
            this.emit('database-delete-success', { table, result });
            return result;
        } catch (error) {
            this.emit('database-delete-error', { table, error: error.message });
            throw error;
        }
    }

    // ===============================
    // SERIAL METHODS - If your web server supports serial
    // ===============================
    
    async getSerialStatus() {
        try {
            const result = await this._request('/serial/status');
            this.emit('serial-status-received', result.data);
            return result;
        } catch (error) {
            // Serial might not be available in web mode
            console.warn('Serial not available in web mode:', error.message);
            return { success: false, error: 'Serial not available' };
        }
    }

    async forceReconnect() {
        try {
            const result = await this._request('/serial/reconnect', { method: 'POST' });
            this.emit('serial-reconnect-initiated', result);
            return result;
        } catch (error) {
            this.emit('serial-reconnect-error', { error: error.message });
            throw error;
        }
    }

    async disconnect() {
        try {
            const result = await this._request('/serial/disconnect', { method: 'POST' });
            this.emit('serial-disconnected', result);
            return result;
        } catch (error) {
            this.emit('serial-disconnect-error', { error: error.message });
            throw error;
        }
    }

    async scanPorts() {
        try {
            const result = await this._request('/serial/scan', { method: 'POST' });
            this.emit('serial-scan-initiated', result);
            return result;
        } catch (error) {
            this.emit('serial-scan-error', { error: error.message });
            throw error;
        }
    }

    async setDynamicSwitching(enabled) {
        try {
            const result = await this._request('/serial/dynamic-switching', {
                method: 'POST',
                body: { enabled }
            });
            this.emit('serial-dynamic-switching-changed', { enabled, result });
            return result;
        } catch (error) {
            this.emit('serial-dynamic-switching-error', { error: error.message });
            throw error;
        }
    }

    async sendData(data) {
        try {
            const result = await this._request('/serial/send', {
                method: 'POST',
                body: { data }
            });
            this.emit('serial-data-sent', { data, result });
            return result;
        } catch (error) {
            this.emit('serial-send-error', { error: error.message });
            throw error;
        }
    }

    // ===============================
    // WEBSOCKET METHODS - Real-time communication
    // ===============================
    
    connectWebSocket() {
        if (this.wsConnection && this.wsConnection.readyState === WebSocket.OPEN) {
            console.log('WebSocket already connected');
            return this.wsConnection;
        }

        try {
            this.wsConnection = new WebSocket(`${this.wsUrl}:${process.env.REACT_APP_WS_PORT || 8081}`);

            this.wsConnection.onopen = () => {
                console.log('🔗 WebSocket connected');
                this.isConnected = true;
                this.reconnectAttempts = 0;
                this.emit('websocket-connected');
            };

            this.wsConnection.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    
                    // Emit specific events based on message type
                    switch (data.type) {
                        case 'sensor_data':
                            this.emit('serial-data-received', data.data);
                            break;
                        case 'database_update':
                            this.emit('database-update-received', data);
                            break;
                        case 'system_status':
                            this.emit('system-status-received', data.data);
                            break;
                        default:
                            this.emit('websocket-message', data);
                    }
                } catch (error) {
                    console.error('WebSocket message parse error:', error);
                    this.emit('websocket-error', error);
                }
            };

            this.wsConnection.onclose = () => {
                console.log('🔌 WebSocket disconnected');
                this.isConnected = false;
                this.emit('websocket-disconnected');
                this._attemptReconnect();
            };

            this.wsConnection.onerror = (error) => {
                console.error('❌ WebSocket error:', error);
                this.emit('websocket-error', error);
            };

            return this.wsConnection;
        } catch (error) {
            console.error('Failed to create WebSocket connection:', error);
            this.emit('websocket-error', error);
            return null;
        }
    }

    _attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`🔄 Attempting WebSocket reconnection (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
            
            setTimeout(() => {
                this.connectWebSocket();
            }, this.reconnectInterval);
        } else {
            console.log('❌ Max WebSocket reconnection attempts reached');
            this.emit('websocket-max-reconnect-attempts');
        }
    }

    disconnectWebSocket() {
        if (this.wsConnection) {
            this.wsConnection.close();
            this.wsConnection = null;
            this.isConnected = false;
        }
    }

    sendWebSocketMessage(message) {
        if (this.wsConnection && this.wsConnection.readyState === WebSocket.OPEN) {
            this.wsConnection.send(JSON.stringify(message));
        } else {
            console.warn('WebSocket not connected, cannot send message');
            this.emit('websocket-send-error', { error: 'Not connected' });
        }
    }

    // ===============================
    // CONVENIENCE METHODS - Mirror Electron API behavior
    // ===============================
    
    // Method to simulate Electron's preload.js receive method
    receive(channel, callback) {
        this.on(channel, callback);
    }

    // Method to simulate Electron's preload.js send method
    send(channel, data) {
        this.sendWebSocketMessage({ channel, data });
    }

    // Health check
    async healthCheck() {
        return this._request('/health');
    }

    // Get WebSocket status
    async getWebSocketStatus() {
        try {
            const result = await this._request('/websocket/status');
            return result;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ===============================
    // CONNECTION STATUS METHODS
    // ===============================
    
    getConnectionStatus() {
        return {
            api: this.isConnected,
            websocket: this.wsConnection ? this.wsConnection.readyState === WebSocket.OPEN : false,
            reconnectAttempts: this.reconnectAttempts
        };
    }

    async checkAPIConnection() {
        try {
            await this.healthCheck();
            return true;
        } catch (error) {
            return false;
        }
    }
}

// Create singleton instance
const webAPI = new WebAPI();

// Auto-connect WebSocket when API is created
if (process.env.REACT_APP_AUTO_CONNECT_WS !== 'false') {
    setTimeout(() => {
        webAPI.connectWebSocket();
    }, 1000); // Give React time to mount
}

export default webAPI;

// Named exports for specific functionality
export { WebAPI };

// React Hook for easier usage in components
export const useWebAPI = () => {
    return webAPI;
};