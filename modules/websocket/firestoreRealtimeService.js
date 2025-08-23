// modules/websocket/firestoreRealtimeService.js - Enhanced Firestore Real-time Service
const { onSnapshot, collection, query, where, orderBy, limit } = require('firebase/firestore');

class FirestoreRealtimeDataService {
    constructor(websocketManager, firestoreDatabase) {
        this.websocketManager = websocketManager;
        this.db = firestoreDatabase;
        this.subscriptions = new Map();
        this.clients = new Set();

        console.log('🔥 Firestore Real-time Data Service initialized');
        
        // Auto-start real-time listeners for key collections
        this.initializeRealtimeListeners();
    }

    // Initialize real-time listeners for key data collections
    async initializeRealtimeListeners() {
        try {
            // Sensor data listener
            this.subscribeTo('sensor_data', {
                orderBy: { field: 'timestamp', direction: 'desc' },
                limit: 50
            }, (data) => {
                this.broadcast('sensor_data_update', data);
            });

            // Financial data listener
            this.subscribeTo('financial_data', {
                orderBy: { field: 'timestamp', direction: 'desc' },
                limit: 30
            }, (data) => {
                this.broadcast('financial_data_update', data);
            });

            // Tasks listener
            this.subscribeTo('tasks', {
                where: { field: 'is_completed', operator: '==', value: false },
                orderBy: { field: 'date', direction: 'asc' }
            }, (data) => {
                this.broadcast('tasks_update', data);
            });

            // Sites listener
            this.subscribeTo('sites', {
                where: { field: 'active', operator: '==', value: true }
            }, (data) => {
                this.broadcast('sites_update', data);
            });

            console.log('✅ All Firestore real-time listeners initialized');
        } catch (error) {
            console.error('❌ Error initializing Firestore real-time listeners:', error);
        }
    }

    // Subscribe to a Firestore collection with real-time updates
    subscribeTo(collectionName, options = {}, callback) {
        try {
            const collectionRef = collection(this.db.db, collectionName);
            let firestoreQuery = collectionRef;

            // Build query constraints
            const constraints = [];

            // Add where clauses
            if (options.where) {
                if (Array.isArray(options.where)) {
                    options.where.forEach(w => {
                        constraints.push(where(w.field, w.operator, w.value));
                    });
                } else {
                    constraints.push(where(options.where.field, options.where.operator, options.where.value));
                }
            }

            // Add orderBy
            if (options.orderBy) {
                constraints.push(orderBy(options.orderBy.field, options.orderBy.direction || 'asc'));
            }

            // Add limit
            if (options.limit) {
                constraints.push(limit(options.limit));
            }

            // Create the query if we have constraints
            if (constraints.length > 0) {
                firestoreQuery = query(collectionRef, ...constraints);
            }

            // Create the real-time subscription
            const unsubscribe = onSnapshot(firestoreQuery, 
                (snapshot) => {
                    const data = [];
                    snapshot.forEach(doc => {
                        const docData = this.db._decryptRow(doc.data());
                        data.push({
                            id: doc.id,
                            ...docData
                        });
                    });

                    console.log(`📊 Firestore real-time update for ${collectionName}: ${data.length} documents`);
                    callback(data);
                },
                (error) => {
                    console.error(`❌ Firestore subscription error for ${collectionName}:`, error);
                }
            );

            // Store the unsubscribe function
            this.subscriptions.set(collectionName, unsubscribe);
            console.log(`🔔 Subscribed to Firestore collection: ${collectionName}`);

            return unsubscribe;
        } catch (error) {
            console.error(`❌ Error subscribing to ${collectionName}:`, error);
            return null;
        }
    }

    // Subscribe to specific site data
    subscribeToSite(siteId, callback) {
        const subscriptions = [];

        // Subscribe to sensor data for this site
        const sensorUnsub = this.subscribeTo('sensor_data', {
            where: { field: 'site_id', operator: '==', value: siteId },
            orderBy: { field: 'timestamp', direction: 'desc' },
            limit: 30
        }, (data) => {
            callback('sensor_data', data);
        });

        // Subscribe to financial data for this site
        const financialUnsub = this.subscribeTo('financial_data', {
            where: { field: 'site_id', operator: '==', value: siteId },
            orderBy: { field: 'timestamp', direction: 'desc' },
            limit: 10
        }, (data) => {
            callback('financial_data', data);
        });

        // Subscribe to tasks for this site
        const tasksUnsub = this.subscribeTo('tasks', {
            where: { field: 'site_id', operator: '==', value: siteId },
            orderBy: { field: 'date', direction: 'asc' }
        }, (data) => {
            callback('tasks', data);
        });

        subscriptions.push(sensorUnsub, financialUnsub, tasksUnsub);

        // Return a function to unsubscribe from all
        return () => {
            subscriptions.forEach(unsub => {
                if (unsub) unsub();
            });
        };
    }

    // Broadcast data to all connected WebSocket clients
    broadcast(eventType, data) {
        if (!this.websocketManager) {
            console.warn('⚠️ WebSocket manager not available for broadcasting');
            return;
        }

        const message = {
            type: eventType,
            data: data,
            timestamp: new Date().toISOString()
        };

        try {
            this.websocketManager.broadcast(JSON.stringify(message));
            console.log(`📡 Broadcasted ${eventType} to ${this.clients.size} clients`);
        } catch (error) {
            console.error('❌ Error broadcasting message:', error);
        }
    }

