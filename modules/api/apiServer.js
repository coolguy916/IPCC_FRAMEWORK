// modules/api/apiServer.js - Enhanced version with web support
const express = require('express');
const enableWs = require('express-ws');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Controllers
const dbController = require('../../App/Http/Controllers/databaseController');
const authController = require('../../App/Http/Controllers/authController');
const mauiController = require('../../App/Http/Controllers/mauiController');

class APIServer {
    constructor(database, serialManager = null, websocketManager = null) {
        this.app = express();
        // Enable WebSocket support
        enableWs(this.app);
        
        this.database = database;
        this.serialManager = serialManager;
        this.websocketManager = websocketManager;
        this.server = null;
        this.port = process.env.API_PORT || 5001;
        this.mode = process.env.APP_MODE || 'electron';
        
        this.setupMiddleware();
        this.setupRoutes();
        this.initializeControllers();
        
        // Add web-specific routes if in web mode
        if (this.mode === 'web' || this.mode === 'both') {
            this.setupWebRoutes();
        }
    }

    setupMiddleware() {
        // CORS configuration for web mode
        const corsOptions = {
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization']
        };
        
        this.app.use(cors(corsOptions));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        
        // Add health check endpoint
        this.app.get('/api/health', (req, res) => {
            res.json({ status: 'ok', message: 'Service is healthy' });
        });

        // Serve static files if configured
        if (process.env.SERVE_STATIC === 'true') {
            const buildPath = path.join(__dirname, '../../build');
            this.app.use(express.static(buildPath));
            console.log(`📁 Serving static files from: ${buildPath}`);
        }

        // Request logging in development
        if (process.env.NODE_ENV === 'development') {
            this.app.use((req, res, next) => {
                console.log(`${req.method} ${req.path}`, req.body ? Object.keys(req.body) : '');
                next();
            });
        }
    }

    initializeControllers() {
        dbController.initializeController(this.database);
        authController.initializeController(this.database);
    }

    setupRoutes() {
        // Your existing routes
        this.app.post('/api/auth/register', authController.register);
        this.app.post('/api/auth/login', authController.login);
        this.app.post('/api/sensor-data', dbController.insertSensorData);
        this.app.post('/api/maui-data', mauiController.genericDataHandler);

        // Enhanced health check with system info
        this.app.get('/api/health', (req, res) => {
            res.json({ 
                success: true, 
                message: 'API server is running',
                timestamp: new Date().toISOString(),
                mode: this.mode,
                port: this.port,
                services: {
                    database: !!this.database,
                    serial: !!this.serialManager,
                    websocket: !!this.websocketManager
                }
            });
        });

        /*
        this.app.get('/api/profile', authenticateToken, async (req, res) => {
            try {
                const userProfile = await this.database.findUserByEmail(req.user.email);
                const { password, ...profileData } = userProfile;
                res.json({ success: true, data: profileData });
            } catch (error) {
                res.status(500).json({ success: false, message: 'Internal server error' });
            }
        });
        */
    }

