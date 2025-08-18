// web-server.js - Auto-generated standalone web server
require('dotenv').config({ path: '.env.web' });

// Import your existing modular components
const DatabaseManager = require('./modules/database/databaseManager');
const APIServer = require('./modules/api/apiServer');
const ServiceManager = require('./modules/services/serviceManager');
const ProcessCoordinator = require('./modules/coordination/processCoordinator');
const WebsocketManager = require('./modules/websocket/websocketManager');
const express = require('express');
const path = require('path');

class WebApplication {
    constructor() {
        this.managers = {};
        this.serviceManager = new ServiceManager();
        this.coordinator = new ProcessCoordinator();
        this.isInitialized = false;
        this.port = process.env.API_PORT || 5001;
    }

    async initialize() {
        if (this.isInitialized) return;
        
        try {
            console.log('🌐 Initializing Web Application...');
            
            const serviceStatus = await this.serviceManager.initializeServices(this.managers);
            
            const locks = {
                database: await this.coordinator.acquireServiceLock('database'),
                websocket: serviceStatus.wsEnabled ? await this.coordinator.acquireServiceLock('websocket') : false,
                api: await this.coordinator.acquireServiceLock('api')
            };

            await this._initializeDatabase();
            await this._initializeServices(locks);
            
            this.isInitialized = true;
            console.log('🚀 Web Application ready!');
        } catch (error) {
            console.error('❌ Initialization failed:', error);
            await this.cleanup();
            process.exit(1);
        }
    }

    async _initializeDatabase() {
        this.managers.database = new DatabaseManager();
        await this.managers.database.initialize();
        console.log('✅ Database ready');
    }

    async _initializeServices(locks) {
        const db = this.managers.database.getDatabase();

        if (locks.websocket && process.env.USE_WS === 'true') {
            this.managers.websocket = new WebsocketManager(db, null);
            await this.managers.websocket.initialize();
        }

        if (locks.api) {
            this.managers.api = new APIServer(db, null, this.managers.websocket);
            this._setupStaticFileServing();
            this.managers.api.start();
        }
    }

    _setupStaticFileServing() {
        const app = this.managers.api.getApp();
        const buildPath = path.join(__dirname, 'build');
        
        app.use(express.static(buildPath));
        app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
        
        app.get('*', (req, res) => {
            if (req.path.startsWith('/api/')) {
                return res.status(404).json({ success: false, error: 'API endpoint not found' });
            }
            res.sendFile(path.join(buildPath, 'index.html'));
        });
    }

    async cleanup() {
        if (!this.isInitialized) return;
        console.log('🔄 Cleaning up...');
        
        this.coordinator.releaseAllLocks();
        
        const cleanupPromises = [];
        if (this.managers.websocket) cleanupPromises.push(this.managers.websocket.cleanup());
        if (this.managers.api) cleanupPromises.push(this.managers.api.stop());
        if (this.managers.database) cleanupPromises.push(this.managers.database.close());

        await Promise.allSettled(cleanupPromises);
        console.log('✅ Cleanup complete');
    }
}

const webApp = new WebApplication();

// Graceful shutdown
process.on('SIGINT', async () => {
    await webApp.cleanup();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await webApp.cleanup();
    process.exit(0);
});

// Start the server
if (require.main === module) {
    webApp.initialize().catch(console.error);
}

module.exports = webApp;