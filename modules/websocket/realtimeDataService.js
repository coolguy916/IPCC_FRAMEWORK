// modules/websocket/realtimeDataService.js - Real-time data streaming service
class RealtimeDataService {
    constructor(websocketManager, database) {
        this.ws = websocketManager;
        this.db = database;
        this.clients = new Set();
        this.dataIntervals = new Map();
        this.lastDataCache = new Map();
        
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        if (this.ws) {
            // Register event handlers using the WebSocket manager's interface
            this.ws.registerEventHandler('client-connected', (data) => {
                this.handleClientConnection(data);
            });
            
            this.ws.registerEventHandler('client-disconnected', (data) => {
                this.handleClientDisconnection(data);
            });
            
            this.ws.registerEventHandler('data-received', (data) => {
                this.handleDataReceived(data);
            });
        }
    }

    handleClientConnection(clientData) {
        console.log('📡 Real-time client connected:', clientData.clientId);
        
        // Store client ID for reference
        this.clients.add(clientData.clientId);
        
        // Send current data immediately to new client
        this.sendCurrentDataToClient(clientData.clientId);
    }

    handleClientDisconnection(clientData) {
        console.log('📡 Real-time client disconnected:', clientData.clientId);
        this.clients.delete(clientData.clientId);
        
        // Clean up client-specific intervals
        this.dataIntervals.forEach((interval, key) => {
            if (key.includes(clientData.clientId)) {
                clearInterval(interval);
                this.dataIntervals.delete(key);
            }
        });
    }

    handleDataReceived(data) {
        try {
            // Parse the received data and handle real-time subscriptions
            const message = typeof data.data === 'string' ? JSON.parse(data.data) : data.data;
            
            if (message && message.type) {
                this.handleClientMessage(data.clientId, message);
            }
        } catch (error) {
            console.error('Error handling received data:', error);
        }
    }

    handleClientMessage(clientId, message) {
        switch (message.type) {
            case 'subscribe':
                this.handleSubscription(clientId, message);
                break;
            case 'unsubscribe':
                this.handleUnsubscription(clientId, message);
                break;
            case 'request_data':
                this.handleDataRequest(clientId, message);
                break;
            default:
                console.warn('Unknown message type:', message.type);
        }
    }

    handleSubscription(clientId, message) {
        const { dataType, siteId, interval = 30000 } = message.payload;

        console.log(`📡 Client ${clientId} subscribed to ${dataType} for site ${siteId}`);

        // Create subscription key
        const subscriptionKey = `${clientId}-${dataType}-${siteId}`;

        // Clear existing subscription if any
        if (this.dataIntervals.has(subscriptionKey)) {
            clearInterval(this.dataIntervals.get(subscriptionKey));
        }

        // Set up real-time data streaming
        const intervalId = setInterval(async () => {
            await this.streamDataToClient(clientId, dataType, siteId);
        }, interval);

        this.dataIntervals.set(subscriptionKey, intervalId);

        // Send immediate data
        this.streamDataToClient(clientId, dataType, siteId);
    }

    handleUnsubscription(clientId, message) {
        const { dataType, siteId } = message.payload;
        const subscriptionKey = `${clientId}-${dataType}-${siteId}`;

        if (this.dataIntervals.has(subscriptionKey)) {
            clearInterval(this.dataIntervals.get(subscriptionKey));
            this.dataIntervals.delete(subscriptionKey);
            console.log(`📡 Client ${clientId} unsubscribed from ${dataType}`);
        }
    }