    // Handle new sensor data (called from API endpoints)
    async onNewSensorData(sensorData) {
        try {
            console.log('🌡️ New sensor data received:', sensorData.site_id);
            
            // Broadcast to real-time clients
            this.broadcast('new_sensor_reading', {
                site_id: sensorData.site_id,
                data: sensorData,
                alert: this.checkSensorAlerts(sensorData)
            });

            // Check if we need to trigger any automated responses
            await this.processSensorAlerts(sensorData);

        } catch (error) {
            console.error('❌ Error processing new sensor data:', error);
        }
    }

    // Handle task updates
    async onTaskUpdate(taskData) {
        try {
            console.log('📋 Task updated:', taskData.id);
            
            this.broadcast('task_update', {
                task: taskData,
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error('❌ Error processing task update:', error);
        }
    }

    // Handle financial data updates
    async onFinancialUpdate(financialData) {
        try {
            console.log('💰 Financial data updated:', financialData.site_id);
            
            this.broadcast('financial_update', {
                site_id: financialData.site_id,
                data: financialData
            });

        } catch (error) {
            console.error('❌ Error processing financial update:', error);
        }
    }

    // Check sensor data for alerts
    checkSensorAlerts(sensorData) {
        const alerts = [];

        // Temperature alerts
        if (sensorData.temperature < 15 || sensorData.temperature > 35) {
            alerts.push({
                type: 'temperature',
                severity: sensorData.temperature < 10 || sensorData.temperature > 40 ? 'critical' : 'warning',
                message: `Temperature ${sensorData.temperature}°C is outside optimal range (15-35°C)`
            });
        }

        // Soil moisture alerts
        if (sensorData.soil_moisture < 40) {
            alerts.push({
                type: 'soil_moisture',
                severity: sensorData.soil_moisture < 25 ? 'critical' : 'warning',
                message: `Soil moisture ${sensorData.soil_moisture}% is low`
            });
        }

        // pH level alerts
        if (sensorData.ph_level < 6.0 || sensorData.ph_level > 7.5) {
            alerts.push({
                type: 'ph_level',
                severity: sensorData.ph_level < 5.5 || sensorData.ph_level > 8.0 ? 'critical' : 'warning',
                message: `pH level ${sensorData.ph_level} is outside optimal range (6.0-7.5)`
            });
        }

        return alerts;
    }

    // Process sensor alerts and trigger automated responses
    async processSensorAlerts(sensorData) {
        const alerts = this.checkSensorAlerts(sensorData);
        
        if (alerts.length > 0) {
            console.log(`⚠️ ${alerts.length} sensor alerts for site ${sensorData.site_id}`);
            
            // Broadcast alerts
            this.broadcast('sensor_alerts', {
                site_id: sensorData.site_id,
                alerts: alerts,
                sensor_data: sensorData
            });

            // Auto-create tasks for critical alerts
            for (const alert of alerts) {
                if (alert.severity === 'critical') {
                    await this.createAlertTask(sensorData.site_id, alert);
                }
            }
        }
    }

    // Auto-create maintenance tasks based on alerts
    async createAlertTask(siteId, alert) {
        try {
            const taskData = {
                site_id: siteId,
                title: `URGENT: ${alert.type.toUpperCase()} Alert`,
                description: alert.message,
                type: 'maintenance',
                category: 'Critical Alert',
                date: new Date().toISOString().split('T')[0],
                is_completed: false,
                priority: 'high',
                auto_generated: true
            };

            await this.db.postData('tasks', taskData);
            console.log(`📋 Auto-created critical alert task for ${siteId}`);

        } catch (error) {
            console.error('❌ Error creating alert task:', error);
        }
    }

    // Add a WebSocket client
    addClient(clientId) {
        this.clients.add(clientId);
        console.log(`👤 Client connected to Firestore real-time service: ${clientId}`);
    }

    // Remove a WebSocket client
    removeClient(clientId) {
        this.clients.delete(clientId);
        console.log(`👤 Client disconnected from Firestore real-time service: ${clientId}`);
    }

    // Get real-time statistics
    getStats() {
        return {
            active_subscriptions: this.subscriptions.size,
            connected_clients: this.clients.size,
            service_type: 'Firestore Real-time',
            uptime: process.uptime()
        };
    }

    // Clean up all subscriptions
    cleanup() {
        console.log('🧹 Cleaning up Firestore real-time subscriptions...');
        
        this.subscriptions.forEach((unsubscribe, collectionName) => {
            try {
                unsubscribe();
                console.log(`✅ Unsubscribed from ${collectionName}`);
            } catch (error) {
                console.error(`❌ Error unsubscribing from ${collectionName}:`, error);
            }
        });

        this.subscriptions.clear();
        this.clients.clear();
        console.log('✅ Firestore real-time service cleaned up');
    }

    // Method to get current data for a collection (non-realtime)
    async getCurrentData(collectionName, options = {}) {
        try {
            return await this.db.getDataByFilters(collectionName, options.filters || {}, options);
        } catch (error) {
            console.error(`❌ Error getting current data for ${collectionName}:`, error);
            return [];
        }
    }
}

module.exports = FirestoreRealtimeDataService;