    setupWebRoutes() {
        console.log('🌐 Setting up web-specific routes...');

        // Serial routes
        this.app.get('/api/serial/status', (req, res) => {
            if (!this.serialManager) {
                return res.status(503).json({ success: false, error: 'Serial service not available' });
            }
            const status = this.serialManager.getStatus();
            res.json({ success: true, data: status });
        });

        this.app.post('/api/serial/reconnect', (req, res) => {
            if (!this.serialManager) {
                return res.status(503).json({ success: false, error: 'Serial service not available' });
            }
            this.serialManager.forceReconnect();
            res.json({ success: true, message: 'Reconnection initiated' });
        });

        this.app.post('/api/serial/disconnect', (req, res) => {
            if (!this.serialManager) {
                return res.status(503).json({ success: false, error: 'Serial service not available' });
            }
            this.serialManager.disconnect();
            res.json({ success: true, message: 'Disconnected' });
        });

        this.app.post('/api/serial/scan', async (req, res) => {
            if (!this.serialManager) {
                return res.status(503).json({ success: false, error: 'Serial service not available' });
            }
            const ports = await this.serialManager.scanPorts();
            res.json({ success: true, data: ports });
        });

        // WebSocket endpoint
        if (this.websocketManager) {
            this.app.ws('/ws', (ws, req) => {
                console.log('WebSocket client connected');
                this.websocketManager.handleConnection(ws, req);
            });
        }

        // Generic database routes - mirroring IPC functionality
        this.app.get('/api/data/:table', async (req, res) => {
            try {
                const { table } = req.params;
                const filters = req.query.filters ? JSON.parse(req.query.filters) : {};
                const options = req.query.options ? JSON.parse(req.query.options) : {};
                
                const result = await this.database.getDataByFilters(table, filters, options);
                res.json({ success: true, data: result });
            } catch (error) {
                console.error('Error in get data:', error);
                res.status(500).json({ success: false, error: error.message });
            }
        });

        this.app.post('/api/data/:table', async (req, res) => {
            try {
                const { table } = req.params;
                const { data } = req.body;
                
                const result = await this.database.postData(table, data);
                res.json({ success: true, id: result.insertId });
            } catch (error) {
                console.error('Error in insert data:', error);
                res.status(500).json({ success: false, error: error.message });
            }
        });

        this.app.put('/api/data/:table', async (req, res) => {
            try {
                const { table } = req.params;
                const { data, whereClause, whereParams } = req.body;
                
                const result = await this.database.updateData(table, data, whereClause, whereParams);
                res.json({ success: true, affectedRows: result.affectedRows });
            } catch (error) {
                console.error('Error in update data:', error);
                res.status(500).json({ success: false, error: error.message });
            }
        });

        this.app.delete('/api/data/:table', async (req, res) => {
            try {
                const { table } = req.params;
                const { whereClause, whereParams } = req.body;
                
                const result = await this.database.deleteData(table, whereClause, whereParams);
                res.json({ success: true, affectedRows: result.affectedRows });
            } catch (error) {
                console.error('Error in delete data:', error);
                res.status(500).json({ success: false, error: error.message });
            }
        });

        // Serial routes (only if serial manager is available)
        if (this.serialManager) {
            this.app.get('/api/serial/status', async (req, res) => {
                try {
                    const status = this.serialManager.getStatus();
                    res.json({ success: true, data: status });
                } catch (error) {
                    res.status(500).json({ success: false, error: error.message });
                }
            });

            this.app.post('/api/serial/reconnect', async (req, res) => {
                try {
                    await this.serialManager.forceReconnect();
                    res.json({ success: true, message: 'Reconnection initiated' });
                } catch (error) {
                    res.status(500).json({ success: false, error: error.message });
                }
            });

            this.app.post('/api/serial/disconnect', async (req, res) => {
                try {
                    await this.serialManager.disconnect();
                    res.json({ success: true, message: 'Disconnected successfully' });
                } catch (error) {
                    res.status(500).json({ success: false, error: error.message });
                }
            });

            this.app.post('/api/serial/scan', async (req, res) => {
                try {
                    await this.serialManager.scanForBetterPorts();
                    res.json({ success: true, message: 'Port scanning initiated' });
                } catch (error) {
                    res.status(500).json({ success: false, error: error.message });
                }
            });

            this.app.post('/api/serial/dynamic-switching', async (req, res) => {
                try {
                    const { enabled } = req.body;
                    this.serialManager.setDynamicPortSwitching(enabled);
                    res.json({ success: true, message: `Dynamic switching ${enabled ? 'enabled' : 'disabled'}` });
                } catch (error) {
                    res.status(500).json({ success: false, error: error.message });
                }
            });

            this.app.post('/api/serial/send', async (req, res) => {
                try {
                    const { data } = req.body;
                    this.serialManager.sendData(data);
                    res.json({ success: true, message: 'Data sent successfully' });
                } catch (error) {
                    res.status(500).json({ success: false, error: error.message });
                }
            });
        }

        // WebSocket routes (if websocket manager is available)
        if (this.websocketManager) {
            this.app.get('/api/websocket/status', (req, res) => {
                try {
                    const status = this.websocketManager.getStatus();
                    res.json({ success: true, data: status });
                } catch (error) {
                    res.status(500).json({ success: false, error: error.message });
                }
            });
        }

        // SPA fallback route (serve React app for any non-API routes)
        if (process.env.SERVE_STATIC === 'true') {
            this.app.get('*', (req, res) => {
                // Don't serve index.html for API routes
                if (req.path.startsWith('/api/')) {
                    return res.status(404).json({ success: false, error: 'API endpoint not found' });
                }
                
                const indexPath = path.join(__dirname, '../../build', 'index.html');
                res.sendFile(indexPath);
            });
        }

        console.log('✅ Web routes setup complete');
    }

    start() {
        this.server = this.app.listen(this.port, () => {
            console.log(`🚀 API server listening at http://localhost:${this.port}`);
            console.log(`📊 Mode: ${this.mode}`);
            if (this.mode === 'web' || this.mode === 'both') {
                console.log(`🌐 Web API endpoints available at http://localhost:${this.port}/api/`);
            }
        });
    }

    async stop() {
        if (this.server) {
            return new Promise((resolve) => {
                this.server.close(() => {
                    console.log('🛑 API server stopped');
                    resolve();
                });
            });
        }
    }

    getApp() {
        return this.app;
    }

    getPort() {
        return this.port;
    }

    // New method to check if server is running
    isRunning() {
        return this.server !== null && this.server.listening;
    }

    // New method to get server info
    getServerInfo() {
        return {
            port: this.port,
            mode: this.mode,
            isRunning: this.isRunning(),
            services: {
                database: !!this.database,
                serial: !!this.serialManager,
                websocket: !!this.websocketManager
            }
        };
    }
}

module.exports = APIServer;