    async handleDataRequest(clientId, message) {
        const { dataType, siteId, filters } = message.payload;

        try {
            const data = await this.fetchData(dataType, siteId, filters);

            this.ws.sendToClient(clientId, {
                type: 'data_response',
                dataType,
                siteId,
                data,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            this.ws.sendToClient(clientId, {
                type: 'error',
                message: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }

    async streamDataToClient(clientId, dataType, siteId) {
        try {
            const data = await this.fetchData(dataType, siteId);
            const cacheKey = `${dataType}-${siteId}`;

            // Only send if data has changed
            const lastData = this.lastDataCache.get(cacheKey);
            const dataString = JSON.stringify(data);

            if (lastData !== dataString) {
                this.lastDataCache.set(cacheKey, dataString);

                this.ws.sendToClient(clientId, {
                    type: 'realtime_data',
                    dataType,
                    siteId,
                    data,
                    timestamp: new Date().toISOString()
                });
            }
        } catch (error) {
            console.error(`Error streaming ${dataType}:`, error);

            this.ws.sendToClient(clientId, {
                type: 'error',
                dataType,
                message: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }

    async fetchData(dataType, siteId, filters = {}) {
        switch (dataType) {
            case 'sensor_data':
                return await this.fetchSensorData(siteId, filters);
            case 'financial_data':
                return await this.fetchFinancialData(siteId, filters);
            case 'tasks':
                return await this.fetchTasks(siteId, filters);
            case 'system_metrics':
                return await this.fetchSystemMetrics();
            case 'team_members':
                return await this.fetchTeamMembers();
            case 'program_goals':
                return await this.fetchProgramGoals();
            case 'dosm_stats':
                return await this.fetchDOSMStats();
            default:
                throw new Error(`Unknown data type: ${dataType}`);
        }
    }

    async fetchSensorData(siteId, filters = {}) {
        const queryFilters = { site_id: siteId, ...filters };
        const options = {
            orderBy: { column: 'timestamp', direction: 'DESC' },
            limit: 1
        };

        const result = await this.db.getDataByFilters('sensor_data', queryFilters, options);
        return result.length > 0 ? result[0] : null;
    }

    async fetchFinancialData(siteId, filters = {}) {
        const queryFilters = { site_id: siteId, ...filters };
        const options = {
            orderBy: { column: 'timestamp', direction: 'DESC' },
            limit: 30
        };

        return await this.db.getDataByFilters('financial_data', queryFilters, options);
    }

    async fetchTasks(siteId, filters = {}) {
        const today = new Date().toISOString().split('T')[0];
        const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

        const queryFilters = {
            site_id: siteId,
            date: { operator: 'between', value: [today, nextWeek] },
            is_completed: false,
            ...filters
        };

        const options = {
            orderBy: { column: 'date', direction: 'ASC' },
            limit: 10
        };

        return await this.db.getDataByFilters('tasks', queryFilters, options);
    }

    async fetchSystemMetrics() {
        const options = {
            orderBy: { column: 'created_at', direction: 'DESC' },
            limit: 1
        };

        const result = await this.db.getDataByFilters('system_metrics', {}, options);

        if (result.length > 0) {
            const metrics = result[0];
            return {
                cache_performance: JSON.parse(metrics.cache_performance || '{}'),
                performance_metrics: JSON.parse(metrics.performance_metrics || '{}'),
                daily_visits: JSON.parse(metrics.daily_visits || '{}'),
                timestamp: metrics.created_at
            };
        }

        return {};
    }

    async fetchTeamMembers() {
        return await this.db.getDataByFilters('team_members', { active: true });
    }

    async fetchProgramGoals() {
        return await this.db.getDataByFilters('program_goals', {});
    }

    async fetchDOSMStats() {
        const result = await this.db.getDataByFilters('dosm_stats', { id: 'latest' });
        return result.length > 0 ? result[0] : {};
    }

    async sendCurrentDataToClient(clientId) {
        // Send initial data for dashboard
        try {
            const currentData = {
                sensor_data: await this.fetchSensorData('site_a_3_acres'),
                system_metrics: await this.fetchSystemMetrics(),
                upcoming_tasks: await this.fetchTasks('site_a_3_acres'),
                program_goals: await this.fetchProgramGoals()
            };

            this.ws.sendToClient(clientId, {
                type: 'initial_data',
                data: currentData,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error sending current data to client:', error);
        }
    }

    // Broadcast to all connected clients using the WebSocket manager
    broadcast(message) {
        const messageData = {
            ...message,
            timestamp: new Date().toISOString()
        };

        // Use the WebSocket manager's broadcast method
        if (this.ws && this.ws.broadcastToAll) {
            const sent = this.ws.broadcastToAll(messageData, 'application');
            console.log(`📡 Broadcasted to ${sent} clients`);
        } else {
            // Fallback: send to each client individually
            this.clients.forEach(clientId => {
                try {
                    this.ws.sendToClient(clientId, messageData);
                } catch (error) {
                    console.error('Error broadcasting to client:', clientId, error);
                    this.clients.delete(clientId);
                }
            });
        }
    }

    // Method to be called when new sensor data arrives
    async onNewSensorData(sensorData) {
        console.log('📊 Broadcasting new sensor data to clients');

        this.broadcast({
            type: 'sensor_data_update',
            data: sensorData
        });
    }

    // Method to be called when task status changes
    async onTaskUpdate(taskData) {
        console.log('📋 Broadcasting task update to clients');

        this.broadcast({
            type: 'task_update',
            data: taskData
        });
    }

    // Method to be called when system metrics update
    async onSystemMetricsUpdate(metrics) {
        console.log('⚙️ Broadcasting system metrics update to clients');

        this.broadcast({
            type: 'system_metrics_update',
            data: metrics
        });
    }

    // Cleanup method
    destroy() {
        // Clear all intervals
        this.dataIntervals.forEach(interval => clearInterval(interval));
        this.dataIntervals.clear();

        // Clear clients
        this.clients.clear();

        // Clear cache
        this.lastDataCache.clear();

        console.log('🧹 Real-time data service cleaned up');
    }
}

module.exports = RealtimeDataService;