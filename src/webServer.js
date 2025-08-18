// web-server.js - Standalone web server using your existing modular backend
require('dotenv').config({ path: '.env.web' }); // Use web-specific config
const express = require('express');
const path = require('path');

// Import your existing modular components
const DatabaseManager = require('./modules/database/databaseManager');
const APIServer = require('./modules/api/apiServer');
const SerialManager = require('./modules/serial/serialManager');
const ServiceManager = require('./modules/services/serviceManager');
const ProcessCoordinator = require('./modules/coordination/processCoordinator');
const WebsocketManager = require('./modules/websocket/websocketManager');

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
            
            // Check service availability and acquire locks
            const serviceStatus = await this.serviceManager.initializeServices(this.managers);
            
            // Acquire locks for services (web mode doesn't need serial by default)
            const locks = {
                database: await this.coordinator.acquireServiceLock('database'),
                websocket: serviceStatus.wsEnabled ? await this.coordinator.acquireServiceLock('websocket') : false,
                api: await this.coordinator.acquireServiceLock('api')
            };

            console.log('🔒 Service locks:', locks);

            // Initialize core components
            await this._initializeDatabase();
            
            // Initialize services based on locks and env variables
            await this._initializeServices(locks);
            
            this.isInitialized = true;
            console.log('🚀 Web Application initialized successfully');
        } catch (error) {
            console.error('❌ Web Application initialization failed:', error);
            await this.cleanup();
            process.exit(1);
        }
    }

    async _initializeDatabase() {
        this.managers.database = new DatabaseManager();
        await this.managers.database.initialize();
        console.log('✅ Database ready for web mode');
    }

    async _initializeServices(locks) {
        const db = this.managers.database.getDatabase();

        // Initialize WebSocket if enabled and locked
        if (locks.websocket && process.env.USE_WS === 'true') {
            await this._initializeWebSocket(db);
        }

        // Initialize API server (always needed for web)
        if (locks.api) {
            this._initializeAPI(db);
        }
        
        console.log('✅ All web services ready');
    }

    _initializeAPI(db) {
        // Create API server without window dependency
        this.managers.api = new APIServer(
            db, 
            this.managers.serial || null, 
            this.managers.websocket || null
        );
        
        // Add static file serving for React build
        this._setupStaticFileServing();
        
        this.managers.api.start();
    }

    async _initializeWebSocket(db) {
        // WebSocket manager without window dependency
        this.managers.websocket = new WebsocketManager(db, null);
        await this.managers.websocket.initialize();
    }

    _setupStaticFileServing() {
        const app = this.managers.api.getApp();
        
        // Serve React build files
        const buildPath = path.join(__dirname, 'build');
        app.use(express.static(buildPath));
        
        // Serve any file uploads or assets
        const uploadsPath = path.join(__dirname, 'uploads');
        app.use('/uploads', express.static(uploadsPath));
        
        // SPA fallback - serve React app for non-API routes
        app.get('*', (req, res) => {
            // Don't serve index.html for API routes
            if (req.path.startsWith('/api/')) {
                return res.status(404).json({ 
                    success: false, 
                    error: 'API endpoint not found' 
                });
            }
            
            res.sendFile(path.join(buildPath, 'index.html'));
        });
        
        console.log(`📁 Serving React build from: ${buildPath}`);
    }

    async cleanup() {
        if (!this.isInitialized) return;
        
        console.log('🔄 Starting web application cleanup...');
        const cleanupPromises = [];

        // Release all service locks
        this.coordinator.releaseAllLocks();

        // Cleanup services
        if (this.managers.websocket) {
            cleanupPromises.push(this.managers.websocket.cleanup().catch(console.error));
        }
        if (this.managers.api) {
            cleanupPromises.push(this.managers.api.stop().catch(console.error));
        }
        if (this.managers.database) {
            cleanupPromises.push(this.managers.database.close().catch(console.error));
        }

        await Promise.allSettled(cleanupPromises);
        this.isInitialized = false;
        console.log('✅ Web application cleanup completed');
    }

    getManager(type) {
        return this.managers[type] || null;
    }

    getPort() {
        return this.port;
    }
}

// Create web application instance
const webApp = new WebApplication();

// Initialize and start the application
async function startWebServer() {
    try {
        await webApp.initialize();
        console.log(`🌐 Web server running at http://localhost:${webApp.getPort()}`);
        console.log('📊 React app will be served from /build directory');
        console.log('🔗 API endpoints available at /api/*');
    } catch (error) {
        console.error('Failed to start web server:', error);
        process.exit(1);
    }
}

// Graceful shutdown handlers
process.on('SIGINT', async () => {
    console.log('\n🛑 Received SIGINT, shutting down web server gracefully...');
    await webApp.cleanup();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Received SIGTERM, shutting down web server gracefully...');
    await webApp.cleanup();
    process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', async (error) => {
    console.error('Uncaught Exception:', error);
    await webApp.cleanup();
    process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    await webApp.cleanup();
    process.exit(1);
});

// Start the server
if (require.main === module) {
    startWebServer();
}

module.exports = webApp;